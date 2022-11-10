import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

import { injected, walletconnect } from './connectors';
import env from '../env';
import { setupNetwork } from '../utils/network';
import { WALLET_METAMASK, WALLET_WALLECTCONNECT } from '../config';

export function useEagerConnect() {
  const { activate, active } = useWeb3React();
  const [tried, setTried] = useState(false);

  useEffect(() => {
    const walletStatus = window.localStorage.getItem('walletStatus') ?? 'disconnected';
    const connectorId = window.localStorage.getItem('wallet') ?? 'injected';

    if (walletStatus === 'connected') {
      if (!connectorId || connectorId === WALLET_METAMASK) {
        injected.isAuthorized().then(async (isAuthorized: boolean) => {
          if (isAuthorized) {
            await setupNetwork(env.REACT_APP_TARGET_NETWORK ?? 80001);

            activate(injected, undefined, true).catch(() => {
              setTried(true);
            });
          } else {
            console.log('@@@@@@@@@@@@@@@@@@@');
            setTried(true);
          }
        });
      }
      if (!connectorId || connectorId === WALLET_WALLECTCONNECT) {
        const wc = walletconnect(false);
        activate(wc);
      }
    }
  }, []); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}

export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3React();

  useEffect((): any => {
    const { ethereum } = window as any;
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        console.log('Handling "connect" event');
        activate(injected);
      };
      const handleChainChanged = (chainId: string | number) => {
        console.log('Handling "chainChanged" event with payload', chainId);
        activate(injected);
      };
      const handleAccountsChanged = (accounts: string[]) => {
        console.log('Handling "accountsChanged" event with payload', accounts);
        if (accounts.length > 0) {
          activate(injected);
        }
      };
      const handleNetworkChanged = (networkId: string | number) => {
        console.log('Handling "networkChanged" event with payload', networkId);
        activate(injected);
      };

      ethereum.on('connect', handleConnect);
      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('networkChanged', handleNetworkChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', handleConnect);
          ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          ethereum.removeListener('networkChanged', handleNetworkChanged);
        }
      };
    }
  }, [active, error, suppress, activate]);
}
