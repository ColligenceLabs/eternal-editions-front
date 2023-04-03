/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import { BigNumber, ethers, utils } from 'ethers';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { container, singleton } from 'tsyringe';

const Hash = require('eth-lib/lib/hash');

import {
  Autoconfirm,
  DappTxInput,
  NetworkModel,
  TxModel,
  TxParams,
  TxStatus,
  TxType,
  TX_SOURCE,
} from '../../main/transactions/interface';
import TxInfra from '../../infra/rest-api/transaction';
import {
  ACTIVE_ACCOUNT,
  CURRENT_NETWORK,
  ES_TXS,
  MAIN_ASSET_BLOCK_NUMBERS_FOR_INCOFMING_TXS,
  PENDING_TXS,
} from '../../main/db/constants';
// import {DekeyStore} from '../store';
import EventEmitter from 'events';
import { MpcService } from '../mpc';
import { AccountService } from '../accounts';
import { getBlockExplorerUrlForTx, getEtherscanApiUrl, isKlaytn } from '../../utils/network';
import IncomingTxUtil from '../../utils/incomingTx';
import TransactionUtil from '../../utils/transaction';
import KlaytnUtil from '../../utils/klaytn';
import { Account } from '../../schema/model';
import { MutexService } from './mutex';
import { CustomError } from '../../utils/error';
import { DekeyError } from '../../utils/errorTypes';
import RuleUtil from '../../utils/rule';
import { DekeyData } from '../../dekeyData';
import env from '../../../env';

export interface ProcessingTx {
  txId: string;
  txParams: TxParams;
  originTxId: string;
  txSource: TX_SOURCE;
  account: Account;
  autoconfirm;
  network: NetworkModel;
  resolve: Function;
  dappInfo: DappTxInput;
  nonce: number;
  txType: TxType;
  dappResolve: Function;
  dappReject: Function;
  releaseLock: Function;
}

export class TransactionService extends EventEmitter {
  _processingTxs: Map<string, ProcessingTx>;

  constructor(
    // private dekeyStore: DekeyStore,
    private accountService: AccountService
  ) {
    super();
    this._processingTxs = new Map();

    // this.accountService.on(
    //   'account:changed',
    //   this.handleChangeActiveAccount.bind(this)
    // );
  }

  // handleChangeActiveAccount = () => {
  //   this.syncIncomingTxs();
  // };

  syncIncomingTxs = (account: Account) => {
    // const state = this.dekeyStore.getState();
    // const account = state[ACTIVE_ACCOUNT];
    // const network = state[CURRENT_NETWORK];
    const network = DekeyData.DEFAULT_NETWORKS[env.REACT_APP_TARGET_NETWORK === 137 ? 6 : 7];

    if (isKlaytn(network.chainId)) {
      this.setKlaytnTxs({
        address: account.ethAddress,
        aaid: account.id,
        blockExplorerUrl: network.blockExplorerUrl,
        chainId: network.chainId,
      });
    } else {
      const url = getEtherscanApiUrl(network.chainId);
      this.setEtherTxs(url);
    }
  };

  setEtherTxs = async (etherscanUrl: string, account: Account) => {
    try {
      const state = this.dekeyStore.getState();

      // const currentNetwork = state[CURRENT_NETWORK];
      const currentNetwork =
        DekeyData.DEFAULT_NETWORKS[env.REACT_APP_TARGET_NETWORK === 137 ? 6 : 7];
      // const account = state[ACTIVE_ACCOUNT];
      // TODO : 확인이 필요함...
      // const esTxs = state[ES_TXS] ?? [];
      // const blockNumbers = state[MAIN_ASSET_BLOCK_NUMBERS_FOR_INCOFMING_TXS] ?? {};
      const esTxs = [];
      const blockNumbers = {};

      const chainId = currentNetwork.chainId;
      const address = account.ethAddress;

      const etherscanTxs = await TxInfra.getTransactions({
        address,
        url: etherscanUrl,
        blockNumber: IncomingTxUtil.getBlockNumberForEtherTxs({
          blockNumbers,
          chainId,
          address,
        }),
        chainId: currentNetwork.chainId,
      });

      const trasformedTxs = IncomingTxUtil.transformEtherTxs({
        etherscanTxs,
        address,
        chainId,
        accountId: account.id,
      });

      const uniqEsTxs = _.uniqBy([...trasformedTxs, ...esTxs], 'hash');

      const result = {
        [ES_TXS]: RuleUtil.constrainArrayMaxLength(uniqEsTxs, 200),
      };

      if (trasformedTxs && trasformedTxs[0] && trasformedTxs[0].blockNumber) {
        const { blockNumber, timeStamp, hash } = trasformedTxs[0];
        result[MAIN_ASSET_BLOCK_NUMBERS_FOR_INCOFMING_TXS] =
          IncomingTxUtil.addMainAssetBlockNumbersForIncomingTxs({
            blockNumbers,
            chainId,
            address,
            blockNumber,
          });

        if (!TransactionUtil.showTxReceivedToast(+timeStamp)) return;

        const options = {
          type: 'basic',
          title: chrome.i18n.getMessage('txt_Ticker_Send_Complete_Toast_Title'),
          message: chrome.i18n.getMessage('txt_Ticker_Receive_Completed', [currentNetwork.symbol]),
          iconUrl: './favicon_128.png',
        };

        const etherscanTxUrl = getBlockExplorerUrlForTx(currentNetwork.blockExplorerUrl, hash);

        chrome.notifications.create(etherscanTxUrl + '*status*receive', options, () => {});
      }

      // this.dekeyStore.updateStore(result);
    } catch (error) {
      throw new CustomError(DekeyError.syncNativeCurrencyIncomingTxs(error.message));
    }
  };

  setKlaytnTxs = async ({
    address,
    aaid,
    chainId,
    blockExplorerUrl,
  }: {
    address: string;
    aaid: number;
    chainId: number;
    blockExplorerUrl: string;
  }) => {
    try {
      // const { esTxs, currentNetwork } = this.dekeyStore.getState();
      const currentNetwork =
        DekeyData.DEFAULT_NETWORKS[env.REACT_APP_TARGET_NETWORK === 137 ? 6 : 7];
      let esTxs = [];

      const lastTx = esTxs.filter((tx) => tx.chainId === chainId)[0];
      const fromTimestamp = lastTx ? +lastTx.timeStamp : null;

      const fetchedTxs = await TxInfra.getKlaytnTransactions(
        address,
        String(chainId),
        fromTimestamp
      );

      const trasformedTxs = IncomingTxUtil.transformKlaytnTxs({
        items: fetchedTxs.items,
        chainId,
        accountId: aaid,
        address,
      });

      if (trasformedTxs?.length > 0) {
        const { timeStamp, hash } = trasformedTxs[0];
        // TODO : 확인이 필요함...
        // this.dekeyStore.updateStore({
        //   [ES_TXS]: RuleUtil.constrainArrayMaxLength(
        //     _.uniqBy([...trasformedTxs, ...esTxs], 'hash'),
        //     200
        //   ),
        // });

        if (!TransactionUtil.showTxReceivedToast(+timeStamp)) return;

        const options = {
          type: 'basic',
          title: chrome.i18n.getMessage('txt_Ticker_Send_Complete_Toast_Title'),
          message: chrome.i18n.getMessage('txt_Ticker_Receive_Completed', [currentNetwork.symbol]),
          iconUrl: './favicon_128.png',
        };

        const etherscanTxUrl = getBlockExplorerUrlForTx(currentNetwork.blockExplorerUrl, hash);

        chrome.notifications.create(etherscanTxUrl + '*status*receive', options, () => {});
      }
    } catch (error) {
      throw new CustomError(DekeyError.syncNativeCurrencyIncomingTxs(error.message));
    }
  };

  updateTxStatus = async ({ id, change, history, mutexService }, activeAccount: Account) => {
    // const { activeAccount } = this.dekeyStore.getState();
    const releaseLock = await mutexService.takeTxMutex(activeAccount.ethAddress);
    try {
      // TODO : 확인이 필요함...
      // const { pendingTxs } = this.dekeyStore.getState();
      const pendingTxs = [];

      if (_.isArray(pendingTxs)) {
        const newTxs = TransactionUtil.updateTxStatus({
          txs: pendingTxs,
          txId: id,
          change,
          history,
        });
        // this.dekeyStore.updateStore({
        //   pendingTxs: newTxs,
        //   ...(change.status === TxStatus.CONFIRMED && {
        //     showTxSuccessToast: true,
        //   }),
        //   ...(change.status === TxStatus.FAILED && {
        //     showTxFailedToast: true,
        //   }),
        // });
      }
      releaseLock();
    } catch (error) {
      releaseLock();
      throw error;
    }
  };

  getTxCategory = ({ data, to }) => {
    // if (data && !to) {
    //   return TRANSACTION_CATEGORIES.DEPLOY_CONTRACT;
    // }
    // return '';
  };

  // savePendingTx = async ({
  //   to,
  //   value = null,
  //   gasPrice = null,
  //   gasLimit,
  //   chainId,
  //   account,
  //   domainName = null,
  //   funcName = null,
  //   history = null,
  //   txSource = null,
  //   aaid,
  //   txType,
  //   status,
  //   nonce = null,
  //   data = null,
  //   type = null, // klaytn type
  //   tabId = null,
  //   dappAlertId = null,
  //   tokenSymbol = null,
  //   assetId = null,
  //   tokenDecimal = null,
  //   contractAddress = null,
  //   maxPriorityFeePerGas = null,
  //   maxFeePerGas = null,
  //   mutexService,
  //   networkId,
  // }): Promise<TxModel> => {
  savePendingTx = async (dto, mutexService: MutexService): Promise<TxModel> => {
    const { account, to, txSource, ethAddress, signer } = dto;

    const releaseLock = await mutexService.takeTxMutex(ethAddress);

    try {
      // TODO : 확인이 필요함...
      // const { pendingTxs } = this.dekeyStore.getState();
      const pendingTxs = [];
      const newTxInQueue: TxModel = {
        ...dto,
        id: uuidv4(),
        ...(to && { to: utils.getAddress(to) }),
        from: utils.getAddress(ethAddress),
        isAutoconfirm: txSource === TX_SOURCE.AUTOCONFIRM,
        timeStamp: Math.floor(new Date().getTime() / 1000).toString(),
        signer,
      };

      const addedPendingtxs = TransactionUtil.addPendingTx({
        txs: pendingTxs,
        item: newTxInQueue,
      });

      // this.dekeyStore.updateStore({
      //   [PENDING_TXS]: addedPendingtxs,
      // });

      return newTxInQueue;
    } catch (error) {
      throw error;
    } finally {
      releaseLock();
    }
  };

  async txSubmitted({ originTxId, txId, txParams, hash, mutexService }) {
    // retry or cancel tx
    if (originTxId) {
      await this.updateTxStatus({
        id: originTxId,
        change: {
          status: TxStatus.SUMMITTED,
        },
        history: TransactionUtil.makeTxHistory(TxStatus.SUMMITTED, txParams),
        mutexService,
      });
    }

    await this.updateTxStatus({
      id: txId,
      change: {
        status: TxStatus.SUMMITTED,
        hash,
      },
      history: TransactionUtil.makeTxHistory(TxStatus.SUMMITTED, txParams),
      mutexService,
    });
  }

  // await this.updateTxStatus({
  //   id: originTxId ?? txId,
  //   change: {
  //     status: TxStatus.SUMMITTED,
  //     ...(!originTxId && {hash}),
  //   },
  //   history: TransactionUtil.makeTxHistory(TxStatus.SUMMITTED, txParams),
  //   mutexService,
  // });

  // async signTx({
  //   txParams,
  //   autoconfirm,
  //   network,
  //   account,
  //   mpcService,
  //   txType,
  // }: {
  //   txParams: TxParams;
  //   autoconfirm: Autoconfirm;
  //   network: NetworkModel;
  //   account: Account;
  //   mpcService: MpcService;
  //   txType?: TxType;
  // }): Promise<string> {
  //   try {
  //     const {chainId} = network;

  //     const mpcToken = await this.getMpcJwtForSign({
  //       autoconfirm,
  //       txType,
  //       txParams,
  //     });

  //     // if (txParams.contractAddress) {
  //     //   delete unsignedTx.value;
  //     // }

  //     const serializedTx = ethers.utils.serializeTransaction(txParams as any);
  //     const messageHash = ethers.utils.keccak256(serializedTx);

  //     const sResult = await mpcService.sign({
  //       txHash: messageHash.slice(2),
  //       mpcToken,
  //       accountId: account.id,
  //     });
  //     const {r, s, vsource} = sResult;
  //     const v = TransactionUtil.calculateV({
  //       r,
  //       s,
  //       vsource,
  //       hash: messageHash,
  //       address: account.ethAddress,
  //       chainId,
  //     });

  //     const rawTx = ethers.utils.serializeTransaction(txParams as any, {
  //       v,
  //       r,
  //       s,
  //     });

  //     return rawTx;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async signMpcTx({
    txParams,
    account,
    mpcService,
    autoconfirm,
    txType,
  }: {
    txType: TxType;
    autoconfirm;
    txParams: any;
    account: Account;
    mpcService: MpcService;
  }): Promise<any> {
    console.log('-- signMpcTx -->', txParams);
    console.log('-- signMpcTx -->', account);
    console.log('-- signMpcTx -->', mpcService);
    console.log('-- signMpcTx -->', autoconfirm);
    console.log('-- signMpcTx -->', txType);
    try {
      const mpcToken = await this.getMpcJwtForSign({
        autoconfirm,
        txType,
        txParams,
      });

      const messageHash =
        isKlaytn(txParams.chainId) && txParams?.type
          ? KlaytnUtil.createTxHash(txParams)
          : TransactionUtil.createTxHash(txParams);

      console.log('4444444444');
      const sResult = await mpcService.sign({
        txHash: messageHash.slice(2),
        mpcToken,
        accountId: account.id,
      });

      const { r, s, vsource } = sResult;
      const v = TransactionUtil.calculateV({
        r,
        s,
        vsource,
        hash: messageHash,
        address: account.ethAddress,
        chainId: txParams.chainId,
      });

      return isKlaytn(txParams.chainId) && txParams?.type
        ? KlaytnUtil.createRawTx({ txParams, v, r, s })
        : TransactionUtil.createRawTx({ txParams, v, r, s });
    } catch (error) {
      throw error;
    }
  }

  async getMpcJwtForSign({ autoconfirm, txType, txParams }, mpcToken: string) {
    // const { mpcToken } = this.dekeyStore.getState();
    if (autoconfirm || txType === TxType.RETRY || txType === TxType.CANCEL) {
      return TxInfra.getMpcJwt({
        // signType: TransactionUtil.getSignTypeForMpcJwt({
        //   autoconfirm,
        //   txType,
        // }),
        signType: 'tx',
        message: JSON.stringify(txParams),
      });
    }
    return mpcToken;
  }

  setProcessingTxs(txId: string, data: ProcessingTx) {
    this._processingTxs.set(txId, data);
  }

  getProcessingTx(txId: string) {
    const tx = this._processingTxs.get(txId);
    if (!tx) {
      throw new Error(`No tx with txId: ${txId}`);
    }
    return tx;
  }

  deleteProcessingTx(txId: string) {
    this._processingTxs.delete(txId);
  }
}
