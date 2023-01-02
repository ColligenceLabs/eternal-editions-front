/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

export type CurrencyType = 'krw' | 'usd' | 'jpy';

export interface ChangeCurrencyTypeDto {
  currencyType: CurrencyType; // krw or usd
}
