import { ChainId } from '../../config';

export default {
  matic: {
    [ChainId.POLYGON]: '0x0000000000000000000000000000000000000000',
    [ChainId.MUMBAI]: '0x0000000000000000000000000000000000000000',
  },
  wmatic: {
    [ChainId.POLYGON]: '',
    [ChainId.MUMBAI]: '',
  },
  witnet: {
    [ChainId.POLYGON]: '',
    [ChainId.MUMBAI]: '',
  },
  usdt: {
    [ChainId.POLYGON]: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    [ChainId.MUMBAI]: '0xab482a006d312d6796277d539FE87609065a2B93',
  },
  usdc: {
    [ChainId.POLYGON]: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    [ChainId.MUMBAI]: '0xCA6e89Be8c0033eBac09826d4c632af86F379CdA',
  },
};
