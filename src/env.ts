type ENV = {
  REACT_APP_TARGET_NETWORK: number;
  REACT_APP_TARGET_NETWORK_MSG?: string;
  REACT_APP_API_URL: string;
  MPC_PROTOCOL: string;
  APP_SERVER_ADDRESS: string;
  KSPAY_STORE_ID: string;
  APP_SERVER_ADDRESS_PROTOCOL: string;
  ABC_SERVER_ADDRESS: string;
  PAYPAL_CLIENT_ID: string;
  CONDUIT_KEYS_TO_CONDUIT: string;
  CROSS_CHAIN_DEFAULT_CONDUIT_KEY: string;
  TREASURY?: string;
  CREATOR_FEE: number;
  TRADING_FEE: number;
};

const development: ENV = {
  REACT_APP_TARGET_NETWORK: 80001, // mumbai
  REACT_APP_TARGET_NETWORK_MSG: '',
  REACT_APP_API_URL: 'http://localhost:5001',
  MPC_PROTOCOL: 'wss',
  APP_SERVER_ADDRESS_PROTOCOL: 'https',
  APP_SERVER_ADDRESS: 'cs.dev-mw.myabcwallet.com:9000',
  ABC_SERVER_ADDRESS: 'dev-api.id.myabcwallet.com',
  KSPAY_STORE_ID: '2999199999',
  PAYPAL_CLIENT_ID:
      'AV5hU4TbGl7mLklHuzp2Zv5m47PwKDyKOmVKigLWl9CP9weg1S9GbCHaVbQaKCThJaWpHYwNweQYPTek',
  CONDUIT_KEYS_TO_CONDUIT: process.env.CONDUIT_KEYS_TO_CONDUIT ?? '',
  CROSS_CHAIN_DEFAULT_CONDUIT_KEY:
      process.env.CROSS_CHAIN_DEFAULT_CONDUIT_KEY ?? '',
  TREASURY: process.env.TREASURY,
  CREATOR_FEE: parseInt(process.env.REATOR_FEE ?? '0'),
  TRADING_FEE: parseInt(process.env.TRADING_FEE ?? '0'),
};

const staging: ENV = {
  REACT_APP_TARGET_NETWORK: 80001, // mumbai
  REACT_APP_TARGET_NETWORK_MSG: '',
  REACT_APP_API_URL: 'https://dev.nftapi.eternaleditions.io',
  MPC_PROTOCOL: 'wss',
  APP_SERVER_ADDRESS_PROTOCOL: 'https',
  APP_SERVER_ADDRESS: 'cs.dev-mw.myabcwallet.com:9000',
  ABC_SERVER_ADDRESS: 'dev-api.id.myabcwallet.com',
  KSPAY_STORE_ID: '2999199999',
  PAYPAL_CLIENT_ID:
      'AV5hU4TbGl7mLklHuzp2Zv5m47PwKDyKOmVKigLWl9CP9weg1S9GbCHaVbQaKCThJaWpHYwNweQYPTek',
  CONDUIT_KEYS_TO_CONDUIT: process.env.CONDUIT_KEYS_TO_CONDUIT ?? '',
  CROSS_CHAIN_DEFAULT_CONDUIT_KEY:
      process.env.CROSS_CHAIN_DEFAULT_CONDUIT_KEY ?? '',
  TREASURY: process.env.TREASURY,
  CREATOR_FEE: parseInt(process.env.CREATOR_FEE ?? '0'),
  TRADING_FEE: parseInt(process.env.TRADING_FEE ?? '0'),
};

const production: ENV = {
  REACT_APP_TARGET_NETWORK: 137, // mainnet
  REACT_APP_TARGET_NETWORK_MSG: '',
  REACT_APP_API_URL: 'https://nftapi.eternaleditions.io',
  MPC_PROTOCOL: 'wss',
  APP_SERVER_ADDRESS_PROTOCOL: 'https',
  APP_SERVER_ADDRESS: 'cs.mw.myabcwallet.com:9000',
  ABC_SERVER_ADDRESS: 'api.id.myabcwallet.com',
  KSPAY_STORE_ID: '2034700002',
  PAYPAL_CLIENT_ID:
      'AcWHLL4-YeK_CtZyYmJni1zLTK7cxVU56m-bfI909cBP4wm1si5ZSEeBl8OhOOiYsuZlG-lc1nnCFtdN',
  CONDUIT_KEYS_TO_CONDUIT: process.env.CONDUIT_KEYS_TO_CONDUIT ?? '',
  CROSS_CHAIN_DEFAULT_CONDUIT_KEY:
      process.env.CROSS_CHAIN_DEFAULT_CONDUIT_KEY ?? '',
  TREASURY: process.env.TREASURY,
  CREATOR_FEE: parseInt(process.env.CREATOR_FEE ?? '0'),
  TRADING_FEE: parseInt(process.env.TRADING_FEE ?? '0'),
};

const env =
    process.env.NEXT_PUBLIC_APP_PHASE === 'staging'
        ? staging
        : process.env.NEXT_PUBLIC_APP_PHASE === 'production'
            ? production
            : development;

export default env;
