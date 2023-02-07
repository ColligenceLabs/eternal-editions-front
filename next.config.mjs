// ----------------------------------------------------------------------

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: true,
  assetPrefix: '/',
  env: {
    DEV_API: 'https://dev.nftapi.eternaleditions.io',
    PRODUCTION_API: 'https://dev.nftapi.eternaleditions.io',
    GOOGLE_API: '',
    // ABC Wallet
    // APP_SERVER_ADDRESS: 'cs.mw.myabcwallet.com:9000',
    // APP_SERVER_ADDRESS_PROTOCOL: 'https',
    APP_SERVER_ADDRESS: 'cs.dev-mw.myabcwallet.com:9000',
    APP_SERVER_ADDRESS_PROTOCOL: 'https',
    MPC_PROTOCOL: 'wss',
    SELENIUM_BROWSER: 'chrome',
    DETECT_TOKEN_PERIOD: '180000',
    INFURA_ID: '74b90148609e4064a6990fab0a79ae9a',
    ALCHEMY_ID: 'y02b5fstsuCe3D7exATm-bJvJWycDJ_1',
    KLAYTN_API_USERNAME: 'KASK1RHT36TU1QPAV7TAPVVE',
    KLAYTN_API_PASSWORD: 'j3Bbv4Y-qUJrLZzzBGjAuyQp_sGx2dYygpXRJKwF',
    KLAYTN_AUTH_TOKEN: 'S0FTSzFSSFQzNlRVMVFQQVY3VEFQVlZFOmozQmJ2NFktcVVKckxaenpCR2pBdXlRcF9zR3gyZFl5Z3BYUkpLd0Y=',
    ETHERSCAN_API_KEY: '4GV13Q5P8R3C6WMYBCRK5BX63IY2Q6EMJD',
    BSCSCAN_API_KEY: 'GQIP1KHUW3Y3VQFP2Z88VS98CQ6GVU7BK3',
    POLIGONSCAN_API_KEY: 'DKBA6NPBY6MTH3J1FD4KHWIV4TYJDMX5IS',
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
    ACCESS_TOKEN_NAME: 'tx-access-token'
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
