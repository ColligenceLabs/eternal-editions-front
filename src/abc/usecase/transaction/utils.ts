/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import assert from 'assert';
import extension from 'extensionizer';
import { stripHexPrefix } from 'ethereumjs-util';
import BN from 'bn.js';
import { memoize } from 'lodash';
import { ethers } from 'ethers';

/**
 * Checks whether a given balance of ETH, represented as a hex string, is sufficient to pay a value plus a gas fee
 *
 * @param {Object} txParams - Contains data about a transaction
 * @param {string} txParams.gas - The gas for a transaction
 * @param {string} txParams.gasPrice - The price per gas for the transaction
 * @param {string} txParams.value - The value of ETH to send
 * @param {string} hexBalance - A balance of ETH represented as a hex string
 * @returns {boolean} Whether the balance is greater than or equal to the value plus the value of gas times gasPrice
 *
 */
function sufficientBalance(txParams: any, hexBalance: any) {
  // validate hexBalance is a hex string
  assert.equal(typeof hexBalance, 'string', 'sufficientBalance - hexBalance is not a hex string');
  assert.equal(hexBalance.slice(0, 2), '0x', 'sufficientBalance - hexBalance is not a hex string');

  const balance = hexToBn(hexBalance);
  const value = hexToBn(txParams.value);
  const gasLimit = hexToBn(txParams.gas);
  const gasPrice = hexToBn(txParams.gasPrice);

  const maxCost = value.add(gasLimit.mul(gasPrice));
  return balance.gte(maxCost);
}

/**
 * Converts a hex string to a BN object
 *
 * @param {string} inputHex - A number represented as a hex string
 * @returns {Object} A BN object
 *
 */
function hexToBn(inputHex: string) {
  return new BN(stripHexPrefix(inputHex), 16);
}

/**
 * Used to multiply a BN by a fraction
 *
 * @param {BN} targetBN - The number to multiply by a fraction
 * @param {number|string} numerator - The numerator of the fraction multiplier
 * @param {number|string} denominator - The denominator of the fraction multiplier
 * @returns {BN} The product of the multiplication
 *
 */
function BnMultiplyByFraction(targetBN: any, numerator: any, denominator: any) {
  const numBN = new BN(numerator);
  const denomBN = new BN(denominator);
  return targetBN.mul(numBN).div(denomBN);
}

/**
 * Returns an Error if extension.runtime.lastError is present
 * this is a workaround for the non-standard error object that's used
 * @returns {Error|undefined}
 */
function checkForError() {
  const { lastError } = extension.runtime;
  if (!lastError) {
    return undefined;
  }
  // if it quacks like an Error, its an Error
  if (lastError.stack && lastError.message) {
    return lastError;
  }
  // repair incomplete error object (eg chromium v77)
  return new Error(lastError.message);
}

/**
 * Prefixes a hex string with '0x' or '-0x' and returns it. Idempotent.
 *
 * @param {string} str - The string to prefix.
 * @returns {string} The prefixed string.
 */
const addHexPrefix = (str: any) => {
  if (typeof str !== 'string' || str.match(/^-?0x/u)) {
    return str;
  }

  if (str.match(/^-?0X/u)) {
    return str.replace('0X', '0x');
  }

  if (str.startsWith('-')) {
    return str.replace('-', '-0x');
  }

  return `0x${str}`;
};

/**
 * Converts a BN object to a hex string with a '0x' prefix
 *
 * @param {BN} inputBn - The BN to convert to a hex string
 * @returns {string} - A '0x' prefixed hex string
 *
 */
function bnToHex(inputBn: any) {
  return addHexPrefix(inputBn.toString(16));
}

export { sufficientBalance, hexToBn, BnMultiplyByFraction, checkForError, addHexPrefix, bnToHex };
