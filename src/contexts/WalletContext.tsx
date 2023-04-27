import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';

// import {ethers} from 'ethers';
// import abi from '../lib/tokenContractAbi';
// import {contractAddress} from "~/api/queries";
import { WalletMetamask } from './wallet/WalletMetamask';
import PropTypes from 'prop-types';

import { defaultSettings } from 'src/config';
import { getShotAddress } from 'src/utils/wallet';

const initialState: any = {
  ...defaultSettings,
  accessToken: '',
  axiosHeaders: {},
  account: '',
  accountShot: '',
  type: '',
  connected: false,
  requestKey: '',
  message: '',

  connectMetamask: () => {},

  disconnect: () => {},
  cancelRequest: () => {},

  // buyBoxNFT(price: number, count: number, successCallback: ()=>void): Promise<void>;
  // unbox(tokenId: number, successCallback: ()=>void): Promise<void>;
  // claim(tokenId: number, claimId: string, successCallback: ()=>void): Promise<void>;
};

const WalletContext = createContext(initialState);

WalletProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const walletMetamask = new WalletMetamask();

type Props = {
  children: ReactNode;
};

function WalletProvider({ children }: Props) {
  const [wallet, setWallet] = useState(initialState);

  // 컴포넌트 업데이트 하기위해 임시로 만듬
  const [id, setID] = useState(0);
  useEffect(() => {
    const updateComponent = () => {
      const temp = id + Math.random();
      setID(temp);
    };

    walletMetamask.on('update', updateComponent);
  }, []);

  const connectMetamask = useCallback(async () => {
    console.log('connectMetamask');
    wallet?.disconnect();

    await walletMetamask.connect();
    setWallet(walletMetamask);
  }, [wallet]);

  const disconnect = useCallback(async () => {
    console.log('disconnect');
    wallet?.disconnect();

    setWallet(null);
  }, [wallet]);

  const cancelRequest = useCallback(async () => {
    console.log('cancelRequest');
    wallet?.cancelRequest();
  }, [wallet]);

  // const buyBoxNFT = useCallback(async (price: number, count: number, successCallback: ()=>void) => {
  //     if (wallet) {
  //         const buyBoxNFT = abi.find(val => val.name === 'buyBoxNFT')
  //         const data = emptyCaver.klay.abi.encodeFunctionCall(buyBoxNFT, [count]);
  //
  //         let transaction = null;
  //         if (wallet === walletKaikas) {
  //             transaction = {
  //                 type: 'SMART_CONTRACT_EXECUTION',
  //                 from: wallet.publicKey,
  //                 to: contractAddress,
  //                 abi: buyBoxNFT,
  //                 data,
  //                 value: emptyCaver.utils.toPeb(price * count, 'KLAY'),
  //                 gas: 500000 * count,
  //             };
  //         } else {
  //             transaction = {
  //                 to: contractAddress,
  //                 value: Caver.utils.toPeb(price * count, 'KLAY'),
  //                 abi: JSON.stringify(buyBoxNFT),
  //                 params: `[${count}]`,
  //             }
  //         }
  //
  //         await wallet.sendTransaction(transaction, successCallback);
  //     }
  // }, [wallet]);

  // const unbox = useCallback(async (tokenId: number, successCallback: ()=>void) => {
  //     if (wallet) {
  //         const unbox = abi.find(val => val.name === 'unbox')
  //         const data = emptyCaver.klay.abi.encodeFunctionCall(unbox, [tokenId]);
  //
  //         let transaction = null;
  //         if (wallet === walletKaikas) {
  //             transaction = {
  //                 type: 'SMART_CONTRACT_EXECUTION',
  //                 from: wallet.publicKey,
  //                 to: contractAddress,
  //                 abi: unbox,
  //                 data,
  //                 gas: 500000,
  //             };
  //         } else {
  //             transaction = {
  //                 to: contractAddress,
  //                 value: Caver.utils.toPeb('0', 'KLAY'),
  //                 abi: JSON.stringify(unbox),
  //                 params: `[${tokenId}]`,
  //             }
  //         }
  //
  //         await wallet.sendTransaction(transaction, successCallback);
  //     }
  // }, [wallet]);

  // const claim = useCallback(async (tokenId: number, claimId: string, successCallback: ()=>void) => {
  //     if (wallet) {
  //         const claim = abi.find(val => val.name === 'claim')
  //
  //         let transaction = null;
  //         if (wallet === walletKaikas) {
  //             const data = emptyCaver.klay.abi.encodeFunctionCall(claim, [tokenId,
  //                 ethers.utils.formatBytes32String(claimId)
  //             ]);
  //
  //             transaction = {
  //                 type: 'SMART_CONTRACT_EXECUTION',
  //                 from: wallet.publicKey,
  //                 to: contractAddress,
  //                 abi: claim,
  //                 data,
  //                 gas: 500000,
  //             };
  //         } else {
  //             transaction = {
  //                 to: contractAddress,
  //                 value: Caver.utils.toPeb('0', 'KLAY'),
  //                 abi: JSON.stringify(claim),
  //                 params: `[${tokenId}, "${ethers.utils.formatBytes32String(claimId)}"]`,
  //             }
  //         }
  //
  //         await wallet.sendTransaction(transaction, successCallback);
  //     }
  // }, [wallet]);

  return (
    <WalletContext.Provider
      value={{
        accessToken: wallet?.accessToken ?? '',
        axiosHeaders: wallet?.axiosHeaders ?? {},
        account: wallet?.publicKey ?? '',
        accountShot: wallet?.publicKey ? getShotAddress(wallet?.publicKey) : '',
        type: wallet?.type ?? '',
        connected: wallet?.connected ?? false,
        requestKey: wallet?.requestKey ?? '',
        message: wallet?.message ?? '',

        connectMetamask,
        disconnect,
        cancelRequest,

        // buyBoxNFT,
        // unbox,
        // claim,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export { WalletProvider, WalletContext };
