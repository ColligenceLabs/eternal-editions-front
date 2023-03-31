import { SetStateAction } from 'react';
import { useWeb3React } from '@web3-react/core';
import Web3Token from 'web3-token';
import { checkKaikas } from '../utils/wallet';

const useCreateToken = () => {
  const { account, library } = useWeb3React();

  const createToken = async (setDoSign: SetStateAction<any>) => {
    localStorage.removeItem('jwtToken');
    if (library !== undefined) {
      const isKaikas = checkKaikas(library);

      try {
        let token;
        if (isKaikas) {
          // @ts-ignore : In case of Klaytn Kaikas Wallet
          const caver = new Caver(window.klaytn);
          // @ts-ignore TS2693: only refers to a type
          token = await Web3Token.sign(
            async (msg: string) => await caver.klay.sign(msg, account ?? ''),
            // TODO : 아래 함수로 처리가 되는 것이 맞으나... klaytn-connector애서 뭘 수정해야 하지?
            //        에러 = unknown account #0 (operation="getAddress", code=UNSUPPORTED_OPERATION
            // async () => await library.getSigner().signMessage(account),
            {
              domain: 'talken.io',
              expires_in: '1 days',
              statement: 'Talken Studio Sign In',
              wallet: 'kaikas',
            }
          );
        } else {
          // @ts-ignore TS2693: only refers to a type
          token = await Web3Token.sign(
            async (msg: string) => await library.getSigner().signMessage(msg),
            {
              domain: 'talken.io',
              expires_in: '1 days',
              statement: 'Talken Studio Sign In',
            }
          );
        }
        localStorage.setItem('jwtToken', token);
        setDoSign(true);
        return true;
      } catch (e) {
        console.log(e);
        return null;
      }
    }
  };
  return { createToken };
};

export default useCreateToken;
