/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import {BigNumber, ethers, utils} from 'ethers';
import {v4 as uuidv4} from 'uuid';
import {IncomingTxModel, TxStatus} from '../main/transactions/interface';
import {Account} from '../schema/model';

const KLAYTN_GASPRICE_IN_WEI_NOW = '0.00000075';
const KLAYTN_GASPRICE_IN_WEI_BEFORE = '0.000000025';
const KLAYTN_GASPRICE_CHANGE_BLOCK_NUMBER = 85881600;

const transformEtherTxs = ({etherscanTxs, address, chainId, accountId}) => {
  return etherscanTxs
    .filter(item => {
      return item.to?.toLowerCase() === address.toLowerCase();
    })
    .map(item => {
      const txModel: IncomingTxModel = {
        id: uuidv4(),
        hash: item.hash,
        to: item.to ? utils.getAddress(item.to) : undefined,
        from: utils.getAddress(item.from),
        status: item.isError === '0' ? TxStatus.CONFIRMED : TxStatus.FAILED,
        timeStamp: item.timeStamp,
        value: BigNumber.from(item.value).toHexString(),
        gasPrice: item.gasPrice
          ? BigNumber.from(item.gasPrice).toHexString()
          : null,
        gasUsed: item.gasUsed
          ? BigNumber.from(item.gasUsed).toHexString()
          : null,
        chainId,
        aaid: accountId,
        blockNumber: item.blockNumber,
      };

      // EIP1559
      if (item.maxFeePerGas && item.maxPriorityFeePerGas) {
        txModel.maxFeePerGas = item.maxFeePerGas;
        txModel.maxPriorityFeePerGas = item.maxPriorityFeePerGas;
      }

      return txModel;
    });
};

const transformKlaytnTxs = ({
  items,
  address,
  chainId,
  accountId,
}: {
  items: any[];
  address: string;
  chainId: number;
  accountId: number;
}) => {
  return items
    .filter(item => {
      return item.to?.toLowerCase() === address.toLowerCase();
    })
    .map(item => {
      const gasPrice =
        item.blockNumber >= KLAYTN_GASPRICE_CHANGE_BLOCK_NUMBER
          ? ethers.utils.parseEther(KLAYTN_GASPRICE_IN_WEI_NOW)
          : ethers.utils.parseEther(KLAYTN_GASPRICE_IN_WEI_BEFORE);
      const gasUsed = BigNumber.from(item.fee).div(gasPrice).toHexString(); // .toFixed(); // 반올림하며, 소수 부분을 남기지 않습니다.

      const txModel: IncomingTxModel = {
        id: uuidv4(),
        hash: item.transactionHash,
        from: utils.getAddress(item.from),
        status: item.status === 1 ? TxStatus.CONFIRMED : TxStatus.FAILED,
        timeStamp: String(item.timestamp),
        value: BigNumber.from(item.value).toHexString(),
        gasPrice: gasPrice.toHexString(),
        gasUsed: gasUsed,
        chainId,
        aaid: accountId,
        blockNumber: item.blockNumber,
        ...(item.to && {to: utils.getAddress(item.to)}),
      };

      return txModel;
    });
};

const getBlockNumberForEtherTxs = ({blockNumbers, chainId, address}) => {
  return blockNumbers && blockNumbers[chainId]
    ? +blockNumbers[chainId][address] + 1
    : 0;
};

const addMainAssetBlockNumbersForIncomingTxs = ({
  blockNumbers,
  chainId,
  address,
  blockNumber,
}) => {
  return {
    ...blockNumbers,
    [chainId]: {
      ...blockNumbers[chainId],
      [address]: blockNumber,
    },
  };
};

const transformKlaytnIncomingTokenTxs = ({
  res,
  account,
  chainId,
  assetId,
  decimal,
}: {
  res;
  account: Account;
  chainId: number;
  assetId: string;
  decimal: number;
}) => {
  return res
    .filter(item => {
      return item.to?.toLowerCase() === account.ethAddress.toLowerCase();
    })
    .map(item => {
      const {to, formattedValue, value} = item;
      const {transactionHash, from, fee, timestamp} = item.transaction;
      const {symbol} = item.contract;

      // item.transaction example
      // fee: "0xb56440bd39e00"
      // feePayer: ""
      // feeRatio: 0
      // from: "0x02e31a6132d338995e3236d2422318110540392c"
      // timestamp: 1618369266
      // transactionHash: "0x412baf20ff8c5aeb190960fd41de89c22f993ac505bcee85db234eb18bedce94"
      // typeInt: 0
      // value: "0x0"

      const gasPrice =
        item.blockNumber >= KLAYTN_GASPRICE_CHANGE_BLOCK_NUMBER
          ? ethers.utils.parseEther(KLAYTN_GASPRICE_IN_WEI_NOW)
          : ethers.utils.parseEther(KLAYTN_GASPRICE_IN_WEI_BEFORE);

      const txModel: IncomingTxModel = {
        id: uuidv4(),
        tokenSymbol: symbol,
        hash: transactionHash,
        to: to ? utils.getAddress(to) : null,
        from: utils.getAddress(from),
        timeStamp: String(timestamp),
        value: BigNumber.from(value).toHexString(),
        gasPrice: gasPrice.toHexString(),
        gasUsed: BigNumber.from(fee).div(gasPrice).toHexString(),
        chainId,
        assetId,
        status: TxStatus.CONFIRMED,
        aaid: account.id,
        tokenDecimal: +decimal,
      };
      return txModel;
    });
};

const transformEthereumIncomingTokenTxs = ({
  res,
  account,
  chainId,
  assetId,
  decimal,
}: {
  res;
  account: Account;
  chainId: number;
  assetId: string;
  decimal: number;
}) => {
  return res.txs
    .filter(item => {
      return item.to?.toLowerCase() === account.ethAddress.toLowerCase();
    })
    .map(tx => {
      const {
        tokenSymbol,
        tokenDecimal,
        hash,
        to,
        from,
        value,
        gasPrice,
        gasUsed,
        timeStamp,
        blockNumber,
      } = tx;

      const txModel: IncomingTxModel = {
        id: uuidv4(),
        tokenSymbol,
        hash,
        to: to ? utils.getAddress(to) : undefined,
        from: utils.getAddress(from),
        timeStamp,
        value: BigNumber.from(value).toHexString(),
        gasPrice: BigNumber.from(gasPrice).toHexString(),
        gasUsed: BigNumber.from(gasUsed).toHexString(),
        chainId,
        assetId,
        status: TxStatus.CONFIRMED,
        aaid: account.id,
        tokenDecimal: +tokenDecimal,
        blockNumber: blockNumber,
      };

      // EIP1559
      if (tx.maxFeePerGas && tx.maxPriorityFeePerGas) {
        txModel.maxFeePerGas = tx.maxFeePerGas;
        txModel.maxPriorityFeePerGas = tx.maxPriorityFeePerGas;
      }

      return txModel;
    });
};

const IncomingTxUtil = {
  transformEtherTxs,
  getBlockNumberForEtherTxs,
  transformKlaytnTxs,
  addMainAssetBlockNumbersForIncomingTxs,
  transformKlaytnIncomingTokenTxs,
  transformEthereumIncomingTokenTxs,
};

export default IncomingTxUtil;
