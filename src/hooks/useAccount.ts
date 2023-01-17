import useActiveWeb3React from './useActiveWeb3React';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function useAccount() {
  const { account: walletAccount } = useActiveWeb3React();
  const abcAccount = useSelector((state: any) => state.user);
  const [account, setAccount] = useState<string | null | undefined>(null);
  const loginBy = window.localStorage.getItem('loginBy');

  useEffect(() => {
    if (loginBy === 'sns') {
      if (abcAccount && abcAccount.accounts && abcAccount.accounts.length > 0) {
        setAccount(abcAccount.accounts[0].ethAddress);
      }
    } else if (loginBy === 'wallet') {
      if (walletAccount) {
        setAccount(walletAccount);
      }
    } else {
      setAccount(null);
    }
  }, [walletAccount, abcAccount, loginBy]);

  return { account };
}
