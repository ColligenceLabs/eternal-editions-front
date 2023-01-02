/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

/**
 * Metamask gas fee controller code
 */

import { v1 as random } from 'uuid';
import log from 'loglevel';

import {
  fetchGasEstimates as defaultFetchGasEstimates,
  fetchAlchemyGasPriceEstimate as defaultFetchAlchemyGasPriceEstimate,
} from './gas-util';
import { GAS_FEE } from '../../main/db/constants';
import { container, singleton } from 'tsyringe';
import { NetworkService } from '../../usecase/network';
import { ProviderConnectionManager } from '../../usecase/provider/connectionManager';
// import {DekeyStore} from '../../usecase/store';
import { supportsEIP1559 } from '../../utils/network';
import { DekeyData } from '../../dekeyData';

const GAS_FEE_API = 'https://mock-gas-server.herokuapp.com/';
export const LEGACY_GAS_PRICES_API_URL = `https://api.metaswap.codefi.network/gasPrices`;

export type unknownString = 'unknown';

// Fee Market describes the way gas is set after the london hardfork, and was
// defined by EIP-1559.
export type FeeMarketEstimateType = 'fee-market';
// Legacy describes gasPrice estimates from before london hardfork, when the
// user is connected to mainnet and are presented with fast/average/slow
// estimate levels to choose from.
export type LegacyEstimateType = 'legacy';
// EthGasPrice describes a gasPrice estimate received from eth_gasPrice. Post
// london this value should only be used for legacy type transactions when on
// networks that support EIP-1559. This type of estimate is the most accurate
// to display on custom networks that don't support EIP-1559.
export type EthGasPriceEstimateType = 'eth_gasPrice';
// NoEstimate describes the state of the controller before receiving its first
// estimate.
export type NoEstimateType = 'none';

/**
 * Indicates which type of gasEstimate the controller is currently returning.
 * This is useful as a way of asserting that the shape of gasEstimates matches
 * expectations. NONE is a special case indicating that no previous gasEstimate
 * has been fetched.
 */
export const GAS_ESTIMATE_TYPES = {
  META_SWAP: 'metaswap' as FeeMarketEstimateType,
  ALCHEMY: 'alchemy' as FeeMarketEstimateType,
  NONE: 'none' as NoEstimateType,
};

export type GasEstimateType =
  | FeeMarketEstimateType
  | EthGasPriceEstimateType
  | LegacyEstimateType
  | NoEstimateType;

export interface EstimatedGasFeeTimeBounds {
  lowerTimeBound: number | null;
  upperTimeBound: number | unknownString;
}

/**
 * @type EthGasPriceEstimate
 *
 * A single gas price estimate for networks and accounts that don't support EIP-1559
 * This estimate comes from eth_gasPrice but is converted to dec gwei to match other
 * return values
 *
 * @property gasPrice - A GWEI dec string
 */

export interface EthGasPriceEstimate {
  gasPrice: string;
}

/**
 * @type LegacyGasPriceEstimate
 *
 * A set of gas price estimates for networks and accounts that don't support EIP-1559
 * These estimates include low, medium and high all as strings representing gwei in
 * decimal format.
 *
 * @property high - gasPrice, in decimal gwei string format, suggested for fast inclusion
 * @property medium - gasPrice, in decimal gwei string format, suggested for avg inclusion
 * @property low - gasPrice, in decimal gwei string format, suggested for slow inclusion
 */
export interface LegacyGasPriceEstimate {
  high: string;
  medium: string;
  low: string;
}

/**
 * @type Eip1559GasFee
 *
 * Data necessary to provide an estimate of a gas fee with a specific tip
 *
 * @property minWaitTimeEstimate - The fastest the transaction will take, in milliseconds
 * @property maxWaitTimeEstimate - The slowest the transaction will take, in milliseconds
 * @property suggestedMaxPriorityFeePerGas - A suggested "tip", a GWEI hex number
 * @property suggestedMaxFeePerGas - A suggested max fee, the most a user will pay. a GWEI hex number
 */

export interface Eip1559GasFee {
  minWaitTimeEstimate: number; // a time duration in milliseconds
  maxWaitTimeEstimate: number; // a time duration in milliseconds
  suggestedMaxPriorityFeePerGas: string; // a GWEI decimal number
  suggestedMaxFeePerGas: string; // a GWEI decimal number
}

/**
 * @type GasFeeEstimates
 *
 * Data necessary to provide multiple GasFee estimates, and supporting information, to the user
 *
 * @property low - A GasFee for a minimum necessary combination of tip and maxFee
 * @property medium - A GasFee for a recommended combination of tip and maxFee
 * @property high - A GasFee for a high combination of tip and maxFee
 * @property estimatedBaseFee - An estimate of what the base fee will be for the pending/next block. A GWEI dec number
 */

export interface GasFeeEstimates {
  low: Eip1559GasFee;
  medium: Eip1559GasFee;
  high: Eip1559GasFee;
  estimatedBaseFee: string;
}

const metadata = {
  gasFeeEstimates: { persist: true, anonymous: false },
  estimatedGasFeeTimeBounds: { persist: true, anonymous: false },
  gasEstimateType: { persist: true, anonymous: false },
};

export type GasFeeStateEthGasPrice = {
  gasFeeEstimates: EthGasPriceEstimate;
  estimatedGasFeeTimeBounds: Record<string, never>;
  gasEstimateType: EthGasPriceEstimateType;
};

export type GasFeeStateFeeMarket = {
  gasFeeEstimates: GasFeeEstimates;
  estimatedGasFeeTimeBounds: EstimatedGasFeeTimeBounds | Record<string, never>;
  gasEstimateType: FeeMarketEstimateType;
};

export type GasFeeStateLegacy = {
  gasFeeEstimates: LegacyGasPriceEstimate;
  estimatedGasFeeTimeBounds: Record<string, never>;
  gasEstimateType: LegacyEstimateType;
};

export type GasFeeStateNoEstimates = {
  gasFeeEstimates: Record<string, never>;
  estimatedGasFeeTimeBounds: Record<string, never>;
  gasEstimateType: NoEstimateType;
};

export interface FetchGasFeeEstimateOptions {
  shouldUpdateState?: boolean;
}

/**
 * @type GasFeeState
 *
 * Gas Fee controller state
 *
 * @property gasFeeEstimates - Gas fee estimate data based on new EIP-1559 properties
 * @property estimatedGasFeeTimeBounds - Estimates representing the minimum and maximum
 */
export type GasFeeState =
  | GasFeeStateEthGasPrice
  | GasFeeStateFeeMarket
  | GasFeeStateLegacy
  | GasFeeStateNoEstimates;

const name = 'GasFeeController';

// export type GasFeeStateChange = {
//   type: `${typeof name}:stateChange`;
//   payload: [GasFeeState, Patch[]];
// };

export type GetGasFeeState = {
  type: `${typeof name}:getState`;
  handler: () => GasFeeState;
};

const defaultState: GasFeeState = {
  gasFeeEstimates: {},
  estimatedGasFeeTimeBounds: {},
  gasEstimateType: GAS_ESTIMATE_TYPES.NONE,
};

/**
 * Controller that retrieves gas fee estimate data and polls for updated data on a set interval
 */
export class GasFeeService {
  private intervalId?: NodeJS.Timeout;
  private intervalDelay;
  private pollTokens: Set<string>;
  private legacyAPIEndpoint: string;
  private EIP1559APIEndpoint: string;
  fetchGasEstimates;
  fetchAlchemyGasPriceEstimate;

  // private providerConnManager;
  // dekeyStore: DekeyStore;

  /**
   * Creates a GasFeeController instance
   *
   */
  constructor(
    private providerConnManager: ProviderConnectionManager // private dekeyStore: DekeyStore
  ) {
    // this.providerConnManager = container.resolve(ProviderConnectionManager);
    // this.dekeyStore = container.resolve(DekeyStore);

    // this.providerConnManager.on('connected', async () => {
    //   // if (this.currentChainId !== newChainId) {
    //   //   this.currentChainId = newChainId;
    //     await this.resetPolling();
    //   // }
    // })

    this.intervalDelay = 10000;
    this.fetchGasEstimates = defaultFetchGasEstimates;
    this.fetchAlchemyGasPriceEstimate = defaultFetchAlchemyGasPriceEstimate;
    // this.fetchLegacyGasPriceEstimates = fetchLegacyGasPriceEstimates;
    this.pollTokens = new Set();
    this.EIP1559APIEndpoint = `https://gas-api.metaswap.codefi.network/networks/<chain_id>/suggestedGasFees`;
    this.legacyAPIEndpoint = `https://gas-api.metaswap.codefi.network/networks/<chain_id>/gasPrices`;
  }

  // async resetPolling() {
  //   log.info('resetPolling')
  //   if (this.pollTokens.size !== 0) {
  //     const tokens = Array.from(this.pollTokens);
  //     this.stopPolling();
  //     await this.getGasFeeEstimatesAndStartPolling(tokens[0]);
  //     tokens.slice(1).forEach(token => {
  //       this.pollTokens.add(token);
  //     });
  //   }
  // }

  async fetchGasFeeEstimates(options?: FetchGasFeeEstimateOptions) {
    return await this._fetchGasFeeEstimateData(options);
  }

  async getGasFeeEstimatesAndStartPolling(pollToken?: string): Promise<string> {
    try {
      if (this.pollTokens.size === 0) {
        await this._fetchGasFeeEstimateData();
      }

      const _pollToken = pollToken || random();

      this._startPolling(_pollToken);

      return _pollToken;
    } catch (error) {
      // log.error(error);
    }
  }

  /**
   * Gets and sets gasFeeEstimates in state
   *
   * @returns GasFeeEstimates
   */
  async _fetchGasFeeEstimateData(
    options: FetchGasFeeEstimateOptions = {}
  ): Promise<GasFeeState | undefined> {
    const { shouldUpdateState = true } = options;
    // const { currentNetwork } = this.dekeyStore.getState();
    const currentNetwork = DekeyData.DEFAULT_NETWORKS[7];
    const chainId = currentNetwork.chainId;
    let isEIP1559Compatible: boolean;

    try {
      isEIP1559Compatible = this.getEIP1559Compatibility();
    } catch (e) {
      isEIP1559Compatible = false;
    }

    let newState: GasFeeState = {
      gasFeeEstimates: {},
      estimatedGasFeeTimeBounds: {},
      gasEstimateType: GAS_ESTIMATE_TYPES.NONE,
    };

    try {
      /** use EIP1559APIEndpoint only if current network is ethereum mainnet */
      if (isEIP1559Compatible) {
        // throw new Error('fetchGasEstimates error test');
        const estimates = await this.fetchGasEstimates(
          this.EIP1559APIEndpoint.replace('<chain_id>', `${chainId}`)
        );
        // log.info('metaswap estimates', estimates);
        newState = {
          gasFeeEstimates: estimates,
          estimatedGasFeeTimeBounds: {},
          gasEstimateType: GAS_ESTIMATE_TYPES.META_SWAP,
        };
      }
    } catch {
      const estimates = await this.fetchAlchemyGasPriceEstimate(
        this.providerConnManager.web3Alchemy
      );
      // log.info('alchemy estimates', estimates);
      newState = {
        gasFeeEstimates: estimates,
        estimatedGasFeeTimeBounds: {},
        gasEstimateType: GAS_ESTIMATE_TYPES.ALCHEMY,
      };
    }

    // log.info('gasFee newState', {isEIP1559Compatible, newState});

    // if (shouldUpdateState) {
    //   this.dekeyStore.updateStore({
    //     [GAS_FEE]: newState as any,
    //   });
    // }

    return newState;
  }

  /**
   * Remove the poll token, and stop polling if the set of poll tokens is empty
   */
  disconnectPoller(pollToken: string) {
    this.pollTokens.delete(pollToken);
    if (this.pollTokens.size === 0) {
      this.stopPolling();
    }
  }

  stopPolling() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.pollTokens.clear();

    // this.dekeyStore.updateStore({
    //   gasFee: null,
    // });
  }

  // should take a token, so we know that we are only counting once for each open transaction
  private async _startPolling(pollToken: string) {
    if (this.pollTokens.size === 0) {
      this._poll();
    }
    this.pollTokens.add(pollToken);
  }

  private async _poll() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(async () => {
      //   await safelyExecute(() => this._fetchGasFeeEstimateData());
      this._fetchGasFeeEstimateData();
    }, this.intervalDelay);
    log.info('_poll', {
      intervalId: this.intervalId,
      intervalDelay: this.intervalDelay,
    });
  }

  private getEIP1559Compatibility() {
    // const { currentNetwork } = this.dekeyStore.getState();
    const currentNetwork = DekeyData.DEFAULT_NETWORKS[7];
    const currentNetworkIsEIP1559Compatible = supportsEIP1559(currentNetwork);

    return currentNetworkIsEIP1559Compatible;
  }
}
