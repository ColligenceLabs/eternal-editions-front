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
};
