/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import {AbcGetUrgentNoticeResponse} from '../../schema/account';
import {Account, User, Wallet} from '../../schema/model';
import {CurrencyType} from '../preference/interface';
import {AddFavoriteDtoForTwoFa} from '../rules/interface';
import {
  AppAccount,
  AssetModel,
  ConnectedDomainModel,
  GasFeeModel,
  IncomingTxModel,
  NetworkModel,
  SuggestedTokenModel,
  TxModel,
} from '../transactions/interface';

export interface AppModel {
  user?: UserModel;
  wallet?: Wallet;
  activeAccount?: AppAccount;
  connectedDomains?: ConnectedDomainModel[];
  assets?: AssetModel[];
  // accessToken?: string;
  mpcToken?: string;
  currentNetwork?: NetworkModel;
  locked?: boolean;
  suggestedTokens?: SuggestedTokenModel[];
  networks?: NetworkModel[];
  ledger?: {
    accounts: AppAccount[];
  };
  addFavoriteDtoForTwoFa?: AddFavoriteDtoForTwoFa;
  gasFee?: GasFeeModel;
  mainAssetBlockNumbersForIncomingTxs?: BlockNumbersForIncomingTxsModel;
  tokenBlockNumbersForIncomingTxs?: BlockNumbersForIncomingTxsModel;
  esTxs?: IncomingTxModel[];
  pendingTxs?: TxModel[];
  tokenTxs?: IncomingTxModel[];
  // unapprovedPersonalMsgs?: {
  //   [key: string]: UnapprovedPersonalMsgModel;
  // };
  // unapprovedTypedMsgs?: {
  //   [key: string]: UnapprovedTypedMsgModel;
  // };
  unapproveddMsgs?: {
    [key: string]: any;
  };
  errors?: any[];
  // expirationTime?: number;
  mainnetChainIds?: number[];
  abcAuth?: AbcAuth;
  exchangeRates?: {
    [key: string]: {
      usd: number;
      krw: number;
      jpy: number;
    };
  };
  approval?: ApprovalModel<any>;
  ledgerTransportType?: string;
  currLang?: string;
  isDeveloperMode?: boolean;
  ledgerSignPrep?: any;
  currencyType?: CurrencyType;
  useSelectedNonceTx?: boolean;
  totalAssetsValue?: totalAssetsValue;
  reload?: boolean;
  activeControllerConnections?: number;
  injectKlaytnProvider?: boolean;
  injectEthereumProvider?: boolean;
  hiddenUrgentNotice?: Partial<AbcGetUrgentNoticeResponse>;
}

export interface totalAssetsValue {
  usd: string;
  krw: string;
}

export interface GenereateKeyDto {
  uid: string;
  wid: number;
  password: string;
  start_datetime?: string;
  end_datetime?: string;
  purpose?: string;
  dsa_mode?: string;
  curve_name?: string;
  share_mode?: number;
  jwt?: string;
  mpcToken: string;
}

export interface UpdateAccountNameDto {
  signer: string;
  accountId: number;
  accountName: string;
  address: string;
}

export interface GenereateKeyResult {
  OurPubKey: string;
  PVEncStr: string;
  Sid: string; // EthAddress
  UCPubKey: string;
  Uid: string;
  Wid: number;
}

export interface RegisterUserResult {
  accessToken: string;
  mpcToken: string;
  addr?: string;
  user?: UserModel;
  expiresIn: string;
}

export interface UserModel extends User {
  EncPV?: string;
}

export interface ConnectAccountDto {
  domainName: string;
  address: string;
  iconUrl: string;
}

export interface GetConnectAccountPageData {
  address: string;
  balance: string;
  domainName: string;
  iconUrl: string;
}

export interface RequestAccountData {
  domainName?: string;
  res?: Function;
  address?: string;
  iconUrl?: string;
  resolve?: Function;
  reject?: Function;
}

export interface GetLedgerAccountsWithBalanceResult {
  added: boolean;
  address: string;
  balance: string;
  index: number;
}

// export interface UpdateStoreModel {
//   user?: UserModel;
//   wallet?: Wallet;
//   activeAccount?: Account;
//   mpcToken?: string;
//   connectedDomains?: ConnectedDomainModel[];
//   assets?: AssetModel[];
//   accessToken?: string;
//   currentNetwork?: NetworkModel;
//   locked?: boolean;
//   suggestedTokens?: SuggestedTokenModel[];
//   networks?: NetworkModel[];
//   pendingTxs?: TxModel[];
//   ledger?: {
//     accounts?: Account[];
//   };
//   unapprovedPersonalMsgs?: any;
//   unapprovedTypedMsgs?: any;
//   tokenTxs?: any;
//   expirationTime?: any;
//   waitingConfirmCode?: any;
//   currLang?: string;
//   isDeveloperMode?: boolean;
//   mainnetChainIds?: number[];
//   mainAssetBlockNumbersForIncomingTxs?: any;
//   tokenBlockNumbersForIncomingTxs?: any;
//   twoFactorGen?: any;
//   addFavoriteDtoForTwoFa?: AddFavoriteDtoForTwoFa;
//   gasFee?: any;
//   ledgerTransportType?: any;
//   approval?: ApprovalModel<any>;
//   ledgerSignPrep?: any;
//   esTxs?: IncomingTxModel[];
//   errors?: CustomError[];
//   abcAuth?: AbcAuth;
//   exchangeRates?: {
//     ethereum: {
//       usd: number;
//     };
//   };
// }

export interface UnapprovedPersonalMsgModel {
  id: number; // 8717062797553341
  msgParams: {
    [key: string]: string; // "E"
    data: string; // "0x4578616d706c652060706572736f6e616c5f7369676e60206d657373616765"
    from: string; // "0x38dc52e421e4dd3f671dd2d4f0eb97a3f789c8ed"
  };
  status: string; // 'unapproved';
  time: number; // 1653039850801;
  type: string; // 'personal_sign';
}

export interface UnapprovedTypedMsgModel {
  id: number; // 8717062797553341
  msgParams: {
    [key: string]: any;
  };
  status: string; // 'unapproved';
  time: number; // 1653039850801;
  type: string; // "eth_signTypedData";
}

export interface BlockNumbersForIncomingTxsModel {
  [key: string]: {
    [key: string]: string;
  };
}

export interface AbcAuth {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
}

// export interface IncomingTxModel {
//   aaid: number; //0;
//   blockNumber: string; // '10707855';
//   chainId: number; // 4;
//   from: string; // '0x02e31A6132d338995e3236d2422318110540392c';
//   gasPrice: string; // '0x77359400';
//   gasUsed: string; // '0x5208';
//   hash: string; // '0xe83e311224bf56c625957e0556e316cb4d893947127e6862e0f7c0123bd06d93';
//   status: TxStatus; // 'confirmed';
//   timeStamp: string; // '1653033713';
//   to: string; // '0x38dC52E421e4dd3F671dd2d4f0eB97a3f789c8ED';
//   value: string; // '0x016345785d8a0000';
//   assetId?: string;
//   maxFeePerGas?: string;
//   maxPriorityFeePerGas?: string;
// }

// export interface PendingTxModel {
//   aaid: number; //0
//   assetId: string; // "0ffbddad-e297-4f7b-97f6-cfee3e71b84f"
//   chainId: number; // 4
//   contractAddress: string; // "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
//   dappAlertId: string | null; // null
//   data: string; // "0xa9059cbb00000000000000000000000002e31a6132d338995e3236d2422318110540392c000000000000000000000000000000000000000000000000000000e8d4a51000"
//   domainName: string | null;
//   from: string; // "0x38dC52E421e4dd3F671dd2d4f0eB97a3f789c8ED"
//   funcName: string | null;
//   gasLimit: string; // "0x0117d1"
//   gasPrice: string | null;
//   gasUsed: string; // "0x9c86"
//   hash: string; // "0x9f26cb44dd87ebc6dcf429f60ed581157d37179f3eddc7929c08ef0d7495c700"
//   history: any;
//   id: string; // "a747bd05-e2e3-46b7-8665-d1e0e60ae7e7"
//   isAutoconfirm: boolean; // false
//   maxFeePerGas: string; // "0xb2d05e11"
//   maxPriorityFeePerGas: string; // "0xb2d05e00"
//   nonce: string; // "0x01"
//   status: TxStatus; // "confirmed"
//   tabId: any;
//   timeStamp: string; // "1653034261"
//   to: string; // "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
//   tokenDecimal: number; // 18
//   tokenSymbol: string; // "UNI"
//   txSource: TX_SOURCE; // 4
//   type: string | null;
//   value: string; // "0xe8d4a51000"
// }

export interface ApprovalModel<T> {
  type: string;
  origin: string;
  id: string;
  requestData: T;
}

export interface RestAddAccountDto {
  address: string;
  accountId: number;
  accountName: string;
  accessToken: string;
}

export interface AddAccountDto {
  accountName: string;
  password: string;
  email: string;
}

export interface AddNetworkDto {
  name: string;
  rpcUrl: string;
  chainId: number;
  existingRpcUrl?: string;
  symbol?: string;
  blockExplorerUrl?: string;
}

export interface TransactionModel {
  chainId: number;
  nonce: number;
  gasPrice: string;
  gas: number;
  to: string;
  value: string;
  data: string;
  isDapp: boolean;
  funcName?: string;
  send?: boolean;
  origin?: string;
  created: Date;
}

export interface IncomingTxResult {
  value: string;
  confirmations: string;
  from: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  hash: string;
  nonce: string;
  to: string;
}

export interface SaveKeyGenResultDto {
  pubKey: string;
  address: string;
  ucPubkey: string;
  // sid: string;
  // accountId: number;
  accountName: string;
  uid: string;
  wid: number;
  email: string;
  iss: string;
}

export interface GetChallengeMessageRes {
  hashMessage: string;
}

export interface UnLockDto {
  password: string;
  keep?: boolean;
}

export interface SelfSignDto {
  password: string;
  EncPV: string;
  hashMessage: string;
}

export interface SelfSignRes {
  r: string;
  s: string;
}

export interface GetNewSessionJwtRes {
  accessToken: string;
  expiresIn: string;
}

export interface VerifyPasswordDto {
  password: string;
}

export interface VerifySelfSign {
  r: string;
  s: string;
  // address: string;
  aaid: number;
  hashMessage: string;
}

export interface RecoverDto {
  password: string;
  mnemonic?: string;
  sid: string;
  uid?: string;
  wid?: number;
  mpcToken: string;
}

export interface RecoverResult {
  OurPubKey: string;
  PVEncStr: string;
  Sid: string;
  UCPubKey: string;
  Uid: string;
  Wid: number;
}

export interface UnlockDto {
  r: string;
  s: string;
  hashMessage: string;
  address: string;
  sid: string;
}

export interface RecoverSIDResult {
  json: string;
  r: string;
  s: string;
}

export interface VerifyRecoverServiceDto {
  json: string;
  r: string;
  s: string;
}

export interface MpcAddAccountResult {
  AccountID: number;
  EthAddress: string;
  NewPVEncStr: string;
}

export interface SendCipherDto {
  uid: string;
  wid: number;
  accToken: string;
  mpcToken: string;
  confirmCode: string;
  password: string;
}

export interface CheckPasswordDto {
  password: string;
  EncPV: string;
}

export interface VerifyTwoFactorResult {
  verified: boolean;
}

export interface ChangeActiveAccountDto {
  account: Account;
}
