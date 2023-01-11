/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import axios from 'axios';
import { BigNumber } from '@ethersproject/bignumber';
import { utils } from 'ethers';
// import fetchAdapter from '@vespaiach/axios-fetch-adapter';

import { GasFeeEstimates } from './gasFee';
import GasUtil from '../../utils/gas';
import { CustomError } from '../../utils/error';
import { DekeyError } from '../../utils/errorTypes';
// import {gweiDecToWEIBN, weiHexToGweiDec} from '../../main/util';

// metamask gas controller code
export function normalizeGWEIDecimalNumbers(n: string | number) {
  const numberAsWEIHex = GasUtil.gweiDecToWEIBN(n).toString(16);
  const numberAsGWEI = GasUtil.weiHexToGweiDec(numberAsWEIHex).toString(10);
  return Number(numberAsGWEI).toFixed(2);
}

// metamask gas controller code
export async function fetchGasEstimates(url: string): Promise<GasFeeEstimates> {
  try {
    const axiosResult = await axios.request({
      url,
      method: 'get',
      // adapter: fetchAdapter,
    });

    // const axiosResult = await axiosClient.get(url);
    if (axiosResult.status !== 200) {
      throw new Error(`fetching gas estimates status code: ${axiosResult.status}`);
    }
    const estimates: GasFeeEstimates = axiosResult.data;
    const normalizedEstimates: GasFeeEstimates = {
      estimatedBaseFee: normalizeGWEIDecimalNumbers(estimates.estimatedBaseFee),
      low: {
        ...estimates.low,
        suggestedMaxPriorityFeePerGas: normalizeGWEIDecimalNumbers(
          estimates.low.suggestedMaxPriorityFeePerGas
        ),
        suggestedMaxFeePerGas: normalizeGWEIDecimalNumbers(estimates.low.suggestedMaxFeePerGas),
      },
      medium: {
        ...estimates.medium,
        suggestedMaxPriorityFeePerGas: normalizeGWEIDecimalNumbers(
          estimates.medium.suggestedMaxPriorityFeePerGas
        ),
        suggestedMaxFeePerGas: normalizeGWEIDecimalNumbers(estimates.medium.suggestedMaxFeePerGas),
      },
      high: {
        ...estimates.high,
        suggestedMaxPriorityFeePerGas: normalizeGWEIDecimalNumbers(
          estimates.high.suggestedMaxPriorityFeePerGas
        ),
        suggestedMaxFeePerGas: normalizeGWEIDecimalNumbers(estimates.high.suggestedMaxFeePerGas),
      },
    };
    return normalizedEstimates;
  } catch (error) {
    throw new CustomError(DekeyError.fetchGasfeeEstimates(error.message));
  }
}

const historicalBlocks = 10;
export async function fetchAlchemyGasPriceEstimate(web3Alchemy: any): Promise<GasFeeEstimates> {
  try {
    const feeHistory = await web3Alchemy.eth.getFeeHistory(
      historicalBlocks,
      'pending',
      [25, 50, 60] // percentile
    );

    // alchemy document example
    const blocks = _formatFeeHistory(feeHistory, false);
    const slow = _avg(blocks.map((b) => b.priorityFeePerGas[0]));
    const average = _avg(blocks.map((b) => b.priorityFeePerGas[1]));
    const fast = _avg(blocks.map((b) => b.priorityFeePerGas[2]));

    const block = await web3Alchemy.eth.getBlock('pending');
    const baseFeePerGas = Number(block.baseFeePerGas);

    const normalizedEstimates: GasFeeEstimates = {
      estimatedBaseFee: Number(utils.formatUnits(baseFeePerGas, 'gwei')).toFixed(2),
      low: {
        maxWaitTimeEstimate: 60000,
        minWaitTimeEstimate: 15000,
        suggestedMaxPriorityFeePerGas: Number(utils.formatUnits(slow, 'gwei')).toFixed(2),
        suggestedMaxFeePerGas: _calculateMaxPriorityFeePerGas(baseFeePerGas, slow),
      },
      medium: {
        maxWaitTimeEstimate: 45000,
        minWaitTimeEstimate: 15000,
        suggestedMaxPriorityFeePerGas: Number(utils.formatUnits(average, 'gwei')).toFixed(2),
        suggestedMaxFeePerGas: _calculateMaxPriorityFeePerGas(baseFeePerGas, average),
      },
      high: {
        maxWaitTimeEstimate: 30000,
        minWaitTimeEstimate: 15000,
        suggestedMaxPriorityFeePerGas: Number(utils.formatUnits(fast, 'gwei')).toFixed(2),
        suggestedMaxFeePerGas: _calculateMaxPriorityFeePerGas(baseFeePerGas, fast),
      },
    };

    return normalizedEstimates;
  } catch (error) {
    throw error;
  }
}

function _calculateMaxPriorityFeePerGas(baseFeePerGas: number, maxPriorityFeePerGas: number) {
  const SQRT_GWEI = Math.round(Math.sqrt(1000000000));

  const baseFeeBuffer = BigNumber.from(Math.round(Math.sqrt(+baseFeePerGas)))
    .mul(BigNumber.from(SQRT_GWEI))
    .mul(BigNumber.from(2));

  const result = BigNumber.from(baseFeePerGas)
    .add(BigNumber.from(baseFeeBuffer))
    .add(maxPriorityFeePerGas);

  return Number(utils.formatUnits(result, 'gwei')).toFixed(2);
}

/** alchemy document example */
function _formatFeeHistory(result, includePending) {
  let blockNum = result.oldestBlock;
  let index = 0;
  const blocks = [];
  while (blockNum < result.oldestBlock + historicalBlocks - 1) {
    blocks.push({
      number: blockNum,
      baseFeePerGas: Number(result.baseFeePerGas[index]),
      gasUsedRatio: Number(result.gasUsedRatio[index]),
      priorityFeePerGas: result.reward[index].map((x) => Number(x)),
    });
    blockNum += 1;
    index += 1;
  }
  if (includePending) {
    blocks.push({
      number: 'pending',
      baseFeePerGas: Number(result.baseFeePerGas[historicalBlocks]),
      gasUsedRatio: NaN,
      priorityFeePerGas: [],
    });
  }
  return blocks;
}
function _avg(arr) {
  const sum = arr.reduce((a, v) => a + v);
  return Math.round(sum / arr.length);
}

// export function calculateTimeEstimate(
//   maxPriorityFeePerGas: string,
//   maxFeePerGas: string,
//   gasFeeEstimates: GasFeeEstimates
// ): EstimatedGasFeeTimeBounds {
//   const {low, medium, high, estimatedBaseFee} = gasFeeEstimates;

//   const maxPriorityFeePerGasInWEI = gweiDecToWEIBN(maxPriorityFeePerGas);
//   const maxFeePerGasInWEI = gweiDecToWEIBN(maxFeePerGas);
//   const estimatedBaseFeeInWEI = gweiDecToWEIBN(estimatedBaseFee);

//   const effectiveMaxPriorityFee = BN.min(
//     maxPriorityFeePerGasInWEI,
//     maxFeePerGasInWEI.sub(estimatedBaseFeeInWEI)
//   );

//   const lowMaxPriorityFeeInWEI = gweiDecToWEIBN(
//     low.suggestedMaxPriorityFeePerGas
//   );
//   const mediumMaxPriorityFeeInWEI = gweiDecToWEIBN(
//     medium.suggestedMaxPriorityFeePerGas
//   );
//   const highMaxPriorityFeeInWEI = gweiDecToWEIBN(
//     high.suggestedMaxPriorityFeePerGas
//   );

//   let lowerTimeBound;
//   let upperTimeBound;

//   if (effectiveMaxPriorityFee.lt(lowMaxPriorityFeeInWEI)) {
//     lowerTimeBound = null;
//     upperTimeBound = 'unknown' as unknownString;
//   } else if (
//     effectiveMaxPriorityFee.gte(lowMaxPriorityFeeInWEI) &&
//     effectiveMaxPriorityFee.lt(mediumMaxPriorityFeeInWEI)
//   ) {
//     lowerTimeBound = low.minWaitTimeEstimate;
//     upperTimeBound = low.maxWaitTimeEstimate;
//   } else if (
//     effectiveMaxPriorityFee.gte(mediumMaxPriorityFeeInWEI) &&
//     effectiveMaxPriorityFee.lt(highMaxPriorityFeeInWEI)
//   ) {
//     lowerTimeBound = medium.minWaitTimeEstimate;
//     upperTimeBound = medium.maxWaitTimeEstimate;
//   } else if (effectiveMaxPriorityFee.eq(highMaxPriorityFeeInWEI)) {
//     lowerTimeBound = high.minWaitTimeEstimate;
//     upperTimeBound = high.maxWaitTimeEstimate;
//   } else {
//     lowerTimeBound = 0;
//     upperTimeBound = high.maxWaitTimeEstimate;
//   }

//   return {
//     lowerTimeBound,
//     upperTimeBound,
//   };
// }

// /**
//  * Hit the legacy MetaSwaps gasPrices estimate api and return the low, medium
//  * high values from that API.
//  */
// export async function fetchLegacyGasPriceEstimates(
//   url: string
// ): Promise<LegacyGasPriceEstimate> {
//   const result = await handleFetch(url, {
//     referrer: url,
//     referrerPolicy: 'no-referrer-when-downgrade',
//     method: 'GET',
//     mode: 'cors',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
//   return {
//     low: result.SafeGasPrice,
//     medium: result.ProposeGasPrice,
//     high: result.FastGasPrice,
//   };
// }
