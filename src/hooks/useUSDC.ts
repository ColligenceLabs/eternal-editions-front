import { useEffect, useState } from 'react';
import { getErc20BalanceNoSigner } from 'src/utils/transactions';
import contracts from 'src/config/constants/contracts';
import useAccount from 'src/hooks/useAccount';
import useActiveWeb3React from 'src/hooks/useActiveWeb3React';

export default function useUSDC() {
  const { chainId } = useActiveWeb3React();
  const { account } = useAccount();
  const [usdcBalance, setUsdcBalance] = useState('0');

  const fetchUsdcBalance = async () => {
    const ret = await getErc20BalanceNoSigner(contracts.usdc[chainId], 6, account, chainId);
    setUsdcBalance(ret.substring(0, ret.indexOf('.') + 5));
    console.log(ret);
  };

  useEffect(() => {
    if (account) {
      fetchUsdcBalance();
    }
  }, [account]);

  return { usdcBalance, fetchUsdcBalance };
}
