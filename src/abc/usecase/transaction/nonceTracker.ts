/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import { ACTIVE_ACCOUNT, CURRENT_NETWORK, PENDING_TXS } from '../../main/db/constants';
import { TxStatus, TxType } from '../../main/transactions/interface';
import { ProviderService } from '../provider';
// import {DekeyStore} from '../store';
import { MutexService } from './mutex';
import log from 'loglevel';
import { BigNumber } from 'ethers';
import { isKlaytn } from '../../utils/network';
import { DekeyData } from '../../dekeyData';
import { Account } from '../../schema/model';

export class NonceTracker {
  lockMap;
  txLockMap;

  constructor(
    // private dekeyStore: DekeyStore,
    private providerService: ProviderService
  ) {
    this.lockMap = {};
    this.txLockMap = {};
  }

  getNonceLock = async (
    address: string,
    chainId: number,
    mutexService: MutexService,
    txType?: TxType,
    nonce?: any,
    account: Account
  ) => {
    if (txType === TxType.RETRY || txType === TxType.CANCEL) {
      return {
        nextNonce: nonce,
        releaseLock: () => {},
      };
    }

    const releaseLock = await mutexService.takeMutex(address);

    // const state = this.dekeyStore.getState();
    // const network = state[CURRENT_NETWORK];
    const network = DekeyData.DEFAULT_NETWORKS[7];

    try {
      const networkNonceNext = await this.providerService.getTransactionCount(address);

      // const state = this.dekeyStore.getState();
      // TODO : 확인이 필요함...
      // const pendingTxs = state[PENDING_TXS] ?? [];
      const pendingTxs = [];
      // const account = state[ACTIVE_ACCOUNT];

      const activeAccountPendingTxs = pendingTxs.filter(
        (t) =>
          t.aaid === account.id &&
          // (t.status === TxStatus.CONFIRMED ||
          (t.status === TxStatus.APPROVED || t.status === TxStatus.SUMMITTED) &&
          t.chainId === chainId
        // new Date().getTime() - new Date(+t.timeStamp * 1000).getTime() < 60000
      );

      let nextNonce;
      if (
        isKlaytn(network.chainId) &&
        activeAccountPendingTxs.length > 0 &&
        this._checkToUseNetworkNonce(+activeAccountPendingTxs[0].timeStamp)
      ) {
        nextNonce = networkNonceNext;
      } else {
        nextNonce = this._getHighestContinuousFrom(activeAccountPendingTxs, networkNonceNext) || 0;
      }

      log.info('nextNonce', nextNonce);

      return {
        nextNonce,
        releaseLock,
      };
    } catch (error) {
      // releaseLock();
      throw error;
    }
  };

  getNetworkNonce = async (address: string, txType?: TxType, nonce?: any) => {
    if (txType === TxType.RETRY || txType === TxType.CANCEL) {
      return {
        nextNonce: nonce,
      };
    }

    try {
      const networkNonceNext = await this.providerService.getTransactionCount(address);

      return {
        nextNonce: networkNonceNext,
      };
    } catch (error) {
      throw error;
    }
  };

  _checkToUseNetworkNonce = (timeStamp: number) => {
    const lastPendingTxDate = new Date(timeStamp * 1000);
    const end = new Date().setSeconds(lastPendingTxDate.getSeconds() + 5);
    if (new Date().getTime() >= end) {
      return true;
    }
    return false;
  };

  _getHighestContinuousFrom = (txList, startPoint) => {
    const nonces = txList.map((txMeta) => {
      const nonce = txMeta.nonce;
      return nonce;
    });
    log.info('_getHighestContinuousFrom', { txList, startPoint, nonces });

    let highest = startPoint;
    while (nonces.includes(highest)) {
      highest++;
    }

    return BigNumber.from(highest).toHexString();
  };
}
