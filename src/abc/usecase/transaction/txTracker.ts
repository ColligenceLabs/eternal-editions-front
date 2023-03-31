/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import {container, singleton} from 'tsyringe';
import {
  ACTIVE_ACCOUNT,
  CURRENT_NETWORK,
  PENDING_TXS,
} from '../../main/db/constants';
import {
  NetworkModel,
  TxModel,
  TxStatus,
} from '../../main/transactions/interface';
import {DekeyStore} from '../store';
import {ProviderService} from '../provider';
import EventEmitter from 'events';
import log from 'loglevel';

const DROPPED_BUFFER_COUNT = 3;

@singleton()
export class TxTracker extends EventEmitter {
  // dekeyStore: DekeyStore;
  droppedBlocksBufferByHash: Map<string, number>;

  constructor(private dekeyStore: DekeyStore) {
    super();
    // this.dekeyStore = container.resolve(DekeyStore);
    this.droppedBlocksBufferByHash = new Map();
  }

  async handlePendingTxs(newBlock: string, providerService: ProviderService) {
    try {
      const state = this.dekeyStore.getState();
      const network = state[CURRENT_NETWORK];
      const account = state[ACTIVE_ACCOUNT];
      const pendingTxs = state[PENDING_TXS] ?? [];

      if (!pendingTxs) return;
      let filteredTxs = pendingTxs.filter(
        tx =>
          tx.chainId === network.chainId &&
          tx.status === TxStatus.SUMMITTED &&
          tx.hash &&
          tx.aaid === account.id
      );
      if (!filteredTxs.length) return;

      for (let i = 0; i < filteredTxs.length; i++) {
        await this._handlePendingTx(
          newBlock,
          filteredTxs[i],
          network,
          providerService
        );
      }
    } catch (error) {
    } finally {
      // releaseLock()
    }
  }

  async _handlePendingTx(
    newBlock: string,
    tx: TxModel,
    network: NetworkModel,
    providerService: ProviderService
  ) {
    try {
      if (tx.status !== TxStatus.SUMMITTED) {
        return;
      }

      if (!tx.hash) {
        return this.emit('failed', {
          id: tx.id,
          history: {},
        });
      }

      if (this._checkIfNonceIsTaken(tx)) {
        return this.emit('dropped', {
          id: tx.id,
          history: {},
        });
      }

      /**
       * set klaytn fee delegated tx as confirmed
       * before wallet can get delegated tx receipt
       */
      if (
        tx?.type &&
        typeof tx.type === 'string' &&
        tx.type.includes('FEE_DELEGATED')
      ) {
        return this.emit(
          'confirmed',
          {gasUsed: tx.gasLimit}, // temporary value
          tx,
          network
        );
      }

      const receipt = await providerService.getTransactionReceipt(
        tx.hash,
        network.chainId
      );

      log.info('txTracker receipt', receipt);

      if (!receipt) {
        return;
      }

      // status false => klaytn, status 0x0 => ethereum
      if (receipt && (receipt.status === false || receipt.status === '0x0')) {
        return this.emit('failed', {
          id: tx.id,
          history: {
            eventKey: TxStatus.FAILED,
            message: 'TX_FAILED_IN_NODE_ERROR',
            timestamp: new Date().getTime(),
          },
        });
      }

      /** check confirmations instead of making tx confirmed by receipt status */
      // const confirmations =
      //   BigNumber.from(newBlock).toNumber() - receipt.blockNumber;
      // if (receipt && confirmations >= 1) {
      //   return this.emit(
      //     'confirmed',
      //     receipt,
      //     tx,
      //     confirmations,
      //     networkDomain
      //   );
      // }

      if (receipt?.blockNumber) {
        return this.emit('confirmed', receipt, tx, network);
      }

      if (await this._checkIfTxWasDropped(tx, providerService)) {
        return this.emit('dropped', {
          id: tx.id,
          history: {},
        });
      }
    } catch (error) {
    } finally {
      // releaseLock();
    }
  }

  /**
   * Drop means pending tx nonce is lower than network nonce
   * make sure it it at least more than DROPPED_BUFFER_COUNT
   */
  async _checkIfTxWasDropped(tx: TxModel, providerService: ProviderService) {
    try {
      const networkNextNonce = await providerService.getTransactionCount(
        tx.from
      );

      const {nonce, hash: txHash} = tx;
      if (nonce >= Number(networkNextNonce)) {
        return false;
      }

      if (!this.droppedBlocksBufferByHash.has(txHash)) {
        this.droppedBlocksBufferByHash.set(txHash, 0);
      }

      const currentBlockBuffer = this.droppedBlocksBufferByHash.get(txHash);

      if (currentBlockBuffer < DROPPED_BUFFER_COUNT) {
        this.droppedBlocksBufferByHash.set(txHash, currentBlockBuffer + 1);
        return false;
      }

      this.droppedBlocksBufferByHash.delete(txHash);

      return true;
    } catch (error) {
    } finally {
      // releaseLock();
    }
  }

  _checkIfNonceIsTaken(tx: TxModel) {
    const completed = this._getCompletedTransactions();
    return completed.some(
      // This is called while the transaction is in-flight, so it is possible that the
      // list of completed transactions now includes the transaction we were looking at
      // and if that is the case, don't consider the transaction to have taken its own nonce
      other => !(other.id === tx.id) && other.nonce === tx.nonce
    );
  }

  _getCompletedTransactions() {
    const {currentNetwork, activeAccount, pendingTxs} =
      this.dekeyStore.getState();

    if (!pendingTxs) return [];

    return pendingTxs.filter(
      tx =>
        tx.chainId === currentNetwork.chainId &&
        tx.status === TxStatus.CONFIRMED &&
        tx.hash &&
        tx.aaid === activeAccount.id
    );
  }
}
