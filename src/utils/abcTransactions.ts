import { makeTxData } from './makeTxData';
import tokenAbi from '../config/abi/ERC20Token.json';
import { controllers, nonceTracker, services } from '../abc/background/init';
import { TxParams } from '../abc/main/transactions/interface';
import { isKlaytn } from '../abc/utils/network';
import KlaytnUtil from '../abc/utils/klaytn';
import TransactionUtil from '../abc/utils/transaction';
import { DekeyData } from '../abc/dekeyData';
import personalMessage from '../abc/main/personalMessage';
import typedMessage from '../abc/main/typedMessage';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const abcSendTx = async (
  twofaToken: string,
  to: string,
  method: string,
  txArgs: any,
  user: any
): Promise<number> => {
  const { abcController, accountController } = controllers;
  const { mpcService, providerService, providerConnManager } = services;

  // console.log(`abc token : ${twofaToken}`);

  // TODO : AbcWallet Test => Transfer 0.01 USDC to a wallet

  // 1. 블록체인 네트워크 연결
  const networks = DekeyData.DEFAULT_NETWORKS;
  await providerService.connect(networks[7], ''); // use Polygon Testnet
  // await providerConnManager.connect(networks[7], '');

  // 2. Active Account
  // @ts-ignore
  const account = user.accounts[0];
  console.log('=== account ===>', account);

  // 3. Target Smart Contract
  // const to = '0xaF07aC23189718a3b570C73Ccd9cD9C82B16b867'; // Test USDC Smart Contract

  // 4. 트랜잭션 Data 생성
  // const data = makeTxData(tokenAbi, 'approve', [
  //   '0x1716C4d49E9D81c17608CD9a45b1023ac9DF6c73',
  //   '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  // ]);
  // const data = makeTxData(tokenAbi, 'transfer', [
  //   '0x1716C4d49E9D81c17608CD9a45b1023ac9DF6c73', // Recipient
  //   ethers.utils.parseUnits('0.01', 6), // Amount, USDC decimal = 6
  // ]); // Method name & arguments
  const data = makeTxData(tokenAbi, method, txArgs); // Method name & arguments
  console.log('====>', data);

  // 5. nonce 확인
  const { nextNonce } = await nonceTracker.getNetworkNonce(account.ethAddress);
  console.log('==== nextNonce ===>', nextNonce);

  // 6. unSignedTx 생성
  const txParams: TxParams = {
    chainId: 80001,
    data,
    gasLimit: '0x010cd2',
    gasPrice: '0x0ba43b7400',
    to,
    nonce: nextNonce,
  };

  // const txParams = {
  //   chainId: 1001,
  //   data: '0x4e71d92d',
  //   // from: '0xbef6de269b0f4aa8435f7f4d345be68131ba14c3',
  //   // gas: '0x44819',
  //   gasLimit: '0x0440af',
  //   gasPrice: '0x0ba43b7400',
  //   to: '0xa97d236bb35a26b1bf329e096aa18d40ea337342',
  //   nonce: nextNonce,
  // };
  // const unSignedTx = {
  //   chainId: 1001,
  //   gasLimit: '0x04cfe8',
  //   gasPrice: '0x0ba43b7400',
  //   data: '0x85be1b3b00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001',
  //   to: '0xf8e62f89bb0c37e0fa12fda659add38f7f42bc98',
  //   value: '0x11fc51222ce8000',
  //   nonce: '0x0b',
  // };

  // 7. 구글 OTP -> mpcToken 획득
  const mpcToken = await accountController.verifyTwofactorForMpcSign({
    twofaToken,
    jsonUnsignedTx: JSON.stringify(txParams),
  });
  console.log('===== mpcToken ===>', mpcToken);

  // 8. Target Sign Message
  const messageHash =
    isKlaytn(txParams.chainId) && txParams?.type
      ? KlaytnUtil.createTxHash(txParams)
      : TransactionUtil.createTxHash(txParams);
  console.log('=== messageHash ===>', messageHash);

  await accountController.unlock({ password: '!owdin001' }, user);

  // 9. TX Signing
  const sResult = await mpcService.sign({
    txHash: messageHash.slice(2),
    mpcToken,
    accountId: account.id,
  });
  console.log('=== sResult ===>', sResult);

  const { r, s, vsource } = sResult;
  const v = TransactionUtil.calculateV({
    r,
    s,
    vsource,
    hash: messageHash,
    address: account.ethAddress,
    chainId: txParams.chainId,
  });

  // 10. signed Raw Tx
  // @ts-ignore
  const rawTx =
    isKlaytn(txParams.chainId) && txParams?.type
      ? await KlaytnUtil.createRawTx({ txParams, v, r, s })
      : TransactionUtil.createRawTx({ txParams, v, r, s });
  console.log('==== rawTx ===>', rawTx);

  // 11. Broadcast signed raw Tx to the chain
  const txHash = await providerConnManager.broadcastTx(rawTx, undefined, undefined);
  console.log('=====> result: txHash ===>', txHash);

  // TODO : 왜 await 가 안되고 바로 null 이 return 될까?
  await sleep(5000);
  const receipt = await providerService.getTransactionReceipt(txHash, txParams.chainId);
  console.log('=====> result: receipt ===>', receipt);

  return receipt?.status;
};

export const signPersonalMessage = async (
  txData: any,
  user: any,
  accToken: string
): Promise<void | string> => {
  const { personalMessageController } = controllers;

  return await personalMessageController.signPersonalMessage(txData, user.accounts[0], accToken);
};

export const signTypedData = async (txData: any, user: any): Promise<void | string> => {
  const { typedMessageController } = controllers;

  return await typedMessageController.signTypedMessage(txData, user.accounts[0]);
};
