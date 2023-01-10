/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

const Caver = require('caver-js');
const Hash = require('eth-lib/lib/hash');
import { inputCallFormatter } from 'caver-js/packages/caver-core-helpers/src/formatters.js';
import { encodeRLPByTxType } from 'caver-js/packages/caver-klay/caver-klay-accounts/src/makeRawTransaction.js';
import { ethers } from 'ethers';
import { intToHex } from 'dekey-eth-json-rpc-filters/hexUtils';

const caver = new Caver();

const serializeKlayTx = (unsignedTx) => {
  const txObject = inputCallFormatter(unsignedTx);
  const transaction = coverInitialTxValue(txObject);
  const rlpEncoded = encodeRLPByTxType(transaction);
  return rlpEncoded;
};

const coverInitialTxValue = (tx) => {
  if (typeof tx !== 'object') throw new Error('Invalid transaction');
  if (
    !tx.senderRawTransaction &&
    (!tx.type || tx.type === 'LEGACY' || tx.type.includes('SMART_CONTRACT_DEPLOY'))
  ) {
    tx.to = tx.to || '0x';
    tx.data = caver.utils.addHexPrefix(tx.data || '0x');
  }
  tx.chainId = caver.utils.numberToHex(tx.chainId);
  return tx;
};

const createRawTx = async ({ txParams, v, r, s }) => {
  if (txParams?.type) {
    const caver = new Caver();
    const caverSignResult: any = await caver.klay.accounts.getRawTransactionWithSignatures({
      ...txParams,
      signatures: [[intToHex(v), r, s]],
    });
    return caverSignResult.rawTransaction;
  }
  return ethers.utils.serializeTransaction(txParams as any, {
    v,
    r,
    s,
  });
};

const createTxHash = (txParams) => {
  const serializedTx = serializeKlayTx(txParams);
  return Hash.keccak256(serializedTx);
};

const KlaytnUtil = {
  coverInitialTxValue,
  serializeKlayTx,
  createRawTx,
  createTxHash,
};

export default KlaytnUtil;
