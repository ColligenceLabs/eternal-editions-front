import Caver from 'caver-js';
// import {contractAddress} from "~/api/queries";
// import abi from "~/lib/tokenContractAbi";
import EventEmitter from 'eventemitter3';
import { WALLET_KAIKAS } from 'src/config';

export class WalletKaikas extends EventEmitter {
  publicKey;
  connected;
  type;
  caver;
  contract;

  constructor() {
    super();

    this.publicKey = '';
    this.type = WALLET_KAIKAS;
    this.connected = false;
  }

  async connect() {
    console.log('KAIKAS connect()');
    const { klaytn } = window;

    if (klaytn) {
      try {
        await klaytn.enable();
        this.caver = new Caver(klaytn);

        this.publicKey = klaytn.selectedAddress ?? '';
        // this.contract = new this.caver.klay.Contract(abi, contractAddress);

        klaytn.once('accountsChanged', () => {
          this.publicKey = klaytn.selectedAddress ?? '';
          this.emit('update');
        });

        this.emit('update');
      } catch (e) {
        console.error(e);
      }
    } else {
      alert('카이카스 지갑이 설치 되지 않았습니다');
    }
  }

  disconnect() {
    this.publicKey = '';
  }

  async sendTransaction(transaction, successCallback) {
    // const transaction = {
    //   type: 'SMART_CONTRACT_EXECUTION',
    //   from: klaytn.selectedAddress,
    //   to: lastContract_v15,
    //   data,
    //   value: this.caver.utils.toPeb(price * count, 'KLAY'),
    //   gas: 500000,
    // };

    try {
      const transactionHash = await this.caver.klay
        .sendTransaction(transaction)
        .once('transactionHash', (transactionHash) => {
          console.log('txHash', transactionHash);
        })
        .once('receipt', (receipt) => {
          console.log('receipt', receipt);
        })
        .once('error', (error) => {
          console.log('error', error);
        });

      successCallback();
    } catch (e) {
      console.error(e);
    }

    // return transactionHash;
  }

  cancelRequest() {}
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
