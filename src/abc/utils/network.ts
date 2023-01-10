/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import {v4 as uuidv4} from 'uuid';
// import {intToHex} from 'dekey-eth-json-rpc-filters/hexUtils';

import {DekeyData} from '../dekeyData';
import {NetworkModel} from '../main/transactions/interface';
import {Account} from '../schema/model';
import {makeIcon} from './icon';
import {trimUrl} from './string';
import UserUtil from './user';

const CHAIN_ID_LIST = DekeyData.CHAIN_ID_LIST;
const L2_NETWORKS = DekeyData.L2_NETWORKS;

function intToHex(int) {
  if (int === undefined || int === null) return int;
  let hexString = int.toString(16);
  // const needsLeftPad = hexString.length % 2;
  // if (needsLeftPad) hexString = '0' + hexString;
  return '0x' + hexString;
}

export const isKlaytn = (chainId: number) => {
  return [1001, 8217].includes(Number(chainId));
};

export const isMatic = (chainId: number) => {
  return [CHAIN_ID_LIST['matic'], CHAIN_ID_LIST['mumbaiGoerli']].includes(
    chainId
  );
};

export const isEthereumMainnet = (chainId: number) => {
  return chainId === 1;
};

export const isKlaytnMainnet = (chainId: number) => {
  return chainId === 8217;
};

export const isEthereum = (chainId: number) => {
  return Object.values(CHAIN_ID_LIST).includes(chainId);
};

export const isBinance = (chainId: number) => {
  return (
    CHAIN_ID_LIST['binanceSmartChain'] === chainId ||
    CHAIN_ID_LIST['binanceTestnet'] === chainId
  );
};

export const isWebsocket = (rpcUrl: string) => {
  const protocol = rpcUrl.split('://')[0];
  if (protocol === 'ws' || protocol === 'wss') {
    return true;
  }
  return false;
};

export const isL2 = (chainId: number) => {
  return L2_NETWORKS.find(n => n.chainId === chainId);
};

export const supportsEIP1559 = (network: NetworkModel) => {
  if (isKlaytn(network.chainId)) {
    return false;
  }
  return network['EIPS'] ? network['EIPS']['1559'] : false;
};

export const createNetwork = ({
  rpcUrl,
  blockExplorerUrl,
  symbol,
  chainId,
  name,
}) => {
  const icon = makeIcon(rpcUrl);

  return {
    id: uuidv4(),
    rpcUrl: trimUrl(rpcUrl),
    blockExplorerUrl: trimUrl(blockExplorerUrl),
    name,
    symbol: symbol || 'ETH',
    chainId: +chainId,
    isCustom: true,
    target: 'direct',
    iconUrl: icon,
  };
};

export const updateNetworkUtil = ({
  networks,
  blockExplorerUrl,
  rpcUrl,
  symbol,
  chainId,
  networkId,
  name,
}) => {
  return networks.map(n => {
    if (n.id === networkId) {
      return {
        ...n,
        blockExplorerUrl: blockExplorerUrl.replace(/\/$/, ''),
        rpcUrl: rpcUrl.replace(/\/$/, ''),
        symbol: symbol !== '' ? symbol : 'ETH',
        chainId: +chainId,
        name,
      };
    }
    return n;
  });
};

export const getEtherscanApiUrl = (chainId: number) => {
  return DekeyData.BLOCK_EXPLORERS[chainId.toString()];
};

export const getBlockExplorerUrlForTx = (
  blockExplorerUrl: string,
  hash: string
) => {
  return `${blockExplorerUrl.replace(/\/+$/u, '')}/tx/${hash}`;
};

export const getProviderNetworkState = (chainId?: number) => {
  if (!chainId) {
    return {};
  }
  return {
    chainId: intToHex(chainId),
    networkVersion:
      chainId === 8217 || chainId === 1001 ? chainId : String(chainId),
    // networkVersion: String(chainId),
  };
};

export const getApiKey = (chainId?: number) => {
  let apikey: string;
  if (isBinance(chainId)) {
    apikey = process.env.BSCSCAN_API_KEY;
  } else if (isMatic(chainId)) {
    apikey = process.env.POLIGONSCAN_API_KEY;
  } else {
    apikey = process.env.ETHERSCAN_API_KEY;
  }
  return apikey;
};

export const makeFetchEtherscanTokenTxsParmas = ({
  contractaddress,
  address,
  startblock,
  apikey,
}) => {
  return {
    module: 'account',
    action: 'tokentx',
    contractaddress,
    address,
    startblock,
    endBlock: 9999999999,
    page: 1,
    offset: 100,
    sort: 'desc',
    apikey,
  };
};

export const makeFetchKlaytnTokenTxsConfig = ({
  fromTimestamp,
  contractAddress,
  chainId,
}) => {
  const params = {
    kind: 'ft',
    'ca-filter': contractAddress,
    ...(fromTimestamp && {range: fromTimestamp + 1}),
  };

  const config = {
    ...makeKlaytnApiServiceDefaultConfig(chainId),
    params,
  };

  return config;
};

export const makeKlaytnApiServiceDefaultConfig = (chainId: number) => {
  return {
    auth: {
      username: process.env.KLAYTN_API_USERNAME,
      password: process.env.KLAYTN_API_PASSWORD,
      Authorization: 'Basic AUTHORIZATION',
    },
    headers: {'x-chain-id': chainId, 'Content-Type': 'application/json'},
  };
};

export const showEip1559Gas = (network: NetworkModel, account: Account) => {
  const gasEip1559 =
    !isKlaytn(network.chainId) &&
    // !isMatic(currentNetwork.chainId) &&
    network['EIPS'] &&
    network['EIPS']['1559'];

  return !UserUtil.isHardwareAccount(account) && gasEip1559;
};

export const getCoingeckoNetworkName = (network: NetworkModel) => {
  if (isKlaytn(network.chainId)) {
    return 'klay-token';
  }
  if (
    network.chainId === 1 ||
    network.chainId === 3 ||
    network.chainId === 4 ||
    network.chainId === 5 ||
    network.chainId === 42
  ) {
    return 'ethereum';
  }
  if (network.chainId === 137 || network.chainId === 80001) {
    return 'matic-network';
  }
  if (network.chainId === 56 || network.chainId === 97) {
    return 'binancecoin';
  }
};
