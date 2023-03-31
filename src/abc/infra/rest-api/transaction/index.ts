/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import axios from 'axios';
import log from 'loglevel';
// import fetchAdapter from '@vespaiach/axios-fetch-adapter';

import {
  EtherscanTx,
  GasnowDataModel,
  NetworkModel,
  RequestTxApprovalInput,
} from '../../../main/transactions/interface';
import { apiClient } from '../../../utils/axios';
import { CustomError } from '../../../utils/error';
import { DekeyError } from '../../../utils/errorTypes';
import { isBinance, isMatic } from '../../../utils/network';

// const getEstimatedFee = async () => {
//   log.debug('getEstimatedFee');
//   try {
//     const url = 'https://ethgasstation.info/json/ethgasAPI.json';
//     const response = await axios.get(url);
//     if (response.status === 200) {
//       log.debug('estimateGas', response.data);
//       const estimateGas = response.data;

//       return {
//         // fast: Web3.utils.toWei((estimateGas.fastest / 10).toString(), 'gwei'),
//         fast: (estimateGas.fastest / 10).toString(),
//         medium: (estimateGas.fast / 10).toString(),
//         slow: (estimateGas.average / 10).toString(),
//       };
//     } else {
//       throw new Error('ethgasstation.info service error');
//     }
//   } catch (error) {
//     throw error;
//   }
// };

// const validateHash = async (dto: RequestTxApprovalInput, token) => {
//   try {
//     const hashValidateRes = await apiClient.post('/v1/tx/hash/validate', dto, {
//       headers: {
//         authorization: 'Bearer ' + token,
//       },
//     });
//     if (!hashValidateRes.data.approved) {
//       throw new CustomError(DekeyErrors.VALIDATE_HASH);
//     }
//   } catch (error) {
//     //log.error(error);
//     throw error;
//   }
// };

const getMpcJwt = async (dto: { signType?: string; message: string }): Promise<string> => {
  try {
    const res = await apiClient.post('/v1/address/auth/gen', {
      signType: dto.signType,
      jsonMessage: dto.message,
    });
    return res.data.mpcJwt;
  } catch (error: any) {
    throw new CustomError(DekeyError.getMpcJwt(error.message));
  }
};

const getTransactions = async (dto: any): Promise<EtherscanTx[]> => {
  const { address, url, blockNumber, chainId } = dto;
  try {
    let apikey: string | undefined;
    if (isBinance(chainId)) {
      apikey = process.env.BSCSCAN_API_KEY;
    } else if (isMatic(chainId)) {
      apikey = process.env.POLIGONSCAN_API_KEY;
    } else {
      apikey = process.env.ETHERSCAN_API_KEY;
    }

    const params = {
      module: 'account',
      action: 'txlist',
      address,
      startblock: blockNumber,
      endblock: 9999999999,
      sort: 'desc',
      apikey,
      page: 1,
      offset: 100,
    };
    const config = {
      params,
    };

    // const client = axios.create({
    //   baseURL: url,
    //   adapter: fetchAdapter,
    // });

    // const res = await client.get('/', config);

    const res = await axios.request({
      url,
      method: 'get',
      // adapter: fetchAdapter,
      ...config,
    });

    if (res.status === 200 && res.data.status !== '0') {
      return res.data.result;
    }
    throw new Error('Failed to fetch tx list from ether scan');
  } catch (error) {
    // //log.error(error);
    // throw error;
    return [];
  }
};

const getKlaytnTransactions = async (address: string, chainId: string, fromTimestamp: number) => {
  // log.debug('getKlaytnTransactions', {fromTimestamp});
  try {
    const params = fromTimestamp
      ? {
          kind: 'klay',
          range: fromTimestamp + 1,
        }
      : {
          kind: 'klay',
        };

    // log.debug('getKlaytnTransactions params', params);

    const config = {
      params,
      auth: {
        username: process.env.KLAYTN_API_USERNAME,
        password: process.env.KLAYTN_API_PASSWORD,
        Authorization: 'Basic AUTHORIZATION',
      },
      headers: { 'x-chain-id': chainId, 'Content-Type': 'application/json' },
    };

    // @ts-ignore
    const res = await axios.request({
      url: `https://th-api.klaytnapi.com/v2/transfer/account/${address}`,
      method: 'get',
      // adapter: fetchAdapter,
      ...config,
    });

    // const res = await axios.get(
    //   `https://th-api.klaytnapi.com/v2/transfer/account/${address}`,
    //   config
    // );

    // log.debug('getKlaytnTransactions res', res.data);

    return res.data;
  } catch (error) {
    //log.error(error);
  }
};

// const valueTransferFeeDelegation = async (tx, chainId) => {
//   log.debug('valueTransferFeeDelegation', tx);
//   try {
//     // const params = fromTimestamp ? {
//     //   kind: 'klay',
//     //   range: fromTimestamp + 1
//     // } : {
//     //   kind: 'klay',
//     // }

//     // const params = fromTimestamp ? {
//     //   kind: 'ft',
//     //   'ca-filter': contractAddress,
//     //   range: fromTimestamp + 1
//     // } : {

//     // };

//     const accountPoolKrn =
//       'krn:1001:wallet:bdc50fd8-87be-4df3-8856-5f0feb1972c6:account-pool:test';
//     const feePayerPoolKrn =
//       'krn:1001:wallet:bdc50fd8-87be-4df3-8856-5f0feb1972c6:feepayer-pool:test';

//     const config = {
//       auth: {
//         username: process.env.KLAYTN_API_USERNAME,
//         password: process.env.KLAYTN_API_PASSWORD,
//         Authorization: 'Basic AUTHORIZATION',
//       },
//       headers: {
//         'x-chain-id': chainId,
//         'Content-Type': 'application/json',
//         'x-krn': `krn:1001:wallet:local:account-pool:{${accountPoolKrn}},krn:1001:wallet:local:feepayer-pool:{${feePayerPoolKrn}}`,
//       },
//     };

//     // https://th-api.klaytnapi.com/v2/transfer/account/{address}

//     //     chainId: "0x3e9"
//     // data: "0x"
//     // feePayer: "0x91C214d6b22Cd8fEfD856Ba5627521E131a6DFE0"
//     // from: "0x70ed3f903b97f8c40c6df6efcbabee585cafdb8d"
//     // gas: "0x5208"
//     // gasLimit: "0x5208"
//     // gasPrice: "0x5d21dba00"
//     // humanReadable: false
//     // nonce: "0xf"
//     // to: "0x70ed3f903b97f8c40c6df6efcbabee585cafdb8d"
//     // value: "0xb2fd1217800"

//     // feeRatio

//     delete tx.humanReadable;

//     const res = await axios.post(
//       `https://th-api.klaytnapi.com/v2/tx/fd-user/value`,
//       tx,
//       config
//     );

//     log.debug('res', res);

//     return res.data;
//   } catch (error) {
//     //log.error(error);
//   }
// };

const getCoingeckoEthereumPrice = async (ids: string) => {
  try {
    const config = {
      params: {
        ids,
        vs_currencies: 'usd,krw',
      },
    };

    const res = await axios.request({
      url: 'https://api.coingecko.com/api/v3/simple/price',
      method: 'get',
      // adapter: fetchAdapter,
      ...config,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export default {
  getMpcJwt,
  getTransactions,
  getKlaytnTransactions,
  getCoingeckoEthereumPrice,
};
