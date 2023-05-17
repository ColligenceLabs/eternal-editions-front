import { EventEmitter } from 'events';
import {
  UserModel,
  UnLockDto,
  RecoverDto,
  RecoverResult,
  UpdateAccountNameDto,
  AddAccountDto,
  ConnectAccountDto,
  GetConnectAccountPageData,
  GetLedgerAccountsWithBalanceResult,
  ChangeActiveAccountDto,
} from './interface';
import { AccountService } from '../../usecase/accounts';
import { MpcService } from '../../usecase/mpc';
import { AccountRestApi } from '../../infra/rest-api/accounts';

import { Wallet } from '../../schema/model';
import UserUtil from '../../utils/user';
import { mapDispatchToPropsFactory } from 'react-redux/es/connect/mapDispatchToProps';

import { setUser } from '../../../store/slices/user';
import { setWallet } from '../../../store/slices/wallet';
import { DekeyError, DekeyErrorTypes } from '../../utils/errorTypes';
import { CustomError } from '../../utils/error';
import { TwofaResetDto } from '../../schema/account';

import secureLocalStorage from 'react-secure-storage';

class AccountController extends EventEmitter {
  // platform: ExtensionPlatform;
  keyGenResult: undefined;
  recoverData: RecoverResult | undefined;
  password: string | undefined;
  // accountService: AccountService;
  // erc20Service: Erc20Service;
  // mpcService: MpcService;
  // transactionService: TransactionService;
  // dekeyStore: DekeyStore;
  // providerService: ProviderService;
  // ledgerService: LedgerService;
  // providerConnManager: ProviderConnectionManager;
  // providerConnection: ProviderConnection;
  // networkService: NetworkService;
  // accountRestApi: AccountRestApi;
  waitingForUnlock = [];

  constructor(
    private accountService: AccountService,
    // private erc20Service: Erc20Service,
    private mpcService: MpcService,
    // private transactionService: TransactionService,
    // private providerService: ProviderService,
    // private dekeyStore: DekeyStore,
    // private ledgerService: LedgerService,
    // private providerConnManager: ProviderConnectionManager,
    // private providerConnection: ProviderConnection,
    // private networkService: NetworkService,
    private accountRestApi: AccountRestApi // private triggerUi
  ) {
    super();

    // this.platform = new ExtensionPlatform();

    // this.accountService = container.resolve(AccountService);
    // this.erc20Service = container.resolve(Erc20Service);
    // this.mpcService = container.resolve(MpcService);
    // this.transactionService = container.resolve(TransactionService);
    // this.providerService = container.resolve(ProviderService);
    // this.dekeyStore = container.resolve(DekeyStore);
    // this.ledgerService = container.resolve(LedgerService);
    // this.providerConnManager = container.resolve(ProviderConnectionManager);
    // this.providerConnection = container.resolve(ProviderConnection);
    // this.networkService = container.resolve(NetworkService);
    // this.accountRestApi = container.resolve(AccountRestApi);

    // this.ledgerService.on(
    //   'account:changed',
    //   this.changeActiveAccount.bind(this)
    // );

    // this.accountService.on('account:changed', async () => {
    //   this.transactionService.syncIncomingTxs();
    //   await this.erc20Service.updateAssetBalances();
    //   this.accountService.getTotalAssetPrice();
    // });

    // this.accountService.on('unlocked', () => {
    //   this.handleUnlock();
    // });
  }

  async createMpcBaseAccount(data: AddAccountDto, dispatch: any) {
    try {
      await this.accountService.createMpcBaseAccount(data, this.mpcService, dispatch);
    } catch (err) {
      throw err;
    }
  }

  async recoverShare(
    dto: {
      password: string;
      user: UserModel;
      wallets: Wallet[];
      keepDB: boolean;
    },
    dispatch: any
  ): Promise<string | undefined> {
    try {
      const { password, user, wallets, keepDB } = dto;
      // const { abcAuth } = this.dekeyStore.getState();
      // const abcAuth = JSON.parse(window.localStorage.getItem('abcAuth')!)
      const abcAuth = JSON.parse(<string>secureLocalStorage.getItem('abcAuth')!);

      const sid = user.accounts[0].sid;
      const uid = user.uid;
      const nextWid = UserUtil.getNextWid(wallets);

      console.log('--- recoverShare ---', sid, uid, nextWid);
      const recoverData: RecoverResult = await this.mpcService.recoverShare({
        password,
        sid,
        uid,
        wid: nextWid,
        mpcToken: abcAuth.accessToken,
      });

      const { UCPubKey, OurPubKey, Sid, Uid, Wid, PVEncStr } = recoverData;
      console.log('--- recoverData ---', UCPubKey, OurPubKey, Sid, Uid, Wid, PVEncStr);

      const { wallet } = await this.accountRestApi.recover({
        ucPubkey: UCPubKey,
        uid: Uid,
        wid: Wid,
        iss: process.env.ISS,
      });

      user.EncPV = PVEncStr;
      console.log('===== recoverShare ===>', user, wallet);

      if (keepDB) {
        return;
      }

      await dispatch(setUser(user));
      await dispatch(setWallet(wallet));
      secureLocalStorage.setItem('abcUser', JSON.stringify(user));
      secureLocalStorage.setItem('abcWallets', JSON.stringify(wallet));

      this.accountService.initializeWalletAfterKeyGen({
        user,
        wallet,
      });
    } catch (error) {
      throw error;
    }
  }

  // @ts-ignore
  async verifyTwofactorForMpcSign({ twofaToken, jsonUnsignedTx }): Promise<string> {
    try {
      const { mpcToken } = await this.accountRestApi.verifyTwofactorForMpcSign({
        token: twofaToken,
        jsonUnsignedTx,
      });
      console.log('==========> verifyTwofactorForMpcSign 1===>', twofaToken);
      console.log('==========> verifyTwofactorForMpcSign 2===>', jsonUnsignedTx);
      console.log('==========> verifyTwofactorForMpcSign 3===>', mpcToken);
      // this.dekeyStore.updateStore({
      //   mpcToken,
      // });
      return mpcToken;
    } catch (error: any) {
      if (error?.name === DekeyErrorTypes.INVALID_UNSIGNED_TX_TO_HASH) {
        throw new CustomError(DekeyError.invalidUnsignedTxToHash(error.message));
      }
      throw new CustomError(DekeyError.twofaVerifyForMpcSign(error.message));
    }
  }

  async generateTwoFactor(dto: any) {
    try {
      return this.accountRestApi.generateTwoFactor(dto);
    } catch (error: any) {
      throw new CustomError(DekeyError.twofaGenQrcode(error.message));
    }
  }

  async verifyTwoFactorGen(payload: { token: string }) {
    try {
      // const state = this.dekeyStore.getState();

      const { twofaResetCode, user } = await this.accountRestApi.verifyTwofactorGen(payload);

      // this.dekeyStore.updateStore({
      //   user: {
      //     ...state.user,
      //     ...user,
      //     // twoFactorEnabled: true,
      //   },
      // });

      return twofaResetCode;

      // TODO: user.twoFactorEnabled 서버에서 받은 값을 넣을지 아니면 true를 바로 넣을지 결정
      // this.accountService.updateUserTwoFactorEnabled(user);
    } catch (error: any) {
      throw new CustomError(DekeyError.twofaGenVerify(error.message));
    }
  }

  async verifyTwoFactorGenReset(payload: { token: string; twofaResetAccessToken: string }) {
    try {
      // const state = this.dekeyStore.getState();

      const { twofaResetCode, user } = await this.accountRestApi.verifyTwoFactorResetGenVerify(
        payload
      );

      // this.dekeyStore.updateStore({
      //   user: {
      //     ...state.user,
      //     ...user,
      //   },
      // });

      return twofaResetCode;
    } catch (error: any) {
      throw new CustomError(DekeyError.twofaGenVerify(error.message));
    }
  }

  async resetTwoFa(dto: TwofaResetDto) {
    try {
      // const state = this.dekeyStore.getState();

      const { success, user, accessToken } = await this.accountRestApi.resetTwofactor(dto);

      // TODO: user.twoFactorEnabled 서버로 부터 받은 값을 넣을지 아니면 false를 바로 넣을지 결정
      // this.accountService.updateUserTwoFactorEnabled(user);

      // TODO : Peter H. Nahm 확인 필요함....
      // this.accountService.updateUser(user);

      if (!success) {
        throw new Error();
      }

      return {
        accessToken,
        user,
        // success,
        // data: {
        //   resetRetryCount: user.twoFactorResetRetryCount,
        //   retryFreezeEndTime: user.twoFactorRetryFreezeEndTime,
        // },
      };
    } catch (error) {
      throw error;
      // return {
      //   success: false,
      // };
    }
  }

  async unlock(dto: UnLockDto, user: any) {
    try {
      const { password } = dto;

      // const {user} = this.dekeyStore.getState();
      const sid = user.accounts[0].sid;

      // const {hashMessage} = await this.accountRestApi.getChallengeMessage({
      //   sid,
      // });

      const dummyHashMessage = 'ca957bdb7fbed31dacc967fd3c590c0ef7f8610b84d5f37e764987c1bed87fb3';

      const { SigR, SigS } = await this.mpcService.unlock({
        hashMessage: dummyHashMessage,
        EncPV: user.EncPV,
        password,
      });

      // this.dekeyStore.updateStore({
      //   locked: false,
      // });

      await this.accountService.unlock();

      // await this.mpcService.unlock({
      //   hashMessage,
      //   EncPV: user.EncPV,
      //   password,
      // });

      if (this.waitingForUnlock.length > 0) {
        while (this.waitingForUnlock.length > 0) {
          // @ts-ignore
          this.waitingForUnlock.shift().resolve(true);
        }
      }
    } catch (error) {
      throw error;
    }
  }
}

export default AccountController;
