type ENV = {
  REACT_APP_TARGET_NETWORK: number;
  REACT_APP_TARGET_NETWORK_MSG?: string;
  REACT_APP_API_URL: string;
};

const development: ENV = {
  REACT_APP_TARGET_NETWORK: 80001, // mumbai
  REACT_APP_TARGET_NETWORK_MSG: '',
  REACT_APP_API_URL: 'http://127.0.0.1:5001',
};

const staging: ENV = {
  REACT_APP_TARGET_NETWORK: 80001, // mumbai
  REACT_APP_TARGET_NETWORK_MSG: '',
  REACT_APP_API_URL: 'http://127.0.0.1:5001',
};

const production: ENV = {
  REACT_APP_TARGET_NETWORK: 137, // mainnet
  REACT_APP_TARGET_NETWORK_MSG: '',
  REACT_APP_API_URL: 'http://127.0.0.1:5001',
};

const env =
  process.env.REACT_APP_PHASE === 'staging'
    ? staging
    : process.env.REACT_APP_PHASE === 'production'
    ? production
    : development;

export default env;
