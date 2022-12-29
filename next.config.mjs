// ----------------------------------------------------------------------

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // trailingSlash: true,
  assetPrefix: '.',
  env: {
    DEV_API: 'https://dev.nftapi.eternaleditions.io',
    PRODUCTION_API: 'https://dev.nftapi.eternaleditions.io',
    GOOGLE_API: '',
  },
  images: {
    domains: ['flagcdn.com'],
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
