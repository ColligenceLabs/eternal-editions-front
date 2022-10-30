import Caver from 'caver-js';
// import {contractAddress} from "~/api/queries";
// import abi from "~/lib/tokenContractAbi";
import EventEmitter from "eventemitter3";
import {WALLET_KLIP} from "../../config";
import axios from "axios";

export class WalletKlip extends EventEmitter {
    publicKey;
    connected;
    type;
    caver;
    contract;

    constructor() {
        super();

        this.publicKey = '';
        this.type = WALLET_KLIP;
        this.connected = false;
    }

    async intervalFunc(oldRequestKey, successCallback) {
        if (!this.requestKey) return;
        if (this.requestKey !== oldRequestKey) return;

        try {
            const resultUrl = `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${this.requestKey}`;
            const status = await axios.get(resultUrl)

            // 대기중
            // 성공
            // 실패
            if (status?.data?.status === 'completed' && status?.data?.result) {
                this.publicKey = status?.data?.result?.klaytn_address ?? '';
                this.requestKey = '';

                if (successCallback) {
                    successCallback();
                }
                this.emit('update');
                return;
            }

            if (status?.data?.status === 'requested' && status?.data?.result) {
                this.requestKey = '';

                if (successCallback) {
                    setTimeout(() => {
                        successCallback();
                    }, 2000);
                }
                this.emit('update');
                return;
            }

            if (status?.data?.status !== 'prepared') {
                this.requestKey = '';
                this.emit('update');
                return;
            }
        } catch (e) {
            console.error(e);
            this.publicKey = '';
            this.requestKey = '';
            this.emit('update');
            return;
        }

        setTimeout(this.intervalFunc.bind(this, oldRequestKey, successCallback), 1000);
    }

    async connect() {
        console.log('KLIP connect()');
        const res = await axios.post(
            'https://a2a-api.klipwallet.com/v2/a2a/prepare',
            {
                bapp: {
                    name: 'NFT Visualization'
                },
                type: 'auth'
            }
        );

        const prepareResponse = res.data;

        const requestKey = prepareResponse.request_key
        this.requestKey = requestKey;
        this.message = 'Connect Klip';
        this.emit('update');
        setTimeout(this.intervalFunc.bind(this, requestKey), 1000);
    }

    disconnect() {
        this.requestKey = '';
        this.message = '';
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

        // try {
        //     const transactionHash = await this.caver.klay
        //         .sendTransaction(transaction)
        //         .once('transactionHash', (transactionHash) => {
        //             console.log('txHash', transactionHash)
        //         })
        //         .once('receipt', (receipt) => {
        //             console.log('receipt', receipt)
        //         })
        //         .once('error', (error) => {
        //             console.log('error', error)
        //         })
        //
        //     successCallback();
        // } catch (e) {
        //     console.error(e);
        // }

        // return transactionHash;
    }

    cancelRequest() {
        this.requestKey = '';
        this.message = '';
        this.emit('update');
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