import { InjectedConnector } from '@web3-react/injected-connector';
// import { InjectedConnector as KlaytnConnector } from 'klaytn-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { ChainId, RPC_URLS } from '../config';
import env from "../env";

export const injected = new InjectedConnector({
  supportedChainIds: [ChainId.POLYGON, ChainId.MUMBAI],
});

// export const kaikas = new KlaytnConnector({
//   supportedChainIds: [ChainId.TMP, ChainId.BAOBAB, ChainId.KLAYTN],
// });

export const walletconnect = (useQR: boolean) => {
  return new WalletConnectConnector({
    // supportedChainIds: [ChainId.POLYGON, ChainId.MUMBAI],
    rpc: {
      [env.REACT_APP_TARGET_NETWORK]: RPC_URLS[env.REACT_APP_TARGET_NETWORK],
    },
    bridge: 'https://bridge.walletconnect.org',
    qrcode: useQR,
  });
};
