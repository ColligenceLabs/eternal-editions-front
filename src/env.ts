type ENV = {
  REACT_APP_TARGET_NETWORK: number;
  REACT_APP_TARGET_NETWORK_MSG?: string;
  REACT_APP_API_URL: string;
  MPC_PROTOCOL: string;
  APP_SERVER_ADDRESS: string;
};

const development: ENV = {
  REACT_APP_TARGET_NETWORK: 80001, // mumbai
  REACT_APP_TARGET_NETWORK_MSG: '',
  REACT_APP_API_URL: 'https://dev.nftapi.eternaleditions.io/',
  MPC_PROTOCOL: 'wss',
  APP_SERVER_ADDRESS: 'cs.mw.myabcwallet.com:9000',
};

const staging: ENV = {
  REACT_APP_TARGET_NETWORK: 80001, // mumbai
  REACT_APP_TARGET_NETWORK_MSG: '',
  REACT_APP_API_URL: 'http://localhost:5001',
  MPC_PROTOCOL: 'wss',
  APP_SERVER_ADDRESS: 'cs.mw.myabcwallet.com:9000',
};

const production: ENV = {
  REACT_APP_TARGET_NETWORK: 137, // mainnet
  REACT_APP_TARGET_NETWORK_MSG: '',
  REACT_APP_API_URL: 'http://localhost:5001',
  MPC_PROTOCOL: 'wss',
  APP_SERVER_ADDRESS: 'cs.mw.myabcwallet.com:9000',
};

const env =
  process.env.REACT_APP_PHASE === 'staging'
    ? staging
    : process.env.REACT_APP_PHASE === 'production'
    ? production
    : development;

export default env;
