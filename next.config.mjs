// ----------------------------------------------------------------------

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // trailingSlash: true,
  assetPrefix: '.',
  env: {
    DEV_API: 'https://dev.nftapi.eternaleditions.io',
    PRODUCTION_API: 'https://zone-assets-api.vercel.app',
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
