import { AbcRestApi } from '../infra/rest-api/abc';
import AbcService from '../usecase/abc';
import PersonalMessage from '../main/personalMessage';
import AbcController from '../main/abc';
import { MpcService } from '../usecase/mpc';
import { AccountRestApi } from '../infra/rest-api/accounts';
import { AccountService } from '../usecase/accounts';
import AccountController from '../main/accounts';
import DappController from '../main/dapp';
import TypedMessageController from '../main/typedMessage';
import { DappService } from '../usecase/dapp';
import { NetworkService } from '../usecase/network';
import { TransactionService } from '../usecase/transaction';
import { ProviderConnectionManager } from '../usecase/provider/connectionManager';
import { ProviderService } from '../usecase/provider';
import { MutexService } from '../usecase/transaction/mutex';
import { TxQueueService } from '../usecase/transaction/queue';
import { NonceTracker } from '../usecase/transaction/nonceTracker';
import { GasFeeService } from '../usecase/gas/gasFee';
import { RuleService } from '../usecase/rule';
import { GasService } from '../usecase/gas';

const accountRestApi = new AccountRestApi();
const abcRestApi = new AbcRestApi();

const abcService = new AbcService(abcRestApi);
const mpcService = new MpcService();
const dappService = new DappService();
const accountService = new AccountService(accountRestApi);

const providerConnManager = new ProviderConnectionManager();
const providerService = new ProviderService(providerConnManager);
const networkService = new NetworkService(providerService);
const transactionService = new TransactionService(accountService);
const gasFeeService = new GasFeeService(providerConnManager);
const ruleService = new RuleService();
const gasService = new GasService(providerConnManager);
const txQueueService = new TxQueueService();
const nonceTracker = new NonceTracker(providerService);
const mutexService = new MutexService();

const services = {
  providerService,
  accountService,
  mpcService,
  networkService,
  transactionService,
  dappService,
  gasFeeService,
  ruleService,
  gasService,
  providerConnManager,
};

const abcController = new AbcController(abcRestApi, abcService);
const accountController = new AccountController(accountService, mpcService, accountRestApi);
const dappController = new DappController(
  dappService,
  networkService,
  accountService,
  transactionService,
  providerService,
  ruleService,
  gasService,
  txQueueService,
  nonceTracker,
  gasFeeService,
  mutexService
);
const personalMessageController = new PersonalMessage(mpcService, providerConnManager);
const typedMessageController = new TypedMessageController(mpcService);

const controllers = {
  abcController,
  accountController,
  dappController,
  typedMessageController,
  personalMessageController,
};

export { controllers, services, accountRestApi, nonceTracker };
