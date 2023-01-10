/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

export const DekeyError = {
  calcV: message => ({
    name: DekeyErrorTypes.CALCULATE_V_ERROR,
    message,
  }),
  mpcKeygen: (message: string) => {
    return {
      name: DekeyErrorTypes.MPC_KEYGEN_ERROR,
      message,
    };
  },
  mpcSign: (message: string) => ({
    name: DekeyErrorTypes.MPC_SIGN_ERROR,
    message,
  }),
  mpcUnlock: (message?: string) => ({
    name: DekeyErrorTypes.MPC_UNLOCK_ERROR,
    message,
  }),
  mpcRecover: message => ({
    name: DekeyErrorTypes.MPC_RECOVER_ERROR,
    message,
  }),
  saveRecoverResult: message => ({
    name: DekeyErrorTypes.APP_SERVER_RECOVER_ERROR,
    message,
  }),
  saveKeygenResult: message => ({
    name: DekeyErrorTypes.APP_SERVER_KEYGEN_ERROR,
    message,
  }),
  getMpcJwt: message => ({
    name: DekeyErrorTypes.GET_MPC_JWT_ERROR,
    message,
  }),
  updateAccountName: message => ({
    name: DekeyErrorTypes.APP_SERVER_UPDATE_ACCOUNT_NAME_ERROR,
    message,
  }),
  genTwofa: message => ({
    name: DekeyErrorTypes.APP_SERVER_GEN_TWOFA_ERROR,
    message,
  }),
  getTwofaResetcode: message => ({
    name: DekeyErrorTypes.APP_SERVER_GET_TWOFA_RESETCODE_ERROR,
    message,
  }),
  getWallets: message => ({
    name: DekeyErrorTypes.APP_SERVER_GET_WALLETS_ERROR,
    message,
  }),
  getTokenInfo: message => ({
    name: DekeyErrorTypes.GET_TOKEN_INFO_ERROR,
    message,
  }),
  addToken: message => ({
    name: DekeyErrorTypes.ADD_TOKEN_INFO_ERROR,
    message,
  }),
  addFavorite: message => ({
    name: DekeyErrorTypes.ADD_FAVORITE_ERROR,
    message,
  }),
  twofaGenQrcode: message => ({
    name: DekeyErrorTypes.TWOFA_GEN_QRCODE_ERROR,
    message,
  }),
  twofaGenVerify: message => ({
    name: DekeyErrorTypes.TWOFA_GEN_VERIFY_ERROR,
    message,
  }),
  twofaGenVerifyReset: message => ({
    name: DekeyErrorTypes.TWOFA_GEN_VERIFY_RESET_ERROR,
    message,
  }),
  twofaVerify: message => ({
    name: DekeyErrorTypes.TWOFA_VERIFY_ERROR,
    message,
  }),
  twofaVerifyForMpcSign: message => ({
    name: DekeyErrorTypes.TWOFA_VERIFY_FOR_MPC_SIGN_ERROR,
    message,
  }),
  invalidUnsignedTxToHash: message => ({
    name: DekeyErrorTypes.INVALID_UNSIGNED_TX_TO_HASH,
    message,
  }),
  syncNativeCurrencyIncomingTxs: message => ({
    name: DekeyErrorTypes.SYNC_NATIVE_CURRENCY_INCOMING_TXS_ERROR,
    message,
  }),
  syncTokenIncomingTxs: message => ({
    name: DekeyErrorTypes.SYNC_TOKEN_INCOMING_TXS_ERROR,
    message,
  }),
  updateNativeCurrencyBalance: message => ({
    name: DekeyErrorTypes.UPDATE_NATIVE_CURRENCY_BALANCE,
    message,
  }),
  updateTokenBalances: message => ({
    name: DekeyErrorTypes.UPDATE_TOKEN_BALANCES_ERROR,
    message,
  }),
  fetchGasfeeEstimates: message => ({
    name: DekeyErrorTypes.FETCH_GASFEE_ESTIMATES_ERROR,
    message,
  }),
  addNetwork: message => ({
    name: DekeyErrorTypes.ADD_NETWORK_ERROR,
    message,
  }),
  switchNetwork: message => ({
    name: DekeyErrorTypes.SWITCH_NETWORK_ERROR,
    message,
  }),
  txBroadcast: message => ({
    name: DekeyErrorTypes.TX_BROADCAST_ERROR,
    message,
  }),
  unlock: message => ({
    name: DekeyErrorTypes.APP_SERVER_UNLOCK,
    message,
  }),
  getChallengeMessage: message => ({
    name: DekeyErrorTypes.GET_CHALLENGE_MESSAGE,
    message,
  }),
  favoriteDuplicateNickname: message => ({
    name: DekeyErrorTypes.FAVORITE_DUPLICATE_NICKNAME,
    message,
  }),
  favoriteDuplicateAddress: message => ({
    name: DekeyErrorTypes.FAVORITE_DUPLICATE_ADDRESS,
    message,
  }),
};

export const DekeyErrorTypes = {
  CALCULATE_V_ERROR: 'CALCULATE_V_ERROR',
  MPC_KEYGEN_ERROR: 'MPC_KEYGEN_ERROR',
  MPC_SIGN_ERROR: 'MPC_SIGN_ERROR',
  MPC_UNLOCK_ERROR: 'MPC_UNLOCK_ERROR',
  MPC_RECOVER_ERROR: 'MPC_RECOVER_ERROR',
  APP_SERVER_RECOVER_ERROR: 'APP_SERVER_RECOVER_ERROR',
  APP_SERVER_KEYGEN_ERROR: 'APP_SERVER_KEYGEN_ERROR',
  GET_MPC_JWT_ERROR: 'GET_MPC_JWT_ERROR',
  APP_SERVER_UPDATE_ACCOUNT_NAME_ERROR: 'APP_SERVER_UPDATE_ACCOUNT_NAME_ERROR',
  APP_SERVER_GEN_TWOFA_ERROR: 'APP_SERVER_GEN_TWOFA_ERROR',
  APP_SERVER_GET_TWOFA_RESETCODE_ERROR: 'APP_SERVER_GET_TWOFA_RESETCODE_ERROR',
  APP_SERVER_GET_WALLETS_ERROR: 'APP_SERVER_GET_WALLETS_ERROR',
  GET_TOKEN_INFO_ERROR: 'GET_TOKEN_INFO_ERROR',
  ADD_TOKEN_INFO_ERROR: 'ADD_TOKEN_INFO_ERROR',
  ADD_FAVORITE_ERROR: 'ADD_FAVORITE_ERROR',
  TWOFA_GEN_QRCODE_ERROR: 'TWOFA_GEN_QRCODE_ERROR',
  TWOFA_GEN_VERIFY_ERROR: 'TWOFA_GEN_VERIFY_ERROR',
  TWOFA_GEN_VERIFY_RESET_ERROR: 'TWOFA_GEN_VERIFY_RESET_ERROR',
  TWOFA_VERIFY_ERROR: 'TWOFA_VERIFY_ERROR',
  TWOFA_VERIFY_FOR_MPC_SIGN_ERROR: 'TWOFA_VERIFY_FOR_MPC_SIGN_ERROR',
  INVALID_UNSIGNED_TX_TO_HASH: 'INVALID_UNSIGNED_TX_TO_HASH',
  SYNC_NATIVE_CURRENCY_INCOMING_TXS_ERROR:
    'SYNC_NATIVE_CURRENCY_INCOMING_TXS_ERROR',
  SYNC_TOKEN_INCOMING_TXS_ERROR: 'SYNC_TOKEN_INCOMING_TXS_ERROR',
  UPDATE_NATIVE_CURRENCY_BALANCE: 'UPDATE_NATIVE_CURRENCY_BALANCE',
  UPDATE_TOKEN_BALANCES_ERROR: 'UPDATE_TOKEN_BALANCES_ERROR',
  FETCH_GASFEE_ESTIMATES_ERROR: 'FETCH_GASFEE_ESTIMATES_ERROR',
  ADD_NETWORK_ERROR: 'ADD_NETWORK_ERROR',
  SWITCH_NETWORK_ERROR: 'SWITCH_NETWORK_ERROR',
  TX_BROADCAST_ERROR: 'TX_BROADCAST_ERROR',
  APP_SERVER_UNLOCK: 'APP_SERVER_UNLOCK',
  GET_CHALLENGE_MESSAGE: 'GET_CHALLENGE_MESSAGE',
  APP_SERVER_GET_TWOFA_ENABLED: 'APP_SERVER_GET_TWOFA_ENABLED',
  LEDGER_DEVICE_NOT_CONNECTED: 'TransportOpenUserCancelled',
  LEDGER_TX_USER_CANCELLED: 'LEDGER_TX_USER_CANCELLED',
  LEDGER_STATUS_ERROR: 'TransportStatusError',
  FAVORITE_DUPLICATE_NICKNAME: 'FAVORITE_DUPLICATE_NICKNAME',
  FAVORITE_DUPLICATE_ADDRESS: 'FAVORITE_DUPLICATE_ADDRESS',
};
