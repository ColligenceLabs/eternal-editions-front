import { useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';

// ----------------------------------------------------------------------

const useWallets = () => useContext(WalletContext);

export default useWallets;
