/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import { ethErrors } from 'eth-rpc-errors';
import { BigNumber, ethers, utils } from 'ethers';
import log from 'loglevel';
import { container } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';

import { AccountService } from '../../usecase/accounts';
import { DappService } from '../../usecase/dapp';
import { GasService } from '../../usecase/gas';
import { GasFeeService } from '../../usecase/gas/gasFee';
import { NetworkService } from '../../usecase/network';
import { ProviderService } from '../../usecase/provider';
import { RuleService } from '../../usecase/rule';
// import { DekeyStore } from '../../usecase/store';
import { TransactionService } from '../../usecase/transaction';
import { MutexService } from '../../usecase/transaction/mutex';
import { NonceTracker } from '../../usecase/transaction/nonceTracker';
import { TxQueueService } from '../../usecase/transaction/queue';
import GasUtil from '../../utils/gas';
import { getEtherscanApiUrl, isKlaytn, supportsEIP1559 } from '../../utils/network';
import RuleUtil from '../../utils/rule';
import { addHexPrefix } from '../../utils/string';
import TransactionUtil from '../../utils/transaction';
import { ACTIVE_ACCOUNT, CURRENT_NETWORK, LOCKED, USER } from '../db/constants';
// import triggerUi from '../notification/triggerUi';
import { DappTxReqParam, NetworkModel, TX_SOURCE } from '../transactions/interface';
import { DekeyData } from '../../dekeyData';
import { UserModel } from '../accounts/interface';
import { z } from 'zod';

import { Account } from '../../schema/model';
// interface Account {
//   id: number;
//   sid: string;
//   ethAddress: string;
//   pubkey: string;
//   icon: string;
//   name: string;
//   signer: string;
// }

class DappController {
  constructor(
    private dappService: DappService,
    private networkService: NetworkService,
    private accountService: AccountService,
    private transactionService: TransactionService,
    private providerService: ProviderService,
    private ruleService: RuleService,
    private gasService: GasService,
    private txQueueService: TxQueueService,
    // private dekeyStore: DekeyStore,
    private nonceTracker: NonceTracker,
    private gasFeeService: GasFeeService,
    private mutexService: MutexService
  ) {
    this.dappService.on('dappResult', this.handleDappResult.bind(this));
  }

  async sendDappTransaction(payload: any, account: Account, user: UserModel) {
    console.log('--- sendDappTransaction ---', payload);
    return new Promise(async (resolve, reject) => {
      try {
        // const state = this.dekeyStore.getState();
        // const locked = state[LOCKED];
        // const account = state[ACTIVE_ACCOUNT];
        // const network = state[CURRENT_NETWORK] as NetworkModel;
        // const user = state[USER];

        const network = DekeyData.DEFAULT_NETWORKS[7];

        // if (locked) {
        //   return this.handleDappResult(payload, undefined);
        // }

        const { origin: domainName } = payload;
        const {
          data,
          from,
          value,
          to, // contractAddress
          type, // klaytn network type
          feeRatio, // klaytn network feeRatio
        } = payload.params[0] as DappTxReqParam;

        const txParams = TransactionUtil.normalizeTxParams(payload.params[0]);
        TransactionUtil.validateTxParams(txParams, account.ethAddress);

        const latestBlock = await this.providerService.getLatestBlock();

        // ensure value
        // txParams.value = value ? addHexPrefix(value) : '0x0';

        let gasLimit = payload.params[0]?.gas;
        if (!gasLimit) {
          const { blockGasLimit, estimatedGasHex, simulationFails } =
            await this.gasService.analyzeGasUsage(
              // payload.params[0],
              { data, from, to, value: value ? addHexPrefix(value) : '0x0' },
              latestBlock
            );

          gasLimit = GasUtil.addGasBuffer(
            addHexPrefix(estimatedGasHex),
            blockGasLimit,
            network.chainId
          );
        }

        const funcName = await this.ruleService.getFuncName(
          to,
          data,
          getEtherscanApiUrl(network.chainId)
        );

        // TOOD: move this to util after getGasPrice called outside somewhere
        await this.dappService.createDappTx({
          ...payload.params[0],
          bSupportsEIP1559: supportsEIP1559(network),
          gasLimit,
          baseFeePerGas: latestBlock?.baseFeePerGas,
          domainName,
          funcName,
          payload,
          network,
          signer: account?.signer,
          getGasPrice: () => this.gasService.getGasPrice(),
          resolve,
          reject,
        });

        // TOOD: move this to util
        const isAutoconfirm = RuleUtil.checkAutoConfirmRuleExists({
          contractAddress: to ? utils.getAddress(to) : '', // Normalize any supported address-format to a checksum address. // Peter H. Nahm null -> ''
          chainId: network.chainId,
          data,
          autoconfirms: user.autoconfirms,
          account,
        });

        // if (!isAutoconfirm) {
        //   /**
        //    * Handle Non autoconfirm dapp tx
        //    * UI make use of this.dappTx
        //    * If gasPrice, gasLimit, maxFeePerGas or maxPriorityPerGas changes
        //    * UI calls update_dapp_tx_info
        //    */
        //   return triggerUi('popup.html#send');
        // }

        /**
         * Send autoconfirm tx
         */
        const dappAlertId = uuidv4();
        const tabId = payload.tabId;

        const gasData = await this.gasService.makeAutoconfirmGasData({
          networkService: this.networkService,
          gasFeeService: this.gasFeeService,
          // dekeyStore: this.dekeyStore,
          latestBlock,
        });

        const { nextNonce, releaseLock } = await this.nonceTracker.getNonceLock(
          account.ethAddress,
          network.chainId,
          this.mutexService,
          account
        );

        return this.txQueueService.add({
          txParams: {
            ...gasData,
            ...(isKlaytn(network.chainId) && { type }),
            ...(!isKlaytn(network.chainId) && Boolean(gasData?.maxFeePerGas) && { type: 2 }),
            to,
            nonce: nextNonce,
            data,
            gasLimit,
            value,
            chainId: network.chainId,
          },
          dappInfo: {
            domainName,
            funcName,
            payload,
            // res,
          },
          autoconfirm: {
            tabId,
            dappAlertId,
          },
          account,
          txSource: TX_SOURCE.AUTOCONFIRM,
          network,
          dappResolve: resolve,
          dappReject: reject,
          releaseLock,
        });
      } catch (error) {
        throw error;
      }
    });
  }

  // async processOnetimeDappTx({resolve, reject}) {
  async confirmDappTransaction(unsignedTx: any, account: Account) {
    const { domainName, funcName, payload, resolve, reject } = this.dappService.getDappTx();

    try {
      // const state = this.dekeyStore.getState();
      // const network = state[CURRENT_NETWORK];
      // const account = state[ACTIVE_ACCOUNT];
      const network = DekeyData.DEFAULT_NETWORKS[7];

      this.txQueueService.add({
        txParams: unsignedTx,
        dappInfo: {
          domainName,
          funcName,
          payload,
        },
        txSource: TX_SOURCE.ONETIME_DAPP,
        account,
        network,
        dappResolve: resolve,
        dappReject: reject,
      });
    } catch (error) {
      reject(error);
    }
  }

  // Dapp tx info for UI
  getDappTxInfo = async (account: Account) => {
    try {
      const {
        baseFeePerGas,
        data,
        domainName,
        from,
        gasPrice,
        gasLimit,
        gas,
        value,
        funcName,
        to,
      } = this.dappService.getDappTx();

      // const balance = await this.accountService.updateEthBalance();

      // const state = this.dekeyStore.getState();
      // const network = state[CURRENT_NETWORK];
      // const account = state[ACTIVE_ACCOUNT];
      const network = DekeyData.DEFAULT_NETWORKS[7];

      const bSupportsEIP1559 = supportsEIP1559(network);

      // const dappGasFee = GasUtil.calculateDappGasFee({
      //   bSupportsEIP1559,
      //   isMpcSigner: account.signer === 'mpc',
      //   baseFeePerGas,
      //   gasPrice,
      //   gas,
      // });

      // const total = ethers.utils.formatEther(
      //   dappGasFee.add(BigNumber.from(value || '0'))
      // );

      // const isSendEnabled = +balance !== 0 && +balance >= +total;

      return {
        contractAddress: to,
        domainName,
        data,
        from,
        gasPrice:
          bSupportsEIP1559 && account.signer === 'mpc'
            ? '0'
            : ethers.utils.formatUnits(gasPrice!, 'gwei'),
        gas: BigNumber.from(gas).toString(),
        // gasFee: ethers.utils.formatEther(dappGasFee),
        amount: ethers.utils.formatEther(value || '0'),
        // total,
        to,
        method: funcName,
        // isSendEnabled,
        txCategory: this.transactionService.getTxCategory({ data, to }),
        symbol: network.symbol,
        // baseFeePerGas,
      };
    } catch (error) {
      throw error;
    }
  };

  async updateDappTxInfo({
    gasPrice,
    gasLimit,
    maxFeePerGas,
    maxPriorityFeePerGas,
  }: {
    gasPrice?: string;
    gasLimit?: string;
    maxFeePerGas?: string;
    maxPriorityFeePerGas?: string;
  }) {
    try {
      this.dappService.updateDappTx({
        gasPrice: gasPrice ? ethers.utils.parseUnits(gasPrice, 'gwei').toHexString() : null,
        gasLimit: gasLimit ? ethers.BigNumber.from(gasLimit).toHexString() : null,
        maxFeePerGas: maxFeePerGas
          ? ethers.utils.parseUnits(maxFeePerGas, 'gwei').toHexString()
          : null,
        maxPriorityFeePerGas: maxPriorityFeePerGas
          ? ethers.utils.parseUnits(maxPriorityFeePerGas, 'gwei').toHexString()
          : null,
      });
    } catch (error) {
      throw error;
    }
  }

  async getUnsignedTxForDappTx(activeAccount: Account) {
    console.log('===== getUnsignedTxForDappTx');
    // const { activeAccount } = this.dekeyStore.getState();
    console.log('===== getUnsignedTxForDappTx =', activeAccount);
    const dappTx = this.dappService.getDappTx();
    console.log('===== getUnsignedTxForDappTx =', dappTx);
    const txParams = this.dappService.getTxParamsByDappTx(activeAccount.ethAddress, dappTx);
    console.log('===== getUnsignedTxForDappTx =', txParams);
    const { nextNonce } = await this.nonceTracker.getNetworkNonce(activeAccount.ethAddress);
    console.log('===== getUnsignedTxForDappTx =', nextNonce);
    return {
      ...txParams,
      nonce: nextNonce,
    };
  }

  cancelTx() {
    try {
      const { payload, resolve, reject } = this.dappService.getDappTx();
      reject(ethErrors.provider.userRejectedRequest('User denied transaction signature.'));
    } catch (error) {}
  }

  // registerAutoconfirm({resolve, reject}) {
  registerAutoconfirm(unsignedTx: any, account: Account) {
    try {
      // const state = this.dekeyStore.getState();
      // const network = state[CURRENT_NETWORK];
      // const account = state[ACTIVE_ACCOUNT];
      const network = DekeyData.DEFAULT_NETWORKS[7];

      const { domainName, funcName, payload, resolve, reject } = this.dappService.getDappTx();

      this.txQueueService.add({
        txParams: unsignedTx,
        dappInfo: {
          domainName,
          funcName,
          payload,
        },
        txSource: TX_SOURCE.REGISTER_AUTOCONFIRM,
        account,
        network,
        dappResolve: resolve,
        dappReject: reject,
      });
    } catch (error) {}
  }

  handleDappResult(payload: any, result: any) {
    log.info('handleDappResult', { payload, result });
    this.dappService.payloadHandler({
      id: payload?.id,
      jsonrpc: payload?.jsonrpc,
      result,
    });
  }

  handleDappError(payload: any, error: any) {
    this.dappService.payloadHandler({
      id: payload?.id,
      jsonrpc: payload?.jsonrpc,
      error,
    });
  }
}

export default DappController;
