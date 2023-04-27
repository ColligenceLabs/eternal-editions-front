// import {contractAddress} from "~/api/queries";
// import abi from "~/lib/tokenContractAbi";
import EventEmitter from 'eventemitter3';
import { WALLET_METAMASK } from 'src/config';

// utils
import axios from '../../utils/axios';
import { axiosHeader, handleSignMessage } from '../../utils/wallet';

export class WalletMetamask extends EventEmitter {
  publicKey: string | undefined;
  accessToken: string | undefined;
  axiosHeaders: object | undefined;
  connected: boolean | false;
  type: string;

  constructor() {
    super();

    this.publicKey = '';
    this.type = WALLET_METAMASK;
    this.connected = false;
  }

  async connect() {
    console.log('Metamask connect()');
    const { ethereum } = window;

    if (ethereum) {
      try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];

        // console.log(this.publicKey, 'this.publicKey')

        // Check if user is registered, if not, register them
        // const isRegistered = await this.checkIfUserRegistered(account);
        // console.log('isRegistered : ' + isRegistered);

        // Request nonce from backend
        // const responseNonce = await axios.get('/api/v1/web3/account/' + account + '/nonce')
        // const nonce = responseNonce.data;

        // Sign message
        // const signedMessage = await handleSignMessage(account, nonce)
        // console.log(signedMessage, 'signedMessage');

        // Send signature to backend
        // const responseSign = await axios.post('/api/v1/web3/account/' + account + '/signature', signedMessage)
        // this.accessToken = responseSign.data.access_token;
        // this.axiosHeaders = axiosHeader(this.accessToken);

        this.publicKey = account ?? '';
        this.connected = this.publicKey !== undefined;
        this.emit('update');
      } catch (e) {
        console.error(e);
      }
    } else {
      alert('메타마스크 지갑이 설치 되지 않았습니다');
    }
  }

  disconnect() {
    this.publicKey = undefined;
    this.accessToken = undefined;
  }

  async sendTransaction(transaction: any, successCallback: () => void) {
    // const transaction = {
    //   type: 'SMART_CONTRACT_EXECUTION',
    //   from: klaytn.selectedAddress,
    //   to: lastContract_v15,
    //   data,
    //   value: this.caver.utils.toPeb(price * count, 'KLAY'),
    //   gas: 500000,
    // };

    try {
      // const transactionHash = await this.caver.klay
      //     .sendTransaction(transaction)
      //     .once('transactionHash', (transactionHash) => {
      //         console.log('txHash', transactionHash)
      //     })
      //     .once('receipt', (receipt) => {
      //         console.log('receipt', receipt)
      //     })
      //     .once('error', (error) => {
      //         console.log('error', error)
      //     })

      successCallback();
    } catch (e) {
      console.error(e);
    }

    // return transactionHash;
  }

  cancelRequest() {}

  async checkIfUserRegistered(address: string) {
    const response = await axios.get('/api/v1/web3/account/' + address);
    console.log(response, 'response');
    // Handle response
    if (response.data.result) {
      return true;
    } else {
      return this.registerUser(address);
    }
  }

  async registerUser(address: string) {
    const response = await axios.post('/api/v1/web3/account', {
      address: address,
      type: 'METAMASK',
    });
    console.log('Register user response: ' + response);
  }
}

//
// const emitter = new EventEmitter();
//
// export default function WalletKaikas() {
//     let publicKey = '';
//     let connected = false;
//     let caver = null;
//     let requestKey = null;
//     let message = null;
//
//     const connect = () => {
//         console.log("WalletKaikas connect");
//         if (typeof window.ethereum !== 'undefined') {
//             console.log(window.ethereum, 'window.ethereum')
//             ethereum.request({method: 'eth_requestAccounts'}).then(accounts => {
//                 const account = accounts[0];
//                 publicKey = account;
//             });
//         }
//     }
//
//     const disconnect = () => {
//
//     }
//
//     const cancelRequest = () => {
//
//     }
//
//     const sendTransaction = (transaction, successCallback) => {
//
//     }
//
//     return {
//         publicKey: '',
//         connected: false,
//         caver: null,
//         requestKey: null,
//         message: null,
//
//         connect: connect,
//         sendTransaction: sendTransaction,
//         disconnect: disconnect,
//         cancelRequest: cancelRequest
//     }
// }
