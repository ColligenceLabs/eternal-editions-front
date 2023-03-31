/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import EventEmitter from 'events';
import Web3 from 'web3';
import { BigNumber, ethers } from 'ethers';
import EthQuery from 'ethjs-query';
import humanAbi from 'human-standard-token-abi';
import Caver from 'caver-js';
import { JsonRpcEngine } from 'json-rpc-engine';
import { providerFromEngine } from 'dekey-eth-json-rpc-middleware';
import { createSwappableProxy, createEventEmitterProxy } from 'swappable-obj-proxy';
import { createAlchemyWeb3 } from '@alch/alchemy-web3';

import { NetworkModel, TxModel } from '../../main/transactions/interface';
import { KIP_ABI } from '../../infra/rest-api/erc20';
import log from 'loglevel';
import createJsonRpcClient from '../../main/network/createJsonRpcClient';
// import {DekeyStore} from '../store';
import { isKlaytn } from '../../utils/network';
import { DekeyData } from '../../dekeyData';

export class ProviderConnectionManager extends EventEmitter {
  connection;
  query;
  ethQuery;
  ethersProvider: ethers.providers.Web3Provider;
  connected;
  web3;
  chainId;
  caver; // TODO: make caver instance
  _providerProxy;
  _blockTrackerProxy;
  _provider;
  _blockTracker;
  web3Alchemy;

  // constructor(private dekeyStore: DekeyStore) {
  constructor() {
    super();
  }

  initialize({ rpcUrl, chainId }) {
    log.info('initialize', { rpcUrl, chainId });
    const cResult = createJsonRpcClient({
      rpcUrl,
      chainId,
    });
    this._setNetworkClient(cResult);
  }

  _setNetworkClient({ networkMiddleware, blockTracker }) {
    const engine = new JsonRpcEngine();
    engine.push(networkMiddleware);
    const provider = providerFromEngine(engine);
    this._setProviderAndBlockTracker({ provider, blockTracker });
  }

  _setProviderAndBlockTracker({ provider, blockTracker }) {
    // update or intialize proxies
    if (this._providerProxy) {
      this._providerProxy.setTarget(provider);
    } else {
      this._providerProxy = createSwappableProxy(provider);
    }
    if (this._blockTrackerProxy) {
      this._blockTrackerProxy.setTarget(blockTracker);
    } else {
      this._blockTrackerProxy = createEventEmitterProxy(blockTracker, {
        eventFilter: 'skipInternal',
      });
    }
    // set new provider and blockTracker
    this._provider = provider;
    this._blockTracker = blockTracker;

    this._provider.supportsSubscriptions = () => false;
  }

  // return the proxies so the references will always be good
  getProviderAndBlockTracker() {
    const provider = this._providerProxy;
    const blockTracker = this._blockTrackerProxy;
    return { provider, blockTracker };
  }

  async connect(network: NetworkModel, accToken?: string) {
    try {
      const { chainId, rpcUrl, target, isCustom } = network;
      const rpcUrlWithNoTrailingSlash = rpcUrl.replace(/\/$/, '');

      let formattedRpcUrl: string;
      if (rpcUrl.includes('infura')) {
        formattedRpcUrl = rpcUrlWithNoTrailingSlash + `/${process.env.INFURA_ID}`;
      } else if (rpcUrl.includes('alchemy')) {
        formattedRpcUrl = rpcUrlWithNoTrailingSlash + `/${process.env.ALCHEMY_ID}`;
        this.web3Alchemy = createAlchemyWeb3(formattedRpcUrl);
      } else {
        formattedRpcUrl = rpcUrlWithNoTrailingSlash;
      }

      this.initialize({
        rpcUrl: formattedRpcUrl,
        chainId,
      });

      // this.connected = true;
      // this.connection = this.provider.connection;

      /** libraries to communicate with rpc node */
      this.web3 = new Web3(this._provider);
      this.ethersProvider = new ethers.providers.Web3Provider(this._provider);
      this.query = new EthQuery(this._provider);
      this.caver = new Caver(this._provider);
      this.chainId = network.chainId;

      // this.emit('connected', network);
    } catch (error) {
      throw error;
    }
  }

  // async connect(network: NetworkModel, accToken: string, handleBlockTracker) {
  //   if (this.connection) {
  //     await this.connection.close();
  //     this.connection.removeAllListeners();
  //   }

  //   if (this.provider) {
  //     this.provider.removeAllListeners();
  //   }

  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const {target, rpcUrl} = network;

  //       /** create ethProvider instance which connects to the given network */
  //       if (target === 'direct' && rpcUrl.includes('infura')) {
  //         const splitRpcUrl = rpcUrl.split('/');
  //         const infuraId = splitRpcUrl[splitRpcUrl.length - 1];
  //         this.provider = ethProvider(rpcUrl, {
  //           infuraId,
  //         });
  //       } else if (target === 'direct' && !rpcUrl.includes('infura')) {
  //         this.provider = ethProvider(rpcUrl);
  //       } else if (target === 'alchemy') {
  //         /** Ethereum mainnet rpcUrl from app server */
  //         const {ethMainnetUrl} = await txRestApi.getNodeUrl(accToken);
  //         this.provider = ethProvider(ethMainnetUrl);
  //       } else if (target.includes('alchemy')) {
  //         /** L2 networks which alchemy supports except optimistic */
  //         const rpcUrlWithNoTrailingSlash = rpcUrl.replace(/\/$/, '');
  //         this.provider = ethProvider(
  //           rpcUrlWithNoTrailingSlash + `/${process.env.ALCHEMY_ID}`
  //         );
  //       } else {
  //         /** Ethereum testnet use infura */
  //         this.provider = ethProvider(target, {
  //           infuraId: process.env.INFURA_ID,
  //         });
  //       }
  //       // } else {
  //       //   const isAlchemy = target.includes('alchemy');
  //       //   const options = isAlchemy
  //       //     ? {
  //       //         alchemyId: process.env.ALCHEMY_ID,
  //       //       }
  //       //     : {
  //       //         infuraId: process.env.INFURA_ID,
  //       //       };

  //       //   this.provider = ethProvider(target, options);
  //       // }

  //       this.provider.on('status', status => {
  //         if (status === 'connected') {
  //           this.connected = true;
  //           this.connection = this.provider.connection;

  //           /** libraries to communicate with rpc node */
  //           this.web3 = new Web3(this.provider);
  //           this.ethersProvider = new ethers.providers.Web3Provider(
  //             this.web3.currentProvider as any
  //           );
  //           this.query = new EthQuery(this.provider);

  //           this.provider.supportsSubscriptions = () => false;
  //           this.caver = new Caver(this.provider);

  //           this.chainId = network.chainId;

  //           this.emit('connected', network);

  //           this.connection.on('payload', payload =>
  //             this.emit('payload', payload)
  //           );

  //           if (this.blockTracker) {
  //             this.blockTracker.removeAllListeners('sync');
  //           }
  //           const networkDomain = new NetworkDomain(network);
  //           this.blockTracker = new PollingBlockTracker({
  //             pollingInterval: networkDomain.isKlaytn() ? 1000 : 5000,
  //             provider: this.provider,
  //           });
  //           // this.blockTracker.on('sync', this.handleBlockTracker.bind(this));
  //           this.blockTracker.on('sync', handleBlockTracker);
  //           // this.blockTracker.on('error', error => {
  //           //   log.info('blockTracker error', error);
  //           //   this.blockTracker.removeAllListeners('sync');
  //           //   this.blockTracker.on('sync', this.handleBlockTracker);
  //           // });

  //           // this.blockCache = new BlockCacheMiddleware();

  //           // this.subscriptionManager = createSubscriptionMiddleware({
  //           //   blockTracker: this.blockTracker,
  //           //   provider,
  //           // });

  //           resolve(true);
  //         }
  //         if (status === 'disconnected') {
  //           this.connected = false;
  //           reject(true);
  //         }
  //       });
  //     } catch (error) {
  //       reject(error);
  //     }
  //   });
  // }

  async getGasPrice(): Promise<string> {
    const result = await this.query.gasPrice();
    log.info('ProviderConnManager getGasPrice result', result);
    return BigNumber.from(result.toString(10)).toHexString();
  }

  async broadcastTx(rawTx: string, txId: string | undefined, txModel: TxModel | undefined) {
    // const { currentNetwork } = this.dekeyStore.getState();
    const currentNetwork = DekeyData.DEFAULT_NETWORKS[7];
    if (isKlaytn(currentNetwork.chainId) && txModel?.type) {
      const sendTxResult = await this.caver.rpc.klay.sendRawTransaction(rawTx);
      return sendTxResult.senderTxHash;
    }
    const result = await this.query.sendRawTransaction(rawTx);
    return result;
  }

  async getTransactionCount(address: string) {
    // const txCount = await this.ethersProvider.getTransactionCount(
    //   address,
    //   'pending'
    // );
    const txCount = await this.query.getTransactionCount(address, 'pending');
    // const txCount = await this.web3.eth.getTransactionCount(address, 'pending');

    log.info('ProviderConnManager txCount', txCount);
    return BigNumber.from(txCount.toString(10)).toHexString();
  }

  async getLatestBlock() {
    // return this.provider.request({
    //   method: 'eth_getBlockByNumber',
    //   params: ['latest', false],
    // });
    // return this.web3.eth.getBlock('latest', false);
    // return this.ethersProvider.getBlock('latest');
    const block = await this.query.getBlockByNumber('latest', false);
    log.info('ProviderConnManager getLatestBlock', block);
    return {
      ...block,
      gasLimit: block?.gasLimit ? BigNumber.from(block.gasLimit.toString(10)).toHexString() : null,
      gasUsed: BigNumber.from(block.gasUsed.toString(10)).toHexString(),
    };
  }

  async getBalance(address: string) {
    try {
      const balance = await this.query.getBalance(address);
      return BigNumber.from(balance.toString(10)).toHexString();
    } catch (error) {
      log.info('getBalance error');
      throw error;
    }
    // const balance = await this.ethersProvider.getBalance(address);
    const balance = await this.query.getBalance(address);
    return BigNumber.from(balance.toString(10)).toHexString();
    // return balance;
    // log.info('ProviderConnManager getBalance', balance);
    // return BigNumber.from(balance.toNumber()).toHexString();
  }

  async getCode(to: string) {
    const code = await this.query.getCode(to);
    log.info('ProviderConnManager getCode', code);
    return code;
  }

  async estimateGas(txMeta) {
    // return this.web3.eth.estimateGas(txMeta);
    // return this.ethersProvider.estimateGas(txMeta);
    const result = await this.query.estimateGas(txMeta);
    log.info('ProviderConnManager estimateGas', result);
    return BigNumber.from(result.toString(10)).toHexString();
  }

  async getTransactionReceipt(txHash: string) {
    const result = await this.query.getTransactionReceipt(txHash);
    log.info('ProviderConnManager getTransactionReceipt', result);
    if (!result) {
      return null;
    }
    return {
      ...result,
      gasUsed: BigNumber.from(result.gasUsed.toString(10)).toHexString(),
      blockNumber: BigNumber.from(result.blockNumber.toString(10)).toHexString(),
    };
    // return this.web3.eth.getTransactionReceipt(txHash);
  }

  async getKlaytnTransactionReceipt(txHash: string) {
    // return this.caver.klay.getTransactionReceiptBySenderTxHash(txHash);
    return this.caver.klay.getTransactionReceipt(txHash);
  }

  async getTokenDecimal(contractAddress: string): Promise<string> {
    try {
      const erc20 = new ethers.Contract(contractAddress, humanAbi, this.ethersProvider);
      return erc20.decimals();
    } catch (error) {
      throw error;
    }
  }

  async getTokenSymbol(contractAddress: string): Promise<string> {
    try {
      const erc20 = new ethers.Contract(contractAddress, humanAbi, this.ethersProvider);

      return erc20.symbol();
    } catch (error) {
      throw error;
    }
  }

  async getTokenBalance(contractAddress: string, ethAddress: string): Promise<string> {
    try {
      const erc20 = new ethers.Contract(contractAddress, humanAbi, this.ethersProvider);
      return erc20.balanceOf(ethAddress);
    } catch (error) {
      log.info('getTokenBalance error');
      throw error;
    }
  }

  async getTokenName(contractAddress: string): Promise<string> {
    try {
      const erc20 = new ethers.Contract(contractAddress, humanAbi, this.ethersProvider);

      return erc20.name();
    } catch (error) {
      throw error;
    }
  }

  async getKlaytnTokenBalance(contractAddress: string, ethAddress: string): Promise<string> {
    try {
      const erc20 = new ethers.Contract(contractAddress, KIP_ABI, this.ethersProvider);

      return erc20.balanceOf(ethAddress);
    } catch (error) {
      throw error;
    }
  }
}
