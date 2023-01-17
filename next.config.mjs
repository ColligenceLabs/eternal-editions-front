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
    APP_SERVER_ADDRESS: 'cs-gateway.abcsktcolab.link:9000',
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
