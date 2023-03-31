/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import {Account} from '../../schema/model';
import {NetworkModel, TxType} from '../transactions/interface';

export interface AddAssetDto {
  contractAddress: string;
  decimal: number;
  symbol: string;
  iconUrl: string;
  networkId: string;
  address: string;
  balance?: string;
  tokenName?: string;
}

export interface GetTokenInfoDto {
  contractAddress: string;
}

export interface GetTokenInfoResult {
  balance: string;
  decimal: number;
  symbol: string;
  iconUrl?: string;
  tokenName?: string;
}

export interface GetBalanceDto {
  contractAddresses: string[];
  networkName?: string;
  chainId: number;
}

export interface TransferErc20Dto {
  contractAddress: string;
  to: string;
  decimal: number;
  value: string;
  chainId?: number;
  assetId: string;
  symbol: string;
  gasPrice?: string;
  gasLimit: string;
  txId?: string;
  txType?: TxType;
  nonce?: number;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
}

export interface SetTokenTxsDto {
  contractAddress: string;
  decimal: number;
  assetId: string;
}

export interface FetchTokenTxs {
  myAddress: string;
  contractAddress: string;
  // page: number;
  // offset: number;
  // chainId: number;
  startblock: number;
  network: NetworkModel;
  chainId: number;
}

export interface EtherscanTokenTx {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
}

export interface FetchTokenTxResult {
  success: boolean;
  txs?: EtherscanTokenTx[];
}

export interface RemoveTokenDto {
  tokenId: string;
}

export interface WatchAssetDto {
  type: string; // In the future, other standards will be supported
  options: {
    address: string; // The address of the token contract
    symbol: string; // A ticker symbol or shorthand, up to 5 characters
    decimals: number; // The number of token decimals
    image: string; // A string url of the token logo
  };
}

export interface GetTokenInfoDto {
  contractAddress: string;
  account: Account;
}
