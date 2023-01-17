/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import {singleton} from 'tsyringe';
import txRestApi from '../../infra/rest-api/transaction';
import {getCoingeckoNetworkName} from '../../utils/network';
import {DekeyStore} from '../store';

// By default, poll every 3 minutes
const DEFAULT_INTERVAL = 30 * 1000;

/**
 * A controller that polls for token exchange
 * rates based on a user's current token list
 */
@singleton()
export class TokenRatesService {
  _handle;
  exchangeRates;
  lastTimestamp;

  constructor(private dekeyStore: DekeyStore) {}

  /**
   * Updates exchange rates for all tokens
   */
  async updateExchangeRates() {
    // const nativeCurrency = this.getNativeCurrency().toLowerCase();
    // if (this._tokens.length > 0) {
    try {
      const {currentNetwork, exchangeRates} = this.dekeyStore.getState();
      const ids = getCoingeckoNetworkName(currentNetwork);
      const result = await txRestApi.getCoingeckoEthereumPrice(ids);

      // if (!result || !result.ethereum) {
      //   throw new Error('No ethereum exchange rates')
      // }

      this.exchangeRates = result;
      this.lastTimestamp = new Date().getTime();

      this.dekeyStore.updateStore({
        exchangeRates: {
          ...exchangeRates,
          ...result,
        },
      });
    } catch (error) {}
  }

  start(interval = DEFAULT_INTERVAL) {
    this._handle && clearInterval(this._handle);
    if (!interval) {
      return;
    }
    this._handle = setInterval(() => {
      this.updateExchangeRates();
    }, interval);
    this.updateExchangeRates();
  }

  stop() {
    this._handle && clearInterval(this._handle);
  }

  getEthereumRates(): {usd: number} {
    try {
      return this.exchangeRates.ethereum;
    } catch (error) {
      throw error;
    }
  }

  isExchangeRatesStale() {
    const dt = new Date();
    const lastDt = new Date(this.lastTimestamp);
    const lastMinuteDt = lastDt.setMinutes(lastDt.getMinutes() + 1);

    return this.lastTimestamp && dt.getTime() >= lastMinuteDt;
  }
}
