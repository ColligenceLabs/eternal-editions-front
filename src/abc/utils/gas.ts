/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import {BigNumber, ethers} from 'ethers';
import {stripHexPrefix} from 'ethjs-util';
import {fromWei, toWei} from 'ethjs-unit';
import {BN} from 'ethereumjs-util';

import {DekeyData} from '../dekeyData';
import {GasDataModel} from '../main/transactions/interface';
import BigNumberUtil from './bignumber';
import {isKlaytn} from './network';

const addGasBuffer = (
  initialGasLimitHex: string,
  blockGasLimitHex: string,
  chainId: number
) => {
  const multiplier = _getGasBufferMultiplier(chainId);

  const initialGasLimitBn = BigNumberUtil.hexToBn(initialGasLimitHex);
  const blockGasLimitBn = BigNumberUtil.hexToBn(blockGasLimitHex);
  const upperGasLimitBn = blockGasLimitBn.muln(0.9);
  const bufferedGasLimitBn = initialGasLimitBn.muln(multiplier);

  // if (isKlaytn(network.chainId)) {
  if (isKlaytn(chainId)) {
    return BigNumberUtil.bnToHex(bufferedGasLimitBn);
  }

  // if initialGasLimit is above blockGasLimit, dont modify it
  if (initialGasLimitBn.gt(upperGasLimitBn)) {
    return BigNumberUtil.bnToHex(initialGasLimitBn);
  }
  // if bufferedGasLimit is below blockGasLimit, use bufferedGasLimit
  if (bufferedGasLimitBn.lt(upperGasLimitBn)) {
    return BigNumberUtil.bnToHex(bufferedGasLimitBn);
  }
  // otherwise use blockGasLimit
  return BigNumberUtil.bnToHex(upperGasLimitBn);
};

const addBufferToBlockGasLimit = (blockGasLimitHex: string) => {
  const blockGasLimitBn = BigNumberUtil.hexToBn(blockGasLimitHex);
  const upperGasLimitBn = blockGasLimitBn.muln(0.9);
  return BigNumberUtil.bnToHex(upperGasLimitBn);
};

const makeGasData = (
  maxFeePerGas?: string,
  maxPriorityFeePerGas?: string,
  gasPrice?: string
): GasDataModel => {
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

const calculateDappGasFee = ({
  bSupportsEIP1559,
  isMpcSigner,
  baseFeePerGas,
  gas,
  gasPrice,
}: {
  bSupportsEIP1559: boolean;
  isMpcSigner: boolean;
  baseFeePerGas: string;
  gas: string;
  gasPrice: string;
}) => {
  const SQRT_GWEI = Math.round(Math.sqrt(1000000000));

  const dappGasLimit = BigNumber.from(gas);

  let dappGasFee: BigNumber;
  if (bSupportsEIP1559 && isMpcSigner) {
    const baseFeeBuffer = BigNumber.from(Math.round(Math.sqrt(+baseFeePerGas)))
      .mul(BigNumber.from(SQRT_GWEI))
      .mul(BigNumber.from(2));

    dappGasFee = BigNumber.from(baseFeePerGas)
      .add(BigNumber.from(baseFeeBuffer))
      .mul(dappGasLimit);
  } else {
    dappGasFee = BigNumber.from(gasPrice).mul(dappGasLimit);
  }

  return dappGasFee;
};

const _getGasBufferMultiplier = (chainId: number) => {
  let value = 1.5; // default
  if (
    chainId === DekeyData.CHAIN_ID_LIST['optimistic'] ||
    chainId === DekeyData.CHAIN_ID_LIST['optimisticKovan']
  ) {
    value = 1;
  }
  return value;
};

export function gweiDecToWEIBN(n: number | string) {
  if (Number.isNaN(n)) {
    return new BN(0);
  }

  const parts = n.toString().split('.');
  const wholePart = parts[0] || '0';
  let decimalPart = parts[1] || '';

  if (!decimalPart) {
    return toWei(wholePart, 'gwei');
  }
  if (decimalPart.length <= 9) {
    return toWei(`${wholePart}.${decimalPart}`, 'gwei');
  }

  const decimalPartToRemove = decimalPart.slice(9);
  const decimalRoundingDigit = decimalPartToRemove[0];

  decimalPart = decimalPart.slice(0, 9);
  let wei = toWei(`${wholePart}.${decimalPart}`, 'gwei');

  if (Number(decimalRoundingDigit) >= 5) {
    wei = wei.add(new BN(1));
  }

  return wei;
}

export const weiHexToGweiDec = (hex: string) => {
  const hexWei = new BN(stripHexPrefix(hex), 16);
  return fromWei(hexWei, 'gwei').toString(10);
};

const GasUtil = {
  addGasBuffer,
  addBufferToBlockGasLimit,
  makeGasData,
  calculateDappGasFee,
  gweiDecToWEIBN,
  weiHexToGweiDec,
};

export default GasUtil;
