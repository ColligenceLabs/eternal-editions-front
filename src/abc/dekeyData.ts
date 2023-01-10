/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import {v4 as uuidv4} from 'uuid';

export class DekeyData {
  static CHAIN_ID_LIST = {
    eth: 1,
    ropsten: 3,
    rinkeby: 4,
    goerli: 5,
    kovan: 42,
    binanceSmartChain: 56,
    binanceTestnet: 97,
    baobob: 1001,
    cypress: 8217,
    arbitrum: 42161,
    arbitrumRinkeby: 421611,
    optimistic: 10,
    optimisticKovan: 69,
    matic: 137,
    mumbaiGoerli: 80001,
  };

  static BLOCK_EXPLORERS = {
    ['1']: 'https://api.etherscan.io/api',
    ['3']: 'https://api-ropsten.etherscan.io/api',
    ['4']: 'https://api-rinkeby.etherscan.io/api',
    ['5']: 'https://api-goerli.etherscan.io/api',
    ['42']: 'https://api-kovan.etherscan.io/api',
    ['56']: 'https://api.bscscan.com/api',
    ['97']: 'https://api-testnet.bscscan.com/api',
    [DekeyData.CHAIN_ID_LIST['optimistic']]:
      'https://api-optimistic.etherscan.io/api',
    [DekeyData.CHAIN_ID_LIST['optimisticKovan']]:
      'https://api-kovan-optimistic.etherscan.io/api',
    [DekeyData.CHAIN_ID_LIST['matic']]: 'https://api.polygonscan.com/api',
    [DekeyData.CHAIN_ID_LIST['mumbaiGoerli']]:
      'https://api-testnet.polygonscan.com/api',
    [DekeyData.CHAIN_ID_LIST['arbitrum']]: 'https://api.arbiscan.io/api',
  };

  static L2_NETWORKS = [
    /** L2 Mainnet */
    {
      id: uuidv4(),
      name: 'Arbitrum One Mainnet',
      // rpcUrl: 'https://arb-mainnet.g.alchemy.com/v2',
      rpcUrl: 'https://arb1.arbitrum.io/rpc',
      chainId: DekeyData.CHAIN_ID_LIST['arbitrum'],
      // target: 'alchemyArbitrum',
      target: 'direct',
      isCustom: false,
      symbol: 'ETH',
      // blockExplorerUrl: 'http://explorer.arbitrum.io/',
      blockExplorerUrl: 'https://arbiscan.io',
      iconUrl: './networks/arb.png',
      assetName: 'Ethereum',
    },
    {
      id: uuidv4(),
      name: 'Optimism Mainnet',
      rpcUrl: 'https://mainnet.optimism.io',
      chainId: DekeyData.CHAIN_ID_LIST['optimistic'],
      target: 'direct',
      isCustom: false,
      symbol: 'ETH',
      blockExplorerUrl: 'https://optimistic.etherscan.io',
      iconUrl: './networks/opt.png',
      assetName: 'Ethereum',
    },
  ];

  static DEFAULT_NETWORKS = [
    // Ethereum
    {
      id: uuidv4(),
      name: 'Ethereum Mainnet',
      rpcUrl: 'https://eth-mainnet.alchemyapi.io/v2',
      chainId: DekeyData.CHAIN_ID_LIST['eth'],
      target: 'alchemy',
      isCustom: false,
      symbol: 'ETH',
      blockExplorerUrl: 'https://etherscan.io',
      iconUrl: './networks/eth.png',
      assetName: 'Ethereum',
    },
    {
      id: uuidv4(),
      name: 'Goerli Testnet',
      rpcUrl: 'https://goerli.infura.io/v3',
      chainId: DekeyData.CHAIN_ID_LIST['goerli'],
      target: 'infuraGoerli',
      isCustom: false,
      symbol: 'ETH',
      blockExplorerUrl: 'https://goerli.etherscan.io',
      iconUrl: './networks/eth.png',
      assetName: 'Ethereum',
    },
    // Klaytn
    {
      id: uuidv4(),
      name: 'Klaytn Mainnet',
      rpcUrl: 'https://node-api.klaytnapi.com/v1/klaytn',
      chainId: DekeyData.CHAIN_ID_LIST['cypress'],
      target: 'direct',
      isCustom: false,
      symbol: 'KLAY',
      blockExplorerUrl: 'https://scope.klaytn.com',
      iconUrl: './networks/klay.png',
      assetName: 'Klaytn',
    },
    {
      id: uuidv4(),
      name: 'Klaytn Testnet',
      rpcUrl: 'https://node-api.klaytnapi.com/v1/klaytn',
      chainId: DekeyData.CHAIN_ID_LIST['baobob'],
      target: 'direct',
      isCustom: false,
      symbol: 'KLAY',
      blockExplorerUrl: 'https://baobab.scope.klaytn.com',
      iconUrl: './networks/klay.png',
      assetName: 'Klaytn',
    },
    // Binance
    {
      id: uuidv4(),
      name: 'Binance Smart Chain Mainnet',
      rpcUrl: 'https://bsc-dataseed.binance.org',
      chainId: DekeyData.CHAIN_ID_LIST['binanceSmartChain'],
      target: 'direct',
      isCustom: false,
      symbol: 'BNB',
      blockExplorerUrl: 'https://bscscan.com',
      iconUrl: './networks/bnb.png',
      assetName: 'Binance',
    },
    {
      id: uuidv4(),
      name: 'Binance Testnet',
      rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainId: DekeyData.CHAIN_ID_LIST['binanceTestnet'],
      target: 'direct',
      isCustom: false,
      symbol: 'BNB',
      blockExplorerUrl: 'https://testnet.bscscan.com',
      iconUrl: './networks/bnb.png',
      assetName: 'Binance',
    },
    // Matic
    {
      id: uuidv4(),
      name: 'Matic Polygon Mainnet',
      rpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2',
      chainId: DekeyData.CHAIN_ID_LIST['matic'],
      target: 'alchemyPolygon',
      isCustom: false,
      symbol: 'MATIC',
      blockExplorerUrl: 'https://polygonscan.com',
      iconUrl: './networks/matic.png',
      assetName: 'Matic',
    },
    {
      id: uuidv4(),
      name: 'Matic Mumbai Testnet',
      rpcUrl: 'https://polygon-mumbai.g.alchemy.com/v2',
      chainId: DekeyData.CHAIN_ID_LIST['mumbaiGoerli'],
      target: 'alchemyMumbai',
      isCustom: false,
      symbol: 'MATIC',
      blockExplorerUrl: 'https://mumbai.polygonscan.com',
      iconUrl: './networks/matic.png',
      assetName: 'Matic',
    },
  ];

  static DEFAULT_ASSETS = [
    {
      id: uuidv4(),
      decimal: 18,
      balance: '0',
      formattedBalance: '0',
      // name: 'Ethereum',
      // symbol: 'ETH',
    },
  ];
}
