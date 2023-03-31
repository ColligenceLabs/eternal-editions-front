/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import { BigNumber, ethers, utils } from 'ethers';
import { container, singleton } from 'tsyringe';
import humanAbi from 'human-standard-token-abi';

import { TokenRatesService } from '../rates';
import { CURRENT_NETWORK } from '../../main/db/constants';
import { DekeyStore } from '../store';
// import {
//   addHexPrefix,
//   BnMultiplyByFraction,
//   bnToHex,
//   hexToBn,
// } from '../../helpers';
import { ProviderConnectionManager } from '../provider/connectionManager';
import { NetworkService } from '../network';
import { GasFeeService, GasFeeEstimates, GAS_ESTIMATE_TYPES } from './gasFee';
import { isEthereumMainnet, isKlaytn, isL2, supportsEIP1559 } from '../../utils/network';
import GasUtil from '../../utils/gas';
import { addHexPrefix } from '../../utils/string';
import { BnMultiplyByFraction, bnToHex, hexToBn } from '../transaction/utils';
import { DekeyData } from '../../dekeyData';

export class GasService {
  gasNowData: any;
  // @ts-ignore
  isGasnowConnected: boolean;

  constructor(
    // private dekeyStore: DekeyStore,
    private providerConnManager: ProviderConnectionManager
  ) {}

  makeAutoconfirmGasData = async ({
    networkService,
    gasFeeService,
    // dekeyStore,
    latestBlock,
  }: {
    networkService: NetworkService;
    gasFeeService: GasFeeService;
    // dekeyStore: DekeyStore;
    latestBlock: { baseFeePerGas: string };
  }) => {
    // const { currentNetwork } = this.dekeyStore.getState();
    const currentNetwork = DekeyData.DEFAULT_NETWORKS[7];
    if (!supportsEIP1559(currentNetwork)) {
      return {
        gasPrice: await this.getGasPrice(),
      };
    }

    /** set maxFeePerGas and maxPriorityFeePerGas on Ethereum mainnet */
    // if (
    //   network.chainId === 1 ||
    //   network.chainId === 3 ||
    //   network.chainId === 4 ||
    //   network.chainId === 5
    // ) {
    try {
      // @ts-ignore
      const { gasFeeEstimates, estimatedGasFeeTimeBounds, gasEstimateType } =
        await gasFeeService.fetchGasFeeEstimates();

      if (gasEstimateType === GAS_ESTIMATE_TYPES.NONE) {
        throw new Error('failed to fetch gas fee estimates');
      }

      const high = (gasFeeEstimates as GasFeeEstimates).high;

      return {
        maxFeePerGas: utils.parseUnits(high.suggestedMaxFeePerGas, 'gwei').toHexString(),
        maxPriorityFeePerGas: utils
          .parseUnits(high.suggestedMaxPriorityFeePerGas, 'gwei')
          .toHexString(),
        // maxFeePerGas: utils.parseUnits('0.2', 'gwei').toHexString(), // max priority fee per gas higher than max fee per gas
        // maxPriorityFeePerGas: utils
        //   .parseUnits('0.1', 'gwei') // 0.1 gwei for speedup, cancel tx testing
        //   .toHexString(),
      };
    } catch (error) {}
  };

  // TODO: separate token case and others
  async getGasLimit({
    contractAddress = '',
    to,
    from,
    latestBlock,
    value,
  }: {
    contractAddress?: string;
    to: string;
    from: string;
    latestBlock: any;
    value: string; // eth string
  }) {
    /** In case of EOS address, default gasLimit is 21000 */
    let gasLimit = '21000';

    // const { currentNetwork, assets } = this.dekeyStore.getState();
    const currentNetwork = DekeyData.DEFAULT_NETWORKS[7];
    const { chainId } = currentNetwork;

    // const foundAsset = assets.find((a) => a.contractAddress === contractAddress);

    // const decimal = contractAddress ? String(foundAsset.decimal) : '18';
    const decimal = '18';

    const paramsForGasEstimate = {
      from,
      to,
      value: ethers.utils.parseUnits(value, decimal).toHexString(),
    };

    /**
     * "to" is Not EOS address OR
     * current network is L2
     */
    //
    const contractCode = Boolean(to) && (await this.providerConnManager.getCode(to));
    const contractCodeIsEmpty = !contractCode || contractCode === '0x' || contractCode === '0x0';

    if (contractAddress) {
      const erc20 = new ethers.Contract(
        contractAddress,
        humanAbi,
        this.providerConnManager.ethersProvider
      );

      const blockGasLimitHex = isKlaytn(chainId) ? latestBlock.gasUsed : latestBlock.gasLimit;

      try {
        /** estimate gasLimit based on value 1 wei */
        const estimateGasResult = await erc20.estimateGas.transfer(to, paramsForGasEstimate.value, {
          from,
        });
        gasLimit = BigNumber.from(
          GasUtil.addGasBuffer(estimateGasResult.toHexString(), blockGasLimitHex, chainId)
        ).toString();
      } catch (error) {
        /** if estimateGas fails, set gaslimit to latestBlock gaslimit * 0.9 */
        gasLimit = BigNumber.from(GasUtil.addBufferToBlockGasLimit(blockGasLimitHex)).toString();
      }
    } else if (!contractAddress && (!contractCodeIsEmpty || isL2(chainId))) {
      const { blockGasLimit, estimatedGasHex, simulationFails } = await this.analyzeGasUsage(
        paramsForGasEstimate,
        latestBlock
      );

      gasLimit = BigNumber.from(
        GasUtil.addGasBuffer(addHexPrefix(estimatedGasHex), blockGasLimit, chainId)
      ).toString();
    }

    return gasLimit;
  }

  analyzeGasUsage = async (txMeta: any, block: any) => {
    let simulationFails;

    // if (txMeta.type) {
    //   delete txMeta.type;
    // }

    // const { currentNetwork } = this.dekeyStore.getState();
    const currentNetwork = DekeyData.DEFAULT_NETWORKS[7];

    const blockGasLimit = isKlaytn(currentNetwork.chainId) ? block.gasUsed : block.gasLimit;

    const blockGasLimitBN = hexToBn(blockGasLimit);
    const saferGasLimitBN = BnMultiplyByFraction(blockGasLimitBN, 19, 20);
    let estimatedGasHex = bnToHex(saferGasLimitBN);

    try {
      estimatedGasHex = await this.providerConnManager.estimateGas(txMeta);
    } catch (error: any) {
      simulationFails = {
        reason: error.message,
        errorKey: error.errorKey,
        // debug: {blockNumber: block.number, blockGasLimit: block.gasLimit},
      };
    }

    return {
      blockGasLimit,
      estimatedGasHex,
      simulationFails,
    };
  };

  async getGasPrice(): Promise<any> {
    return this.providerConnManager.getGasPrice();

    // const gasPrice =
    //   isEthereumMainnet(network.chainId) &&
    //   this.isGasnowConnected &&
    //   this.gasNowData
    //     ? this.gasNowData.fast
    //     : await this.providerConnManager.getGasPrice();
  }

  // getFeeData = block => {
  //   if (!block || !block.baseFeePerGas) {
  //     throw new Error('No baseFeePerGas');
  //   }
  //   const maxPriorityFeePerGas = BigNumber.from('1000000000');
  //   const maxFeePerGas = BigNumber.from(block.baseFeePerGas)
  //     .mul(2)
  //     .add(maxPriorityFeePerGas);
  //   return {
  //     maxPriorityFeePerGas,
  //     maxFeePerGas,
  //   };
  // };
}
