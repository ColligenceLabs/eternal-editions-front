/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import { Decimal } from 'decimal.js';
import log from 'loglevel';

export const toFixedNoRounding = (aaa: number, n: number) => {
  if (aaa === 0) {
    return '0';
  }
  const reg = new RegExp('^-?\\d+(?:\\.\\d{0,' + n + '})?', 'g');
  const a = aaa.toString().match(reg)[0];
  const dot = a.indexOf('.');
  if (dot === -1) {
    // integer, insert decimal dot and pad up zeros
    return a + '.' + '0'.repeat(n);
  }
  const b = n - (a.length - dot) + 1;
  return b > 0 ? parseFloat(a + '0'.repeat(b)).toString() : parseFloat(a).toString();
  // return b > 0 ? a + '0'.repeat(b) : a;
};

export const formatAmount = (amount: number, n: number) => {
  try {
    const x = new Decimal(amount);
    if (x.isInteger()) {
      return x.toString();
    }

    // check exponential
    const regex = new RegExp('[-+]?[0-9]*.?[0-9]+([eE][-+]?[0-9]+)', 'g');
    const xDP = x.toDecimalPlaces(n).toString();
    if (!regex.test(xDP)) {
      return xDP;
    }

    return x.toFixed(n);
  } catch (error) {
    log.info('formatAmount error');
    throw error;
  }
};
