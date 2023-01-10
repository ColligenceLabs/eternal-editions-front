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

class AccountController extends EventEmitter {
  // platform: ExtensionPlatform;
  keyGenResult;
  recoverData: RecoverResult;
  password: string;
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

  async recoverShare(
    dto: {
      password: string;
      user: UserModel;
      wallets: Wallet[];
      keepDB: boolean;
    },
    dispatch: any
  ): Promise<string> {
    try {
      const { password, user, wallets, keepDB } = dto;
      // const { abcAuth } = this.dekeyStore.getState();
      const abcAuth = JSON.parse(window.localStorage.getItem('abcAuth')!);

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

      this.accountService.initializeWalletAfterKeyGen({
        user,
        wallet,
      });
    } catch (error) {
      throw error;
    }
  }

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
}

export default AccountController;
