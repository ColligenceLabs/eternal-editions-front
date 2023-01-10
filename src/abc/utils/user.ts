/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import {DekeyData} from '../dekeyData';
import {UserModel} from '../main/accounts/interface';
import {
  ASSETS,
  CURRENT_NETWORK,
  IS_DEVELOPER_MODE,
  LEDGER_TRANSPORT_TYPE,
  LOCKED,
  MAINNET_CHAIN_IDS,
  NETWORKS,
  UNAPPROVED_PERSONAL_MSGS,
  UNAPPROVED_TYPED_MSGS,
} from '../main/db/constants';
import {LedgerTransportType} from '../main/ledger/interface';
import {Account} from '../schema/model';

const getAllAccounts = ({user, ledger}: {user: UserModel; ledger}) => {
  try {
    if (!user || !user.accounts) {
      throw new Error('Accounts not exists');
    }

    let accounts = user.accounts;

    if (ledger && ledger.accounts) {
      accounts = [...accounts, ...ledger.accounts];
    }
    return accounts;
  } catch (error) {
    throw error;
  }
};

const createDefaultWalletData = () => {
  try {
    const networks = DekeyData.DEFAULT_NETWORKS;
    const ethMainAsset = DekeyData.DEFAULT_ASSETS[0];

    return {
      [NETWORKS]: [...networks],
      [CURRENT_NETWORK]: networks.find(item => item.chainId === 1),
      [ASSETS]: [{...ethMainAsset}],
      [LOCKED]: false,
      [IS_DEVELOPER_MODE]: false,
      [MAINNET_CHAIN_IDS]: [1, 56, 8217, 42161, 10, 137],
      [UNAPPROVED_PERSONAL_MSGS]: [],
      [UNAPPROVED_TYPED_MSGS]: [],
      [LEDGER_TRANSPORT_TYPE]: LedgerTransportType.Webhid,
    };
  } catch (error) {
    throw error;
  }
};

const getNextWid = wallets => {
  return Math.max(...wallets.map(w => w.wid)) + 1;
};

const isHardwareAccount = (account: Account) => {
  return account.signer === 'ledger';
};

const UserUtil = {
  getAllAccounts,
  createDefaultWalletData,
  getNextWid,
  isHardwareAccount,
};

export default UserUtil;
