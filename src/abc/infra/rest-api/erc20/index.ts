/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import axios from 'axios';
import fetchAdapter from '@vespaiach/axios-fetch-adapter';

import {
  EtherscanTokenTx,
  FetchTokenTxResult,
  FetchTokenTxs,
} from '../../../main/erc20/interface';
import {
  getApiKey,
  getEtherscanApiUrl,
  isKlaytn,
  makeFetchEtherscanTokenTxsParmas,
  makeFetchKlaytnTokenTxsConfig,
} from '../../../utils/network';

// const ETHERSCAN_API_KEY = 'MEQX8AI7GVKJRG1ITPHQ9XJKCYR8FG4BEH';
export const ERC20_ABI = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_spender',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_from',
        type: 'address',
      },
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        name: '',
        type: 'uint8',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
      {
        name: '_spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    payable: true,
    stateMutability: 'payable',
    type: 'fallback',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
];
export const KIP_ABI = [
  {
    constant: true,
    inputs: [{name: 'interfaceId', type: 'bytes4'}],
    name: 'supportsInterface',
    outputs: [{name: '', type: 'bool'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{name: '', type: 'string'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {name: 'spender', type: 'address'},
      {name: 'value', type: 'uint256'},
    ],
    name: 'approve',
    outputs: [{name: '', type: 'bool'}],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{name: 'owner', type: 'address'}],
    name: 'setOwner',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {name: 'sender', type: 'address'},
      {name: 'recipient', type: 'address'},
      {name: 'amount', type: 'uint256'},
    ],
    name: 'transferFrom',
    outputs: [{name: '', type: 'bool'}],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{name: '', type: 'uint8'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'isInitialized',
    outputs: [{name: '', type: 'bool'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: '_version',
    outputs: [
      {name: 'name', type: 'string'},
      {name: 'version', type: 'string'},
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {name: 'recipient', type: 'address'},
      {name: 'amount', type: 'uint256'},
    ],
    name: 'safeTransfer',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {name: 'sender', type: 'address'},
      {name: 'recipient', type: 'address'},
      {name: 'amount', type: 'uint256'},
    ],
    name: 'safeTransferFrom',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: '_minter',
    outputs: [{name: '', type: 'address'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {name: 'spender', type: 'address'},
      {name: 'value', type: 'uint256'},
    ],
    name: 'decreaseApproval',
    outputs: [{name: '', type: 'bool'}],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{name: 'account', type: 'address'}],
    name: 'balanceOf',
    outputs: [{name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{name: '', type: 'string'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {name: 'recipient', type: 'address'},
      {name: 'amount', type: 'uint256'},
    ],
    name: 'transfer',
    outputs: [{name: '', type: 'bool'}],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: '_owner',
    outputs: [{name: '', type: 'address'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {name: 'sender', type: 'address'},
      {name: 'recipient', type: 'address'},
      {name: 'amount', type: 'uint256'},
      {name: 'data', type: 'bytes'},
    ],
    name: 'safeTransferFrom',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {name: 'spender', type: 'address'},
      {name: 'value', type: 'uint256'},
    ],
    name: 'increaseApproval',
    outputs: [{name: '', type: 'bool'}],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {name: 'tokenName', type: 'string'},
      {name: 'tokenSymbol', type: 'string'},
    ],
    name: 'setTokenInfo',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {name: 'owner', type: 'address'},
      {name: 'spender', type: 'address'},
    ],
    name: 'allowance',
    outputs: [{name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {name: 'recipient', type: 'address'},
      {name: 'amount', type: 'uint256'},
      {name: 'data', type: 'bytes'},
    ],
    name: 'safeTransfer',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{name: 'minter', type: 'address'}],
    name: 'setMinter',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {name: 'owner', type: 'address'},
      {name: 'minter', type: 'address'},
      {name: 'decimals', type: 'uint8'},
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [{indexed: false, name: 'owner', type: 'address'}],
    name: 'SetOwner',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{indexed: false, name: 'minter', type: 'address'}],
    name: 'SetMinter',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: false, name: 'name', type: 'string'},
      {indexed: false, name: 'symbol', type: 'string'},
    ],
    name: 'SetTokenInfo',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, name: 'from', type: 'address'},
      {indexed: true, name: 'to', type: 'address'},
      {indexed: false, name: 'amount', type: 'uint256'},
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, name: 'holder', type: 'address'},
      {indexed: true, name: 'spender', type: 'address'},
      {indexed: false, name: 'amount', type: 'uint256'},
    ],
    name: 'Approval',
    type: 'event',
  },
];

export const SINGLE_CALL_BALANCES_ADDRESS =
  '0xb1f8e55c7f64d203c1400b9d8555d050f94adf39';
export const SINGLE_CALL_BALANCES_ADDRESS_RINKEBY =
  '0x9f510b19f1ad66f0dcf6e45559fab0d6752c1db7';
export const SINGLE_CALL_BALANCES_ADDRESS_ROPSTEN =
  '0xb8e671734ce5c8d7dfbbea5574fa4cf39f7a54a4';
export const SINGLE_CALL_BALANCES_ADDRESS_KOVAN =
  '0xb1d3fbb2f83aecd196f474c16ca5d9cffa0d0ffc';

export const SINGLE_CALL_BALANCES_ABI = [
  {
    constant: true,
    inputs: [
      {name: 'user', type: 'address'},
      {name: 'token', type: 'address'},
    ],
    name: 'tokenBalance',
    outputs: [{name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {name: 'users', type: 'address[]'},
      {name: 'tokens', type: 'address[]'},
    ],
    name: 'balances',
    outputs: [{name: '', type: 'uint256[]'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {payable: true, stateMutability: 'payable', type: 'fallback'},
];

const fetchTokenTxsFromEtherscan = async (
  dto: FetchTokenTxs
): Promise<FetchTokenTxResult> => {
  try {
    const {contractAddress, myAddress, startblock, chainId} = dto;

    const url = getEtherscanApiUrl(chainId);

    const apikey = getApiKey(chainId);

    const params = makeFetchEtherscanTokenTxsParmas({
      contractaddress: contractAddress,
      address: myAddress,
      startblock,
      apikey,
    });

    const res = await axios.request({
      url,
      method: 'get',
      adapter: fetchAdapter,
      params,
    });

    if (res.status === 200 && res.data.status !== '0') {
      return {
        success: true,
        txs: res.data.result as EtherscanTokenTx[],
      };
    }
    return {success: false};
  } catch (error) {
    return {success: false};
  }
};

const getAbi = async (
  contractAddress: string,
  url: string,
  chainId: number
) => {
  try {
    if (isKlaytn(chainId)) {
      return JSON.stringify(KIP_ABI);
    }

    const apiKey = getApiKey(chainId);

    const params = {
      module: 'contract',
      action: 'getabi',
      address: contractAddress,
      apiKey,
    };

    const res = await axios.request({
      url,
      method: 'get',
      adapter: fetchAdapter,
      params,
    });

    if (res.status === 200 && res.data.status !== '0') {
      return res.data.result;
    }
    return null;
  } catch (err) {}
};

const fetchKlaytnTokenTxs = async (
  address: string,
  chainId: number,
  contractAddress: string,
  fromTimestamp: number
) => {
  try {
    const config = makeFetchKlaytnTokenTxsConfig({
      contractAddress,
      fromTimestamp,
      chainId,
    });

    const res = await axios.request({
      url: `https://th-api.klaytnapi.com/v2/transfer/account/${address}`,
      method: 'get',
      adapter: fetchAdapter,
      ...config,
    });

    if (res.status !== 200 || res.statusText !== 'OK') {
      throw new Error('Failed to fetch klaytn token txs');
    }

    return res.data.items;
  } catch (error) {}
};

export default {
  fetchTokenTxsFromEtherscan,
  fetchKlaytnTokenTxs,
  getAbi,
};
