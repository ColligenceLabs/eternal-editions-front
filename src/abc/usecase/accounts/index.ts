/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import 'reflect-metadata';
// import browser from 'webextension-polyfill';
import _ from 'lodash';
import EventEmitter from 'events';
import { v4 as uuidv4 } from 'uuid';
import { Decimal } from 'decimal.js';

import { AddAccountDto, RequestAccountData, UserModel } from '../../main/accounts/interface';
import {
  ACCESS_TOKEN,
  ACTIVE_ACCOUNT,
  ASSETS,
  CONNECTED_DOMAINS,
  LOCKED,
  USER,
} from '../../main/db/constants';
// import accountRepository from '../../infra/repository/accounts';
import { AccountRestApi, CoingeckoSimplePriceResponse } from '../../infra/rest-api/accounts';
// import { DekeyStore } from '../store';
import { DekeyData } from '../../dekeyData';
// import { ProviderService } from '../provider';
import { formatAmount } from '../../utils/number';
import { ethers } from 'ethers';
import { MpcService } from '../mpc';
import { LedgerTransportType } from '../../main/ledger/interface';
import DappUtil from '../../utils/dapp';
import { AssetModel, ConnectedDomainModel, NetworkModel } from '../../main/transactions/interface';
import { Account, User, Wallet } from '../../schema/model';
import CoingeckoCoinList from '../../assets/data/coingecko_coin_list.json';
import { CurrencyType } from '../../main/preference/interface';
import { getCoingeckoNetworkName } from '../../utils/network';

import secureLocalStorage from 'react-secure-storage';
import { setUser } from '../../../store/slices/user';
import { setWallet } from '../../../store/slices/wallet';

// export const NOTIFICATION_NAMES = {
//   accountsChanged: 'metamask_accountsChanged',
//   unlockStateChanged: 'metamask_unlockStateChanged',
//   chainChanged: 'metamask_chainChanged',
// };

export class AccountService extends EventEmitter {
  keyGenResult;
  _requestAccountData: RequestAccountData;

  constructor(
    // private dekeyStore: DekeyStore,
    // private providerService: ProviderService,
    private accountRestApi: AccountRestApi
  ) {
    super();
  }

  createMpcBaseAccount = async (data: AddAccountDto, mpcService: MpcService, dispatch: any) => {
    try {
      const { password, accountName, email } = data;

      // const { abcAuth } = this.dekeyStore.getState();
      // const abcAuth = JSON.parse(window.localStorage.getItem('abcAuth')!);
      const abcAuth = JSON.parse(secureLocalStorage.getItem('abcAuth')!);

      // if (!abcAuth?.accessToken) {
      //   throw new Error('No abc accessToken');
      // }

      const uid = uuidv4();
      const wid = 1;

      await mpcService.clearPV();

      const mpcKeyGenResult = await mpcService.generateKey({
        uid,
        wid,
        password,
        mpcToken: abcAuth?.accessToken, // use abc access token
        // mpcToken: 'DUMMY_TOKEN', // use abc access token
      });

      const { UCPubKey, OurPubKey, Sid, Uid, Wid, PVEncStr } = mpcKeyGenResult;

      const { user, wallet } = await this.accountRestApi.saveKeyGenResult(
        {
          email,
          ucPubkey: UCPubKey,
          pubKey: OurPubKey,
          address: Sid,
          accountName,
          uid: Uid,
          wid: Wid,
          iss: process.env.ISS,
        },
        abcAuth
      );

      user.EncPV = PVEncStr;

      await dispatch(setUser(user));
      await dispatch(setWallet(wallet));

      this.initializeWalletAfterKeyGen({
        user,
        wallet,
      });
    } catch (err) {
      throw err;
    }
  };

  initializeWalletAfterKeyGen({ user, wallet }: { user: User; wallet: Wallet }) {
    const networks = DekeyData.DEFAULT_NETWORKS;
    const ethMainAsset = DekeyData.DEFAULT_ASSETS[0];
    const currentNetwork = networks.find((item) => item.chainId === 1);

    // this.dekeyStore.updateStore({
    //   user,
    //   wallet,
    //   activeAccount: user.accounts[0],
    //   networks: [...networks],
    //   currentNetwork: currentNetwork,
    //   assets: [{ ...ethMainAsset }],
    //   locked: false,
    //   isDeveloperMode: false,
    //   mainnetChainIds: [1, 56, 8217, 42161, 10, 137],
    //   errors: [],
    //   exchangeRates: {},
    //   ledger: null,
    //   totalAssetsValue: null,
    //   approval: null,
    //   unapproveddMsgs: {},
    //   ledgerTransportType: LedgerTransportType.Webhid,
    //   connectedDomains: [],
    //   tokenTxs: [],
    //   esTxs: [],
    //   pendingTxs: [],
    //   suggestedTokens: [],
    //   mainAssetBlockNumbersForIncomingTxs: {},
    //   tokenBlockNumbersForIncomingTxs: {},
    //   // unapprovedPersonalMsgs: {},
    //   // unapprovedTypedMsgs: {},
    // });
  }

  changeActiveAccount(account: Account, mpcService?: MpcService) {
    const state = this.dekeyStore.getState();
    const previousAccount = state[ACTIVE_ACCOUNT];

    try {
      // if (account.signer === 'mpc') {
      //   await mpcService.changeActiveAccount({
      //     accountId: account.id,
      //   });
      // }

      this.dekeyStore.updateStore({ [ACTIVE_ACCOUNT]: account });

      this.updateConnectedDomains({
        account,
      });

      this.emit('account:changed');
    } catch (error) {
      // optimistic update
      this.dekeyStore.updateStore({
        [ACTIVE_ACCOUNT]: previousAccount,
      });
      throw error;
    }
  }

  userRegistered = async () => {
    try {
      const state = this.dekeyStore.getState();
      const user = state[USER] as UserModel;
      return {
        registered: (user && user.uid && user.accounts[0] && user.EncPV && true) || false,
      };
    } catch (error) {
      return {
        registered: false,
      };
    }
  };

  /** update eth balance and return it as ether unit */
  updateEthBalance = async (): Promise<string> => {
    try {
      const { activeAccount, assets } = this.dekeyStore.getState();

      const balance = await this.getBalance(activeAccount.ethAddress);
      const balanceAsEther = formatAmount(+balance, 4);
      assets[0].formattedBalance = balanceAsEther;
      assets[0].balance = balance;

      this.dekeyStore.updateStore({
        [ASSETS]: assets,
      });
      return balance;
    } catch (error) {
      throw error;
    }
  };

  updateUser = (updatedUser: UserModel) => {
    try {
      if (!updatedUser) {
        throw new Error(`updateUser is called with falsy value ${updatedUser}`);
      }
      const { user } = this.dekeyStore.getState();
      const newUser =
        user && user.EncPV
          ? {
              ...updatedUser,
              /** 멀티 브라우저 동기화 문제 해결 시 코멘트 풀어서 적용 */
              // twoFactorEnabled: existingUser.twoFactorEnabled,
              // twoFactorFreezeEndTime: existingUser.twoFactorFreezeEndTime,
              // twoFactorResetRetryCount: existingUser.twoFactorResetRetryCount,
              // twoFactorRetryFreezeEndTime:
              //   existingUser.twoFactorRetryFreezeEndTime,
              EncPV: user.EncPV,
            }
          : {
              ...updatedUser,
              // EncPV: updatedUser.EncPV,
            };

      this.dekeyStore.updateStore({ [USER]: newUser });
    } catch (error) {
      throw error;
    }
  };

  updateUserTwoFactorEnabled = (value: {
    twoFactorEnabled: boolean;
    twoFactorFreezeEndTime?: number;
    twoFactorResetRetryCount?: number;
    twoFactorRetryFreezeEndTime?: number;
  }) => {
    const { user } = this.dekeyStore.getState();

    if (user && user.EncPV) {
      this.dekeyStore.updateStore({
        [USER]: {
          ...user,
          ...value,
          EncPV: user.EncPV,
          // share: {
          //   ...user.share,
          //   EncPV: user.share.EncPV,
          // },
        },
      });
    } else {
      // 익스텐션 지우고 복구하는 경우
      return this.dekeyStore.updateStore({
        [USER]: { ...user, ...value },
      });
    }
  };

  // getCurrentTabDomainName = async () => {
  //   try {
  //     const tabs = await browser.tabs.query({
  //       active: true,
  //       currentWindow: true,
  //     });
  //
  //     const activeTab = tabs[0];
  //
  //     if (!activeTab?.url) {
  //       // throw new Error('No tab url');
  //       return '';
  //     }
  //
  //     // TODO: move this to util
  //     const url = activeTab.url;
  //     const splittedUrl = url.split('//');
  //     const protocol = splittedUrl ? splittedUrl[0] : '';
  //     const domain = splittedUrl && splittedUrl[1] ? splittedUrl[1].split('/')[0] : '';
  //     const domainName = `${protocol}//${domain}`;
  //
  //     return domainName;
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  lock = () => {
    try {
      this.dekeyStore.updateStore({
        locked: true,
        abcAuth: null,
      });

      this.emit('locked');

      // const autologinTimeout = accountRepository.getAutologinTimeout();
      // if (autologinTimeout) {
      //   clearTimeout(autologinTimeout);
      // }

      // provider.accountChanged([]);
    } catch (error) {
      throw error;
    }
  };

  addConnectedDomain = (domainName: string, iconUrl: string) => {
    try {
      const { connectedDomains, activeAccount } = this.dekeyStore.getState();

      const newItem = DappUtil.createConnectedDomain({
        connectedDomains,
        aaid: activeAccount.id,
        domainName,
        iconUrl,
      });

      // this.dekeyStore.pushToArray('connectedDomains', newItem);
      this.dekeyStore.updateStore({
        connectedDomains: [...connectedDomains, newItem],
      });
    } catch (error) {
      throw error;
    }
  };

  addAccountToConnectedDomain = async ({
    aaid,
    domainName,
  }: {
    aaid: number;
    domainName: string;
  }) => {
    try {
      const { connectedDomains, activeAccount } = this.dekeyStore.getState();

      const updatedConnectedDomains = DappUtil.addAccountToConnectedDomain({
        connectedDomains,
        domainName,
        aaid,
      });

      this.dekeyStore.updateStore({
        [CONNECTED_DOMAINS]: updatedConnectedDomains,
      });

      this.emit('accountsChanged', {
        domainName,
        accounts: [activeAccount.ethAddress],
      });

      // providerConnection.notifyConnections(domainName, {
      //   // method: NOTIFICATION_NAMES.accountsChanged,
      //   method: 'dekey_accountsChanged',
      //   params: [ethAddress],
      // });
    } catch (error) {
      throw error;
    }
  };

  // bOpenAccountConnectionPopup = async ({ accountId }) => {
  //   try {
  //     const { connectedDomains } = this.dekeyStore.getState();
  //
  //     if (!connectedDomains) {
  //       return false;
  //     }
  //     const domainName = await this.getCurrentTabDomainName();
  //     const connectedDomain = connectedDomains.find((d) => d.domainName === domainName);
  //     if (!connectedDomain) {
  //       return false;
  //     }
  //     return !connectedDomain.accountIds.includes(accountId);
  //   } catch (error) {
  //     return false;
  //   }
  // };

  unlock = async () => {
    this.emit('unlocked');
  };

  filterUserForUpdatingRedux = (user: UserModel) => {
    try {
      delete user.EncPV;
      return {
        ...user,
      };
    } catch (error) {
      throw error;
    }
  };

  getActiveAddress = () => {
    const state = this.dekeyStore.getState();
    const account = state[ACTIVE_ACCOUNT];

    return account.ethAddress;
  };

  getAllAccounts = () => {
    try {
      const { user, ledger } = this.dekeyStore.getState();

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

  syncUser = async () => {
    try {
      const result = await this.accountRestApi.getUser();
      if (!result) return;
      this.updateUser(result.user);
    } catch (error) {
      throw error;
    }
  };

  updateConnectedDomains = ({ account }: { account: Account }) => {
    try {
      const { connectedDomains } = this.dekeyStore.getState();
      if (!connectedDomains) {
        return;
      }

      const newConnectedDomains = this.dekeyStore.updateItem(
        'connectedDomains',
        () => ({ aaid: account.id }),
        (item: ConnectedDomainModel) => {
          return item?.accountIds?.includes(account.id);
        }
      );

      this.emit('updateConnectedDomains', {
        connectedDomains: newConnectedDomains,
        aaid: account.id,
        ethAddress: account.ethAddress,
      });
    } catch (error) {
      throw error;
    }
  };

  // async getBalance(address: string): Promise<string> {
  //   try {
  //     const balance = await this.providerService.getBalance(address);
  //     return ethers.utils.formatEther(balance);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // accountsChangedEvent(accounts, domainName = null) {
  //   log.info('accountsChangedEvent', {accounts, domainName});
  //   this.emit('accountsChanged', accounts, domainName);
  // }

  isUnlocked = async () => {
    const { locked } = this.dekeyStore.getState();
    return !locked;
  };

  getConnectedAccountsForDapp(domainName: string) {
    try {
      if (!domainName) {
        throw new Error('No domainName');
      }
      const { connectedDomains } = this.dekeyStore.getState();
      if (_.isEmpty(connectedDomains)) {
        return [];
      }
      const found = connectedDomains.find((elem) => elem.domainName === domainName);
      if (!found) {
        return [];
      }
      const accounts = this.getAllAccounts();
      const account = accounts.find((a) => a.id === found.aaid);
      if (!account) {
        return [];
      }

      return [account.ethAddress.toLowerCase()];
    } catch (error) {
      throw error;
    }
  }

  setRequestAccountData(val) {
    this._requestAccountData = {
      ...this._requestAccountData,
      ...val,
    };
  }

  getRequestAccountData() {
    if (!this._requestAccountData) {
      throw new Error('No _requestAccountData');
    }
    return this._requestAccountData;
  }

  getAccountById(accountId: number) {
    const accounts = this.getAllAccounts();
    return accounts.find((a) => a.id === accountId);
  }

  async getTotalAssetPrice() {
    const { assets, exchangeRates, currentNetwork, activeAccount } = this.dekeyStore.getState();
    const langs: CurrencyType[] = ['usd', 'krw', 'jpy'];
    const coingeckoNativeCurrencyId = getCoingeckoNetworkName(currentNetwork);

    const { balance } = assets[0]; // main asset balance

    const filteredAssets = assets
      .slice(1)
      .filter(
        (a) =>
          a.address?.toLowerCase() === activeAccount.ethAddress.toLowerCase() &&
          a.networkId === currentNetwork.id &&
          !a.hide
      );

    const ids = _getCoingeckoIds(filteredAssets, coingeckoNativeCurrencyId);
    const vsCurrencies = langs.reduce((prev, curr) => {
      return prev + `${curr},`;
    }, '');

    const coingeckoResponse = await this.accountRestApi.coingeckoSimplePrice({
      ids,
      vsCurrencies,
    });

    const [mainAssetBalanceAsUsd, mainAssetBalanceAsKrw, mainAssetBalanceAsJpy] = langs.map(
      (lang) => +balance * (coingeckoResponse[coingeckoNativeCurrencyId]?.[lang] || 0)
    );

    const [assetTotalPriceAsUsd, assetTotalPriceAsKrw, assetTotalPriceAsJpy] = _sumTokenValues(
      coingeckoResponse,
      coingeckoNativeCurrencyId,
      filteredAssets,
      langs
    );

    const totalAssetsValue = {
      usd: Decimal.add(assetTotalPriceAsUsd, new Decimal(mainAssetBalanceAsUsd))
        .toDecimalPlaces(6, Decimal.ROUND_UP)
        .toString(),
      krw: Decimal.add(assetTotalPriceAsKrw, new Decimal(mainAssetBalanceAsKrw))
        .toDecimalPlaces(6, Decimal.ROUND_UP)
        .toString(),
      jpy: Decimal.add(assetTotalPriceAsJpy, new Decimal(mainAssetBalanceAsJpy))
        .toDecimalPlaces(6, Decimal.ROUND_UP)
        .toString(),
    };

    this.dekeyStore.updateStore({
      totalAssetsValue,
      exchangeRates: {
        ...exchangeRates,
        ...coingeckoResponse,
      },
    });
  }
}

function _getCoingeckoIds(assets: AssetModel[], coingeckoNativeCurrencyId: string) {
  const coingeckoAssetIds = assets.reduce((acc, asset) => {
    const found = CoingeckoCoinList.find(
      (c) =>
        c.name.toLowerCase() === asset.name.toLowerCase() &&
        c.symbol.toLowerCase() === asset.symbol.toLowerCase()
    );

    if (found) {
      return { ...acc, [found.id]: asset };
    }

    return acc;
  }, {});

  return Object.keys(coingeckoAssetIds).reduce((acc, id) => {
    return acc + `${id},`;
  }, `${coingeckoNativeCurrencyId},`);
}

function _sumTokenValues(
  coingeckoResponse: CoingeckoSimplePriceResponse,
  coingeckoNativeCurrencyId: string,
  assets: AssetModel[],
  langs
) {
  const coingeckoAssetsMap = assets.reduce((acc, asset) => {
    const found = CoingeckoCoinList.find(
      (c) =>
        c.name.toLowerCase() === asset.name.toLowerCase() &&
        c.symbol.toLowerCase() === asset.symbol.toLowerCase()
    );

    if (found) {
      return { ...acc, [found.id]: asset };
    }
    return acc;
  }, {});

  const newCoingeckoResponse = {
    ...coingeckoResponse,
  };

  delete newCoingeckoResponse[coingeckoNativeCurrencyId];

  const assetNames = Object.keys(newCoingeckoResponse);

  const mapped = assetNames.map((assetName) => {
    const { balance } = coingeckoAssetsMap[assetName];

    return {
      ...newCoingeckoResponse[assetName],
      balance: balance || 0,
    };
  });

  return langs.map((lang) =>
    mapped.reduce((prev, curr) => {
      const value = Decimal.mul(curr[lang], curr.balance);
      return Decimal.add(prev, value);
    }, new Decimal(0))
  );
}
