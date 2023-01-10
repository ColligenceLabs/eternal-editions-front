/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import {BigNumber, ethers, UnsignedTransaction} from 'ethers';
import {Account} from '../../schema/model';

export enum TX_SOURCE {
  TRANSFER = 0,
  ONETIME_DAPP = 1,
  REGISTER_AUTOCONFIRM = 2,
  AUTOCONFIRM = 3,
  ERC20 = 4,
  SPEEDUP = 5,
  CANCEL = 6,
}

export interface MakeUnsignedTxInput {
  to: string;
  from: string;
  value: number; // 10000000000000000
  data?: Buffer;
  gasPrice?: string;
  gas?: string;
  nonce?: number;
  chainId?: number;
}

export interface SendTxInput {
  to: string;
  value?: string;
  chainId?: number;
  from?: string;
  data?: string;
  gas?: string;
  nonce?: number;
  gasLimit?: string;
  domainName?: string;
  funcName?: string;
  resolve?;
  reject?;
  txType?: string;
  type?: string;
  payload: any;
  feeRatio?: string;
  gasPrice?: string; // gwei
  maxFeePerGas?: string; // gwei
  maxPriorityFeePerGas?: string; // gwei
}

export interface SendTokenTxInput {
  to: string;
  value?: string;
  chainId?: number;
  from?: string;
  data?: string;
  gas?: string;
  nonce?: number;
  gasLimit?: string;
  domainName?: string;
  funcName?: string;
  resolve?;
  reject?;
  txType?: string;
  type?: string;
  payload: any;
  feeRatio?: string;
  gasPrice?: string; // gwei
  maxFeePerGas?: string; // gwei
  maxPriorityFeePerGas?: string; // gwei
  tokenSymbol: string;
  assetId: string;
  tokenDecimal: number;
  contractAddress: string;
  mpcToken?: string;
}

export interface AddTxInput {
  txParams?: TxParams;
  type?: TX_SOURCE;
  autoconfirm?: Autoconfirm;
  payload?: any;
  res?: any;
  tabId?: any;
  dappAlertId?: string;
  network: NetworkModel;
  account: AppAccount;
  resolve?: any;
  reject?: Function;
  dappInfo?: any;
  txSource: TX_SOURCE;
  txId?: string;
  nonce?: number;
  txType?: TxType;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  dappResolve?: any;
  dappReject?: any;
  tokenInfo?: TokenInfo;
  tokenSendTo?: string;
  releaseLock?: Function;
}

export interface AppAccount extends Account {
  index?: string;
  hdPath?: string;
  icon?: string;
  accountDetail?: any;
}

export interface TokenInfo {
  tokenSymbol: string;
  assetId: string;
  tokenDecimal: number;
  contractAddress: string;
}

export interface createUnsignedTxForTransferingNativeCurrencyDto {
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  to: string;
  value: string;
  chainId: number;
  gasLimit: string;
  txType?: TxType;
  nonce?: string;
}

export interface CreateUnsignedTxForTransferingTokenDto {
  to: string; // to
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  value: string;
  chainId: number;
  gasLimit: string;
  txType: TxType;
  nonce: string;
  decimal: number;
  contractAddress: string;
}

export interface TxParams {
  to: string;
  value?: string;
  gasPrice?: string;
  gasLimit: string;
  chainId: number;
  data?: string;
  type?: string | number; // klaytn tx type | ethereum eip1559 type 2
  feeRatio?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  tokenSymbol?: string;
  assetId?: string;
  tokenDecimal?: number;
  contractAddress?: string;
  nonce?: number;
}

export interface Autoconfirm {
  // domainName: string;
  // funcName: string;
  tabId: number;
  dappAlertId: string;
}

export interface AssetModel {
  id: string;
  decimal: number;
  balance: string;
  formattedBalance: string;
  name?: string;
  iconUrl?: string;
  symbol?: string;
  networkId?: string;
  contractAddress?: string;
  address?: string;
  hide?: boolean;
  createdAt?: number; // new Date().getTime()
}

export interface GasFeeModel {
  estimatedGasFeeTimeBounds: any;
  gasEstimateType: string;
  gasFeeEstimates: {
    estimatedBaseFee: string; // "0.00",
    high: GasFeeEstimateItem;
    medium: GasFeeEstimateItem;
    low: GasFeeEstimateItem;
  };
}

export interface GasFeeEstimateItem {
  maxWaitTimeEstimate: number; // 60000,
  minWaitTimeEstimate: number; // 15000
  suggestedMaxFeePerGas: string; // "2.00"
  suggestedMaxPriorityFeePerGas: string; // "2.00"
}

export interface ConnectedDomainModel {
  domainName: string;
  accountIds: number[];
  aaid: number;
  iconUrl: string;
  id: string;
}

export interface RequestTxApprovalInput {
  userId: number;
  walletId: number;
  pubKey?: string;
  unsignedTx: UnsignedTransaction;
  hash: string;
}

export interface MpcSignInput {
  txHash: string;
  mpcToken: string;
  accountId: number;
}

export interface MpcUnlockDto {
  hashMessage: string;
  EncPV: string;
  password: string;
}

export interface DappTxInput {
  from?: string;
  to?: string;
  domainName: string;
  data?: string;
  funcName: string;
  gasPrice?: string;
  gasLimit: string;
  res?: any;
  payload?: any;
  value?: string;
  network?: NetworkModel;
  gas?;
  defaultGasLimit?;
  klayType?: string;
  feeRatio?: string;
  chainId: number;
  maxPriorityFeePerGas?: string;
  maxFeePerGas?: string;
  baseFeePerGas?: string;
  gasFee?: any;
  resolve?: any;
  reject?: any;
}

export interface GetEstimateGasLimitDto {
  contractAddress: string;
  to: string;
}

export interface DappTxReqParam {
  data: string;
  from: string;
  gasPrice?: string;
  gas?: string;
  to: string;
  value: string;
  type?: string;
  feeRatio?: string;
}

// blockHash: "0x78202442f240c26ef7d30a95e273f2dbb389687e3df2ccb799d6ce9afccc46ce"
// blockNumber: "7235121"
// confirmations: "38"
// contractAddress: ""
// cumulativeGasUsed: "63000"
// from: "0x074b11fd9a9865bd9eb86f4341734d14a0929909"
// gas: "21000"
// gasPrice: "2000000000"
// gasUsed: "21000"
// hash: "0x7782e385178dc300e2b3d2e3a3d1fe43f5bbae08d9c20af447363293b639a4dd"
// input: "0x"
// isError: "0"
// nonce: "0"
// timeStamp: "1657950869"
// to: "0x02e31a6132d338995e3236d2422318110540392c"
// transactionIndex: "2"
// txreceipt_status: "1"
// value: "10000000000"

export interface EtherscanTx {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  maxPriorityFeePerGas?: string;
  maxFeePerGas?: string;
}

export interface DappTx {
  from: string;
  to: string;
  timeStamp: string;
  value: string;
  txType: string;
  status: TxStatus;
  gasPrice: BigNumber;
  gasLimit: string;
  hash: string;
  domainName: string;
  funcName: string;
  autoconfirm: boolean;
  chainId: number;
  networkId: string;
}

export interface QueueTx extends ethers.providers.TransactionResponse {
  status: TxStatus;
  timeStamp: string;
  isTokenTx?: boolean;
}

export interface NetworkModel {
  id: string;
  name: string;
  rpcUrl: string;
  chainId: number;
  target: string;
  isCustom: boolean;
  symbol?: string;
  blockExplorerUrl?: string;
  iconUrl?: string; // network main coin icon url
  EIPS?: {
    '1559': boolean;
  };
  assetName?: string;
}

// token model from dapp add token request
export interface SuggestedTokenModel {
  image?: string;
  address: string; // "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
  balance: string; // "0.000392305726768729"
  decimals: number; // 18
  symbol: string; // "UNI"
  tokenName: string; // "Uniswap"
}

export enum TxStatus {
  FAILED = 'failed',
  DROPPED = 'dropped',
  APPROVED = 'approved',
  SUMMITTED = 'submitted',
  CONFIRMED = 'confirmed',
}

export enum TxType {
  CANCEL = 'cancel',
  RETRY = 'retry',
  TOKEN_METHOD_TRANSFER = 'transfer',
  TOKEN_METHOD_TRANSFER_FROM = 'transferfrom',
  TOKEN_METHOD_APPROVE = 'approve',
  INCOMING = 'incoming',
  SENT_ETHER = 'sentEther',
  CONTRACT_INTERACTION = 'contractInteraction',
  DEPLOY_CONTRACT = 'contractDeployment',
}

export enum TxEventKey {
  CANCEL = 'cancel',
  RETRY = 'retry',
  APPROVED = 'approved',
  SUMMITTED = 'submitted',
  CONFIRMED = 'confirmed',
}

export interface TxModel {
  id: string;
  hash?: string;
  to: string;
  from: string;
  value: string;
  gasPrice: string;
  status: TxStatus;
  chainId: number;
  assetId?: string;
  timeStamp?: string;
  domainName?: string;
  funcName?: string;
  isAutoconfirm?: boolean;
  tokenSymbol?: string;
  tokenDecimal?: number;
  contractAddress?: string;
  symbol?: string;
  nonce: number;
  aaid: number;
  gasLimit: string;
  history?: TxHistory[];
  data?: string;
  type?: string;
  txSource: TX_SOURCE;
  txType?: TxType;
  tabId?: number;
  dappAlertId?: string;
  confirmations?: number;
  maxPriorityFeePerGas?: string;
  maxFeePerGas?: string;
  networkId: string;
  signer?: string;
}

export interface IncomingTxModel {
  id: string;
  hash?: string; // "0x1937f2df862f1a4d2c07c8e30845374229d4bc71f755846dc53c6be4fb733f51"
  to: string; // "0x38dC52E421e4dd3F671dd2d4f0eB97a3f789c8ED"
  from: string; // "0x536b5cD0E89B9088d89a91Dd0297E1308aA65BDA"
  value: string; // "0x0165b5a021d659"
  gasPrice: string; // "0x3b9aca10"
  gasUsed?: string; // "0x0323bf"
  blockNumber?: string; // "10707872"
  status: TxStatus; // "confirmed"
  chainId: number; // 4
  assetId?: string; // "0ffbddad-e297-4f7b-97f6-cfee3e71b84f"
  timeStamp?: string; // "1653033968"
  aaid: number; // 0
  tokenSymbol?: string; // "UNI"
  tokenDecimal?: number; // 18
  symbol?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
}

export interface TxHistory {
  eventKey: string;
  gasPrice?: string;
  value?: string;
  timestamp: number;
  message?: string;
}

export interface GasnowDataModel {
  rapid: Number;
  fast: Number;
  standard: Number;
  slow: Number;
}

export interface GasDataModel {
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
}

export interface LedgerUpdateTxToFailedDto {
  txId: string;
  message: string;
}
