// ----------------------------------------------------------------------
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: true,
  assetPrefix: '/',
  env: {
    GOOGLE_API: '',
    // ABC Wallet
    SELENIUM_BROWSER: 'chrome',
    DETECT_TOKEN_PERIOD: '180000',
    INFURA_ID: process.env.INFURA_ID,
    ALCHEMY_ID: process.env.ALCHEMY_ID,
    KLAYTN_API_USERNAME: process.env.KLAYTN_API_USERNAME,
    KLAYTN_API_PASSWORD: process.env.KLAYTN_API_PASSWORD,
    KLAYTN_AUTH_TOKEN: process.env.KLAYTN_API_PASSWORD,
    ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
    BSCSCAN_API_KEY: process.env.BSCSCAN_API_KEY,
    POLIGONSCAN_API_KEY: process.env.POLIGONSCAN_API_KEY,
    ABC_SERVICE_ID: 'https://mw.myabcwallet.com',
    SENTRY_DSN: 'https://33738b9d7e4f432b919d7d03412bbe34@o1346368.ingest.sentry.io/6624178',
    ISS: 'abc',
    SECURE_LOCAL_STORAGE_HASH_KEY: process.env.SECURE_LOCAL_STORAGE_HASH_KEY,

    API_SERVER_ADDRESS: 'https://api.eternaleditions.io',
    // API_SERVER_ADDRESS: 'https://api.dev.eternaleditions.io',
    // API_SERVER_ADDRESS: 'http://localhost:8187',
    // API_SERVER_ADDRESS: 'http://api.test10.tickets-x.com', // test address
    // API_SERVER_ADDRESS: 'https://dsvm4mn1pb.execute-api.ap-northeast-2.amazonaws.com/prod', // vue-oauth2-code.js 테스트를 위한 API 서버 주소
    // API_CLIENT_ADDRESS: 'http://localhost:15000',
    // API_CLIENT_ADDRESS: 'http://192.168.100.68:15000', // naver 간편로그인 테스트
    // API_CLIENT_ADDRESS: 'http://test10.tickets-x.com',
    API_CLIENT_ADDRESS: 'https://market.eternaleditions.io',
    REMEMBER_ID_NAME: 'tx-remember-id',
    ACCESS_TOKEN_NAME: 'tx-access-token',
    CONDUIT_KEYS_TO_CONDUIT: process.env.CONDUIT_KEYS_TO_CONDUIT,
    CROSS_CHAIN_DEFAULT_CONDUIT_KEY:
    process.env.CROSS_CHAIN_DEFAULT_CONDUIT_KEY,
    TREASURY: process.env.TREASURY,
    CREATOR_FEE: process.env.CREATOR_FEE,
    TRADING_FEE: process.env.TRADING_FEE,
  },
  images: {
    domains: ['flagcdn.com'],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      crypto: false,
      fs: false,
      http: false,
      https: false,
      stream: false,
    };

    return config;
  },
};

export default nextConfig;
