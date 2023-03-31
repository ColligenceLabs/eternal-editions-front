/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import { ACCESS_TOKEN, CURRENT_NETWORK, LOCKED } from '../../main/db/constants';
import { NetworkModel, TxModel } from '../../main/transactions/interface';
// import { DekeyStore } from '../store';
import { EventEmitter } from 'events';
import { ProviderConnectionManager } from './connectionManager';
import { isKlaytn } from '../../utils/network';

export class ProviderService extends EventEmitter {
  provider;
  connection;
  query;
  ethersProvider;
  // dekeyStore;
  connected;
  web3;
  chainId;
  caver; // TODO: make caver instance

  constructor(
    // private dekeyStore: DekeyStore,
    private providerConnectionManager: ProviderConnectionManager
  ) {
    super();

    // this.providerConnectionManager.on(
    //   'connected',
    //   this.handleProviderConnected.bind(this)
    // );
  }

  // handleProviderConnected(payload) {
  //   this.emit('connected', payload);
  // }

  async connect(network: NetworkModel, accToken: string) {
    try {
      // const state = this.dekeyStore.getState();
      // const accToken = state[ACCESS_TOKEN];
      await this.providerConnectionManager.connect(
        network,
        accToken
        // this.handleBlockTracker.bind(this)
      );
      // this.dekeyStore.updateStore({
      //   [CURRENT_NETWORK]: network,
      // });
      this.emit('connected', network);
    } catch (error) {
      throw error;
    }
  }

  async getGasPrice(): Promise<string> {
    return this.providerConnectionManager.getGasPrice();
  }

  broadcastTx(
    rawTx: string,
    txId: string,
    dappResolve,
    dappReject,
    releaseLock,
    txModel: TxModel,
    dappInfo
  ) {
    this.providerConnectionManager
      .broadcastTx(rawTx, txId, txModel)
      .then((txHash: string) => {
        if (!txHash) {
          this.emit('broadcast:failed', {
            txId,
            message: 'no tx hash from node',
            dappInfo,
            dappReject,
          });
        }
        this.emit('broadcasted', {
          processingTxId: txId,
          hash: txHash,
          dappResult: txHash,
          dappResolve,
          dappReject,
        });
      })
      .catch((error) => {
        this.emit('broadcast:failed', {
          txId,
          message: error.message,
          dappInfo,
          dappReject,
        });
      })
      .finally(() => {
        if (releaseLock) {
          releaseLock();
        }
      });
  }

  emitBroadCastedEvent(txId: string, txHash: string, dappResult: any, dappResolve) {
    this.emit('broadcasted', {
      processingTxId: txId,
      hash: txHash,
      dappResult,
      dappResolve,
    });
  }

  async getTransactionCount(address: string) {
    return this.providerConnectionManager.getTransactionCount(address);
  }

  async getLatestBlock() {
    return this.providerConnectionManager.getLatestBlock();
  }

  async getBalance(address: string) {
    return this.providerConnectionManager.getBalance(address);
  }

  async getCode(to: string) {
    return this.providerConnectionManager.getCode(to);
  }

  async estimateGas(txMeta) {
    return this.providerConnectionManager.estimateGas(txMeta);
  }

  async getTransactionReceipt(txHash: string, chainId: number) {
    return isKlaytn(chainId)
      ? this.providerConnectionManager.getKlaytnTransactionReceipt(txHash)
      : this.providerConnectionManager.getTransactionReceipt(txHash);
  }
}
