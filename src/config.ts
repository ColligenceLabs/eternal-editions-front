// @type
import { SettingsValueProps } from './@types/settings';
import env from './env';

// API
// ----------------------------------------------------------------------

export const HOST_API = {
  dev: process.env.DEV_API,
  production: process.env.PRODUCTION_API,
};

export const GOOGLE_API = process.env.GOOGLE_API;

// MARKDOWN FILE DIRECTORY
// ----------------------------------------------------------------------

export const CAREER_POSTS_DIRECTORY = '_data/blog-posts/career';
export const ELEARNING_POSTS_DIRECTORY = '_data/blog-posts/e-learning';
export const TRAVEL_POSTS_DIRECTORY = '_data/blog-posts/travel';
export const MARKETING_POSTS_DIRECTORY = '_data/blog-posts/marketing';
export const CASE_STUDIES_DIRECTORY = '_data/case-studies';
export const COMPONENTS_DIRECTORY = '_data/components';

// DEFAULT LOCALE
// ----------------------------------------------------------------------
// Also change in next.config.mjs

export const defaultLocale = 'en';

// SETTINGS
// ----------------------------------------------------------------------

export const defaultSettings = {
  // light | dark
  themeMode: 'dark',
  // ltr | rtl
  themeDirection: 'ltr',
  //  default | blueOrange | greenOrange | purpleTeal | cyanYellow | pinkCyan
  themeColorPresets: 'default',
} as SettingsValueProps;

// LAYOUT
// ----------------------------------------------------------------------

export const HEADER_MOBILE_HEIGHT = 64;
export const HEADER_DESKTOP_HEIGHT = 96;
export const DRAWER_WIDTH = 280;

// WEB3
// ----------------------------------------------------------------------

export const WALLET_WALLECTCONNECT = 'WALLETCONNECT';
export const WALLET_COINBASE = 'COINBASE';
export const WALLET_METAMASK = 'METAMASK';
export const WALLET_KAIKAS = 'KAIKAS';
export const WALLET_KLIP = 'KLIP';

export const ChainId = {
  POLYGON: 137,
  MUMBAI: 80001,
};

export const RPC_URLS = {
  [ChainId.POLYGON]: 'https://polygon-rpc.com',
  [ChainId.MUMBAI]: 'https://rpc-mumbai.maticvigil.com',
};

// export const IPFS_URL = 'https://ipfs.io/ipfs/';
// export const ALT_URL = env.REACT_APP_ALT_URL;
export const SUCCESS = 1;
export const FAILURE = 0;
//
// export const targetNetwork = env.REACT_APP_TARGET_NETWORK_KLAY;
export const targetNetworkMsg = env.REACT_APP_TARGET_NETWORK_MSG;

export const NETWORK_NAME = {
  [ChainId.POLYGON]: 'Polygon',
  [ChainId.MUMBAI]: 'Mumbai',
};

export const SCAN_URL = {
  [ChainId.POLYGON]: 'https://polygonscan.com/',
  [ChainId.MUMBAI]: 'https://mumbai.polygonscan.com/',
};

export const targetNetwork = ChainId.MUMBAI;
