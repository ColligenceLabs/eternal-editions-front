/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import _ from 'lodash';
import { EventEmitter } from 'events';

import { CURRENT_NETWORK, NETWORKS } from '../../main/db/constants';
import { jsonRpcRequest } from '../../utils/rpc';
// import {DekeyStore} from '../store';
import { ProviderService } from '../provider';
import { isValidURL, trimUrl } from '../../utils/string';
import { DekeyData } from '../../dekeyData';
import env from '../../../env';

export class NetworkService extends EventEmitter {
  constructor(
    // private dekeyStore: DekeyStore,
    private providerService: ProviderService
  ) {
    super();
  }

  validateNetwork = async (dto: {
    rpcUrl: string;
    existingRpcUrl?: string;
    chainId: number;
  }): Promise<{ success: boolean; errors?: any }> => {
    let errors = {};

    const rpcUrl = trimUrl(dto.rpcUrl);
    const existingRpcUrl = dto?.existingRpcUrl ? trimUrl(dto.existingRpcUrl) : null;
    const chainId = dto.chainId;

    // const { networks } = this.dekeyStore.getState();
    const networks = DekeyData.DEFAULT_NETWORKS;

    return new Promise(async (resolve, reject) => {
      // TODO: limit the number of custom networks (storage limit)
      if (
        // (existingRpcUrl &&
        //   rpcUrl !== existingRpcUrl &&
        //   networks.find(n => n.rpcUrl === rpcUrl)) ||
        networks.find((n) => {
          if (existingRpcUrl) {
            return n.rpcUrl === rpcUrl && n.rpcUrl !== existingRpcUrl;
          } else {
            return n.rpcUrl === rpcUrl;
          }
        })
      ) {
        errors = {
          ...errors,
          rpcUrl: {
            error: true,
            message: '이미 등록된 RPC URL 입니다.',
            code: 'txt_error_add_network_rpc',
          },
        };
        return resolve({
          success: false,
          errors,
        });
      }

      // const protocol = rpcUrl.split('://')[0];
      // if (!['ws', 'wss', 'http', 'https'].includes(protocol)) {
      //   errors = {
      //     ...errors,
      //     rpcUrl: {
      //       error: true,
      //       message: 'RPC URL을 다시 확인해주세요.',
      //       // message: '유효하지 않은 RPC URL',
      //       // message: 'Incorrect rpcUrl',
      //     },
      //   };
      //   return resolve({
      //     success: false,
      //     errors,
      //   });
      // }
      if (!isValidURL(rpcUrl)) {
        errors = {
          ...errors,
          rpcUrl: {
            error: true,
            message: 'RPC URL을 다시 확인해주세요.',
            code: 'txt_error_add_network_rpc',
          },
        };
        return resolve({
          success: false,
          errors,
        });
      }

      let endpointChainId: string;
      try {
        endpointChainId = await jsonRpcRequest(rpcUrl, 'eth_chainId');
      } catch (err) {
        errors = {
          ...errors,
          chainId: {
            error: true,
            message: "'eth_chainId' 메서드에 대한 요청이 실패했습니다.",
            code: 'txt_error_add_network_method',
          },
        };
        return resolve({
          success: false,
          errors,
        });
      }
      if (chainId !== Number(endpointChainId)) {
        errors = {
          ...errors,
          chainId: {
            error: true,
            message: `체인 ID를 다시 확인해주세요.`,
            code: 'txt_error_add_network_chainid',
          },
        };
      }

      if (!_.isEmpty(errors)) {
        return resolve({
          success: false,
          errors,
        });
      }

      return resolve({
        success: true,
      });
    });
  };

  /**
   * Method to check if the block header contains fields that indicate EIP 1559
   * support (baseFeePerGas) AND update db accordingly.
   * @returns {Promise<boolean>} true if current network supports EIP 1559
   */
  setEIP1559Compatibility = (latestBlock) => {
    // const { networks, currentNetwork } = this.dekeyStore.getState();
    const networks = DekeyData.DEFAULT_NETWORKS;
    const currentNetwork = DekeyData.DEFAULT_NETWORKS[env.REACT_APP_TARGET_NETWORK === 137 ? 6 : 7];

    // If flag is set to true, don't repeat logic
    if (currentNetwork.EIPS && currentNetwork.EIPS[1559] === true) {
      return;
    }

    const supportsEIP1559 = latestBlock.baseFeePerGas !== undefined;

    // this.dekeyStore.updateStore({
    //   [NETWORKS]: networks.map((n) => {
    //     if (n.id === currentNetwork.id) {
    //       return {
    //         ...n,
    //         EIPS: {
    //           ['1559']: supportsEIP1559,
    //         },
    //       };
    //     }
    //     return n;
    //   }),
    //   [CURRENT_NETWORK]: {
    //     ...currentNetwork,
    //     EIPS: {
    //       ['1559']: supportsEIP1559,
    //     },
    //   },
    // });

    return supportsEIP1559;
  };
}
