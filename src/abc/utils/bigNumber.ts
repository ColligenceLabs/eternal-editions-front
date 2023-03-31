/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import BN from 'bn.js';
import { stripHexPrefix } from 'ethereumjs-util';

import { addHexPrefix } from './string';

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
 * Converts a BN object to a hex string with a '0x' prefix
 *
 * @param {BN} inputBn - The BN to convert to a hex string
 * @returns {string} - A '0x' prefixed hex string
 *
 */
function bnToHex(inputBn: any) {
  return addHexPrefix(inputBn.toString(16));
}

const BigNumberUtil = {
  hexToBn,
  bnToHex,
};

export default BigNumberUtil;
