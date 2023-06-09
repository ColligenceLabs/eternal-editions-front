import useActiveWeb3React from './useActiveWeb3React';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getSession, getUser } from 'src/services/services';
import useAccount from 'src/hooks/useAccount';

export default function useEDCP() {
  const account = useAccount();
  const [edcpPoint, setEdcpPoint] = useState(0);
  const fetchPoint = async () => {
    const res = await getUser();
    if (res.data.user) setEdcpPoint(res.data.user.point);
  };

  useEffect(() => {
    if (account) fetchPoint();
  }, [account]);

  return { edcpPoint };
}
