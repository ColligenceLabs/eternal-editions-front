import { useEffect, useState } from 'react';
import { BigNumber, ethers, utils } from 'ethers';
import getSelectedNodeUrl from './getRpcUrl';
import env from '../env';

const getBalances = (account: string | undefined | null, library: any) => {
  const [baseBalance, setBaseBalance] = useState(0);
  const [time, setTime] = useState(new Date());

  // NoSigner Provider
  const chainId = env.REACT_APP_TARGET_NETWORK;

  useEffect(() => {
    setInterval(() => setTime(new Date()), 30000);
  }, []);

  useEffect(() => {
    try {
      if (!!account ) {
        const provider = ethers.getDefaultProvider(getSelectedNodeUrl(chainId));

        provider
          .getBalance(account)
          .then((balance: BigNumber) => {
            setBaseBalance(parseFloat(utils.formatEther(balance)));
          })
          .catch((e) => console.log(e));
      }
    } catch (error) {
      console.log(error);
    }
  }, [account, chainId, time]);

  return baseBalance;
};

export default getBalances;
