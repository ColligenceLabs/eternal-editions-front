/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import {BigNumber, ethers, utils} from 'ethers';
import _ from 'lodash';
import ethUtil from 'ethereumjs-util';
import {stripHexPrefix} from 'ethjs-util';
import {ethErrors} from 'eth-rpc-errors';

import {CustomError} from './error';
import {DekeyError} from './errorTypes';
import InputDataDecoder from './ethDecoder';
import {addHexPrefix, padWithZeroes} from './string';
import {
  createUnsignedTxForTransferingNativeCurrencyDto,
  CreateUnsignedTxForTransferingTokenDto,
  TxModel,
  TxStatus,
  TxType,
  TX_SOURCE,
} from '../main/transactions/interface';
import {isKlaytn} from './network';
import {generateTokenTransferData} from './asset';

const MAX_PENDING_TXS = 200;

const parseTransactionWithAbi = (abi: string, data: string) => {
  const decoder = new InputDataDecoder(JSON.parse(abi));
  return decoder.decodeData(data);
};

const updateTxStatus = ({txs, txId, change, history}) => {
  return txs.map(item => {
    if (item.id === txId) {
      return {
        ...item,
        ...change,
        history: [...item.history, history],
        // history: _.isArray(item.history) ? [...item.history, history] : [],
      };
    }
    return item;
  });
};

const calculateV = (arg: {
  r: string;
  s: string;
  hash: string;
  address: string;
  vsource: number;
  chainId: number;
}) => {
  try {
    const {r, s, hash, address, vsource, chainId} = arg;
    const CHAIN_ID_OFFSET = 35;
    const v = vsource + CHAIN_ID_OFFSET + 2 * chainId;

    const recoveredAddress = ethers.utils.recoverAddress(hash, {
      v,
      r,
      s,
    });
    if (recoveredAddress !== address) {
      throw new CustomError(
        DekeyError.calcV(
          `recoveredAddress: ${recoveredAddress} and address: ${address}`
        )
      );
    }

    return v;
  } catch (error) {
    throw error;
  }
};

/**
 * calculating v with OFFSET is different from original metamask code
 */
const concatSig = (v: number, r: Buffer, s: Buffer): string => {
  const OFFSET = 27;
  const rBuffer = Buffer.from(stripHexPrefix(r as any), 'hex');
  const sBuffer = Buffer.from(stripHexPrefix(s as any), 'hex');
  const rSig = ethUtil.fromSigned(rBuffer);
  const sSig = ethUtil.fromSigned(sBuffer);
  // const vSig = ethUtil.bufferToInt(v);

  const rStr = padWithZeroes(ethUtil.toUnsigned(rSig).toString('hex'), 64);
  const sStr = padWithZeroes(ethUtil.toUnsigned(sSig).toString('hex'), 64);
  const vStr = ethUtil.stripHexPrefix(ethUtil.intToHex(v + OFFSET));
  // @ts-ignore:next-line
  return ethUtil.addHexPrefix(rStr.concat(sStr, vStr)).toString('hex');
};

const serializeEthTx = unsignedTx => {
  return ethers.utils.serializeTransaction(unsignedTx); // klaytn tx type 정보 포함 시 에러 발생
};

const getSignTypeForMpcJwt = ({autoconfirm, txType}) => {
  return autoconfirm
    ? 'autoconfirm'
    : txType === TxType.RETRY || txType === TxType.CANCEL
    ? 'retry'
    : null;
};

const validateTxParams = (txParams, address) => {
  if (!txParams || typeof txParams !== 'object' || Array.isArray(txParams)) {
    throw ethErrors.rpc.invalidParams(
      'Invalid transaction params: must be an object.'
    );
  }
  if (!txParams.to && !txParams.data) {
    throw ethErrors.rpc.invalidParams(
      'Invalid transaction params: must specify "data" for contract deployments, or "to" (and optionally "data") for all other types of transactions.'
    );
  }

  _validateFrom(txParams, address);
  _validateRecipient(txParams);
  if ('value' in txParams) {
    const value = txParams.value.toString();
    if (value.includes('-')) {
      throw ethErrors.rpc.invalidParams(
        `Invalid transaction value "${txParams.value}": not a positive number.`
      );
    }

    if (value.includes('.')) {
      throw ethErrors.rpc.invalidParams(
        `Invalid transaction value of "${txParams.value}": number must be in wei.`
      );
    }
  }
};

const normalizers = {
  from: from => addHexPrefix(from),
  to: (to, lowerCase) =>
    lowerCase ? addHexPrefix(to).toLowerCase() : addHexPrefix(to),
  nonce: nonce => addHexPrefix(nonce),
  value: value => addHexPrefix(value),
  data: data => addHexPrefix(data),
  gas: gas => addHexPrefix(gas),
  gasPrice: gasPrice => addHexPrefix(gasPrice),
};

const normalizeTxParams = (txParams, lowerCase = true) => {
  // apply only keys in the normalizers
  const normalizedTxParams = {};
  for (const key in normalizers) {
    if (txParams[key]) {
      normalizedTxParams[key] = normalizers[key](txParams[key], lowerCase);
    }
  }
  return normalizedTxParams;
};

const makeTxHistory = (
  status: TxStatus | TxType,
  tx: {
    maxFeePerGas?: string;
    maxPriorityFeePerGas?: string;
    value?: string;
    gasPrice?: string;
    confirmations?: number;
    errMsg?: string;
  }
) => {
  const supportsEIP1559 =
    tx.maxFeePerGas && tx.maxPriorityFeePerGas ? true : false;

  if (status === TxStatus.FAILED) {
    return {
      eventKey: status,
      message: tx.errMsg,
      timestamp: new Date().getTime(),
    };
  }

  return supportsEIP1559
    ? {
        eventKey: status,
        maxFeePerGas: tx.maxFeePerGas,
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
        value: tx.value,
        timestamp: new Date().getTime(),
      }
    : {
        eventKey: status,
        gasPrice: tx.gasPrice,
        value: tx.value,
        timestamp: new Date().getTime(),
      };
};

const getMaxEthBalance = ({gasPrice, gasLimit, balance}) => {
  try {
    const _amount = utils.parseEther(balance);
    const g_price = utils.parseUnits(gasPrice, 'gwei');
    const g_limit = BigNumber.from(gasLimit);

    const maxEthAsBigNumber = _amount.sub(g_price.mul(g_limit));
    const maxEth = utils.formatEther(maxEthAsBigNumber);

    return +maxEth > 0 ? maxEth : '0';
  } catch (error) {
    throw error;
  }
};

const getEip1559MaxEthBalance = ({gasLimit, maxFeePerGas, balance}) => {
  try {
    const _amount = utils.parseEther(balance);
    const g_price = utils.parseUnits(maxFeePerGas, 'gwei');
    const g_limit = BigNumber.from(gasLimit);

    const maxEthAsBigNumber = _amount.sub(g_price.mul(g_limit));
    const maxEth = utils.formatEther(maxEthAsBigNumber);

    return +maxEth > 0 ? maxEth : '0';
  } catch (error) {
    throw error;
  }
};

const addPendingTx = ({txs, item}: {txs: TxModel[]; item}) => {
  if (txs.length >= MAX_PENDING_TXS) {
    const dropIndex = _.findLastIndex(txs, function (t) {
      return t.status !== TxStatus.APPROVED && t.status !== TxStatus.SUMMITTED;
    });
    if (dropIndex !== -1) {
      txs.splice(dropIndex, 1); // pendingTxs changed
    }
  }
  return [item, ...txs];
};

const createUnsignedTxForTransferingNativeCurrency = (
  dto: createUnsignedTxForTransferingNativeCurrencyDto
) => {
  const {
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    to,
    value,
    chainId,
    gasLimit,
    txType,
    nonce, // nonce is given from ui if tx is speedup or cancel
  } = dto;

  const supportsEIP1559 = Boolean(maxFeePerGas);
  let gasData;
  if (supportsEIP1559) {
    gasData = {
      maxFeePerGas: ethers.utils.parseUnits(maxFeePerGas, 'gwei').toHexString(),
      maxPriorityFeePerGas: ethers.utils
        .parseUnits(String(maxPriorityFeePerGas), 'gwei')
        .toHexString(),
      type: 2, // ethers.js eip-1559
    };
  } else {
    gasData = {
      gasPrice: ethers.utils.parseUnits(gasPrice, 'gwei').toHexString(),
    };
  }

  // let valueInHexString = BigNumber.from('0x0').toHexString();
  // try {
  //   valueInHexString = ethers.utils.parseEther(value).toHexString();
  // } catch (error) {}

  const valueInHexString = _parseWeiTxValue(value, 18);

  const gasLimitInHexString = BigNumber.from(gasLimit).toHexString();

  return {
    to,
    chainId: +chainId,
    value: valueInHexString, //wei
    gasLimit: gasLimitInHexString,
    ...gasData,
  };
};

const createUnsignedTxForSelectedNonce = (
  dto: createUnsignedTxForTransferingNativeCurrencyDto
) => {
  const {
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    to,
    value,
    chainId,
    gasLimit,
    txType,
    nonce,
  } = dto;

  const supportsEIP1559 = Boolean(maxFeePerGas);
  let gasData;
  if (supportsEIP1559) {
    gasData = {
      maxFeePerGas: ethers.utils.parseUnits(maxFeePerGas, 'gwei').toHexString(),
      maxPriorityFeePerGas: ethers.utils
        .parseUnits(String(maxPriorityFeePerGas), 'gwei')
        .toHexString(),
      type: 2, // ethers.js eip-1559
    };
  } else {
    gasData = {
      gasPrice: ethers.utils.parseUnits(gasPrice, 'gwei').toHexString(),
    };
  }

  const valueInHexString = _parseWeiTxValue(value, 18);
  const gasLimitInHexString = BigNumber.from(gasLimit).toHexString();

  return {
    to,
    chainId: +chainId,
    value: valueInHexString, //wei
    gasLimit: gasLimitInHexString,
    nonce: BigNumber.from(nonce).toHexString(),
    ...gasData,
  };
};

const createUnsignedTxForTransferingToken = (
  dto: CreateUnsignedTxForTransferingTokenDto
) => {
  const {
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    to,
    contractAddress,
    value,
    chainId,
    gasLimit,
    txType,
    nonce,
    decimal,
  } = dto;

  const gasData = parseGasDataForTx(
    maxFeePerGas,
    maxPriorityFeePerGas,
    gasPrice
  );

  const parsedValue = _parseWeiTxValue(value, decimal);

  return {
    to: contractAddress,
    chainId,
    gasLimit: BigNumber.from(gasLimit).toHexString(),
    value: parsedValue,
    data: generateTokenTransferData({
      toAddress: to,
      amount: parsedValue,
      sendToken: true,
    }),
    ...(Boolean(maxFeePerGas) && {type: 2}),
    ...gasData,
  };
};

const createSpeedupTxParams = (tx, gasData, gasLimit, txSource: TX_SOURCE) => {
  const {chainId, nonce, to, value, type, data, from} = tx;
  return {
    chainId: chainId,
    gasLimit: BigNumber.from(gasLimit).toHexString(),
    nonce: nonce,
    ...gasData,
    ...(to && {to: txSource === TX_SOURCE.ERC20 ? tx.contractAddress : to}),
    ...(value && {value: value}),
    ...(!isKlaytn(chainId) && Boolean(gasData.maxFeePerGas) && {type: 2}),
    ...(isKlaytn(chainId) && type && {type: type}),
    ...(data && {data: data}),
    ...(isKlaytn(chainId) && type && {from: from}),
  };
};

const createCancelTxParams = (tx, gasData, gasLimit) => {
  const {chainId, nonce, to, value, type, data, from} = tx;

  return {
    chainId: chainId,
    to: tx.from,
    value: '0x0', //wei
    nonce: nonce,
    gasLimit: BigNumber.from(gasLimit).toHexString(),
    ...gasData,
    ...(!isKlaytn(chainId) && Boolean(gasData.maxFeePerGas) && {type: 2}),
    ...(isKlaytn(chainId) && type && {type: type}),
  };
};

const parseGasDataForTx = (
  maxFeePerGas?: string,
  maxPriorityFeePerGas?: string,
  gasPrice?: string
) => {
  if (maxFeePerGas) {
    return {
      maxFeePerGas: ethers.utils.parseUnits(maxFeePerGas, 'gwei').toHexString(),
      maxPriorityFeePerGas: ethers.utils
        .parseUnits(String(maxPriorityFeePerGas), 'gwei')
        .toHexString(),
    };
  }
  return {
    gasPrice: ethers.utils.parseUnits(gasPrice, 'gwei').toHexString(),
  };
};

const createTxHash = txParams => {
  const serializedTx = ethers.utils.serializeTransaction(txParams);
  return ethers.utils.keccak256(serializedTx);
};

const createRawTx = ({txParams, v, r, s}) => {
  return ethers.utils.serializeTransaction(txParams, {
    v,
    r,
    s,
  });
};

const _validateRecipient = txParams => {
  if (txParams.to === '0x' || txParams.to === null) {
    if (txParams.data) {
      delete txParams.to;
    } else {
      throw ethErrors.rpc.invalidParams('Invalid "to" address.');
    }
  } else if (
    txParams.to !== undefined &&
    !ethUtil.isValidAddress(txParams.to)
  ) {
    throw ethErrors.rpc.invalidParams('Invalid "to" address.');
  }
  return txParams;
};

const _validateFrom = (txParams, address) => {
  if (!(typeof txParams.from === 'string')) {
    throw ethErrors.rpc.invalidParams(
      `Invalid "from" address "${txParams.from}": not a string.`
    );
  }
  if (!ethUtil.isValidAddress(txParams.from)) {
    throw ethErrors.rpc.invalidParams('Invalid "from" address.');
  }

  if (txParams.from && txParams.from.toLowerCase() !== address.toLowerCase()) {
    throw ethErrors.rpc.invalidParams(
      'Invalid "from" address: not same as current account address'
    );
  }
};

const _parseWeiTxValue = (value: string, decimal = 18) => {
  let valueInHexString = BigNumber.from('0x0').toHexString();
  try {
    valueInHexString = ethers.utils.parseUnits(value, decimal).toHexString();
  } catch (error) {}
  return valueInHexString;
};

const showTxReceivedToast = (timeStamp: number) => {
  const d1 = new Date();
  const d2 = new Date(d1);
  d2.setMinutes(d1.getMinutes() - 5);

  return d2.getTime() < +timeStamp * 1000;
};

const TransactionUtil = {
  parseTransactionWithAbi,
  updateTxStatus,
  calculateV,
  concatSig,
  serializeEthTx,
  getSignTypeForMpcJwt,
  validateTxParams,
  normalizeTxParams,
  makeTxHistory,
  getMaxEthBalance,
  getEip1559MaxEthBalance,
  addPendingTx,
  createSpeedupTxParams,
  createUnsignedTxForTransferingNativeCurrency,
  createUnsignedTxForSelectedNonce,
  createUnsignedTxForTransferingToken,
  createCancelTxParams,
  parseGasDataForTx,
  createTxHash,
  createRawTx,
  showTxReceivedToast,
};

export default TransactionUtil;
