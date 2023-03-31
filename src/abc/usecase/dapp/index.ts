/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import {BigNumber} from 'ethers';
import EventEmitter from 'events';
import log from 'loglevel';

import {
  DappTxInput,
  NetworkModel,
  TxType,
  TX_SOURCE,
} from '../../main/transactions/interface';
import {isKlaytn} from '../../utils/network';

const colors = ['#e8f5e9', '#c8e6c9', '#a5d6a7', '#81c784', '#388e3c'];

export class DappService extends EventEmitter {
  subs = {accountsChanged: [], chainChanged: [], networkChanged: []};
  pending = {};
  _dappTx: DappTxInput;

  constructor() {
    super();
  }

  payloadHandler = async payload => {
    if (!payload) return;

    try {
      if (typeof payload.id !== 'undefined') {
        if (this.pending[payload.id]) {
          const {tabId, payloadId, method} = this.pending[payload.id];
          if (
            this.pending[payload.id].method === 'eth_subscribe' &&
            payload.result
          ) {
            this.subs[payload.result] = {
              tabId,
              send: subload => chrome.tabs.sendMessage(tabId, subload),
            };
          } else if (
            this.pending[payload.id].method === 'this.eth_unsubscribe'
          ) {
            const params = payload.params ? [].concat(payload.params) : [];
            params.forEach(sub => delete this.subs[sub]);
          }

          // this.handleActiveRequest(this.pending[payload.id].payload, payload)

          chrome.tabs.sendMessage(
            tabId,
            Object.assign({}, payload, {id: payloadId})
          );

          // TODO: handle this
          // await this.addToCache(this.pending[payload.id].payload, payload);

          delete this.pending[payload.id];
        }
      } else if (
        payload.method &&
        payload.method.indexOf('_subscription') > -1 &&
        this.subs[payload.params.subscription]
      ) {
        // Emit subscription result to tab
        this.subs[payload.params.subscription].send(payload);
      }
    } catch (error) {}
  };

  setDappTx(val: DappTxInput) {
    this._dappTx = val;
  }

  _emitAutoconfirmEvent(origin, params) {
    this.emit('autoconfirm', origin, params);
  }

  async createDappTx({
    bSupportsEIP1559,
    data, // hex string
    from, // hex string
    value, // wei hex string
    gasPrice, // wei hex string
    gasLimit, // hex string
    to, // hex string
    baseFeePerGas, // wei hex string
    domainName,
    funcName,
    payload,
    type,
    feeRatio,
    network,
    signer,
    getGasPrice,
    resolve,
    reject,
  }) {
    const dappTx = {
      data,
      from,
      value,
      domainName,
      funcName,
      payload,
      to,
      gasLimit,
      gas: gasLimit,
      klayType: type,
      feeRatio,
      chainId: network.chainId,
      resolve,
      reject,
    } as any;

    // TODO: make different createDappTx for this two cases
    /** UI uses baseFeePerGas to calculate maxFeePerGas and maxPriorityFeePerGas  */
    if (bSupportsEIP1559 && signer === 'mpc') {
      dappTx.baseFeePerGas = baseFeePerGas;
      // this.dappTx.gasFee =
      //   await provider.gasFeeController.fetchGasFeeEstimates();
    } else if (!bSupportsEIP1559 || signer === 'ledger') {
      const gasPriceFromNode = await getGasPrice();
      dappTx.gasPrice =
        gasPrice ?? BigNumber.from(gasPriceFromNode).toHexString();
    }

    this._dappTx = dappTx;
  }

  getDappTx() {
    return this._dappTx;
  }

  updateDappTx({gasPrice, gasLimit, maxPriorityFeePerGas, maxFeePerGas}) {
    this._dappTx = {
      ...this._dappTx,
      gasPrice: gasPrice ?? this._dappTx.gasPrice,
      gasLimit: gasLimit ?? this._dappTx.gasLimit,
      maxPriorityFeePerGas:
        maxPriorityFeePerGas ?? this._dappTx.maxPriorityFeePerGas,
      maxFeePerGas: maxFeePerGas ?? this._dappTx.maxFeePerGas,
    };
  }

  getTxParamsByDappTx(ethAddress: string, dappTx) {
    try {
      const {
        maxFeePerGas,
        maxPriorityFeePerGas,
        to,
        chainId,
        value,
        data,
        klayType,
        gasLimit,
        gasPrice,
      } = dappTx;

      // EIP-1559
      if (Boolean(maxFeePerGas)) {
        return {
          chainId,
          gasLimit,
          maxFeePerGas,
          maxPriorityFeePerGas,
          type: 2,
          ...(data && {data}),
          ...(to && {to}),
          ...(value && {value}),
          ...(klayType && {type: klayType, from: ethAddress}),
        };
      }
      return {
        chainId,
        gasLimit,
        gasPrice,
        ...(data && {data}),
        ...(to && {to}),
        ...(value && {value}),
        ...(klayType && {type: klayType, from: ethAddress}), // https://www.codegrepper.com/code-examples/javascript/object+add+element+only+if+not+undefined
      };
    } catch (error) {
      throw error;
    }
  }

  createAutoconfirmAlertBox(origin: string, dappAlertId: string) {
    // if (!sender || !sender.tab || !sender.tab.id) {
    //   throw new Error('Invalid params');
    // }
    // const tabId = sender.tab.id;
    // const dappAlertId = uuidv4();

    this._emitAutoconfirmEvent(origin, {
      type: 'popup-modal',
      data: {
        id: dappAlertId,
        bgColor: colors[0],
      },
    });
  }

  alertTxApproved(autoconfirm, txType, dappInfo) {
    if (autoconfirm && txType !== TxType.CANCEL && txType !== TxType.RETRY) {
      const {tabId, dappAlertId} = autoconfirm;
      const {domainName} = dappInfo;

      this._emitAutoconfirmEvent(domainName, {
        type: 'popup-modal-update',
        data: {
          id: dappAlertId,
          bgColor: colors[1],
          status: 'SENDING',
        },
      });
    }
  }

  alertTxSubmitted({
    domainName,
    autoconfirm,
    network,
    etherscanTxUrl,
    txSource,
    txType,
  }: {
    domainName: string;
    autoconfirm;
    network: NetworkModel;
    etherscanTxUrl: string;
    txSource: TX_SOURCE;
    txType: TxType;
  }) {
    if (
      txSource !== TX_SOURCE.ERC20 &&
      autoconfirm &&
      txType !== TxType.CANCEL &&
      txType !== TxType.RETRY
    ) {
      const {tabId, dappAlertId} = autoconfirm;

      this._emitAutoconfirmEvent(domainName, {
        type: 'popup-modal-update',
        data: {
          id: dappAlertId,
          bgColor: colors[2],
          etherscanTxUrl: isKlaytn(network.chainId) ? null : etherscanTxUrl,
        },
      });

      // chrome.tabs.sendMessage(tabId, {
      //   type: 'popup-modal-update',
      //   data: {
      //     id: dappAlertId,
      //     bgColor: colors[2],
      //     etherscanTxUrl: networkDomain.isKlaytn() ? null : etherscanTxUrl,
      //   },
      // });
    }
  }

  alertTxConfirmed(
    domainName: string,
    dappAlertId,
    network: NetworkModel,
    etherscanTxUrl: string
  ) {
    if (isKlaytn(network.chainId)) {
      this._emitAutoconfirmEvent(domainName, {
        type: 'popup-modal-update',
        data: {
          id: dappAlertId,
          bgColor: colors[4],
          status: 'COMPLETE',
          etherscanTxUrl,
        },
      });
    }
    this._emitAutoconfirmEvent(domainName, {
      type: 'popup-modal-update',
      data: {
        id: dappAlertId,
        bgColor: colors[4],
        status: 'COMPLETE',
      },
    });
  }

  isDappTx = (type: TX_SOURCE) => {
    return (
      type === TX_SOURCE.ONETIME_DAPP ||
      type === TX_SOURCE.REGISTER_AUTOCONFIRM ||
      type === TX_SOURCE.AUTOCONFIRM
    );
  };

  emitEvent(name: string, ...args) {
    this.emit(name, ...args);
  }

  emitDappResultEvent({txSource, txType, payload, dappResult}) {
    if (
      this.isDappTx(txSource) &&
      txType !== TxType.CANCEL &&
      txType !== TxType.RETRY
    ) {
      this.emitEvent('dappResult', payload, dappResult);
    }
  }
}
