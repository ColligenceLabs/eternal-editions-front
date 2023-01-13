// next
import NextLink from 'next/link';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Stack,
  Button,
  AppBar,
  Divider,
  Container,
  Link,
  Modal,
  Backdrop,
  Fade,
  Input,
  TextField,
} from '@mui/material';
// hooks
import { useOffSetTop, useResponsive } from '../../hooks';
// routes
import Routes from '../../routes';
// config
import { HEADER_DESKTOP_HEIGHT } from '../../config';
// components
import { Logo, Label, Image } from '../../components';
//
import Searchbar from '../Searchbar';
import LanguagePopover from '../LanguagePopover';
import { NavMobile, NavDesktop, navConfig } from '../nav';
import { ToolbarStyle, ToolbarShadowStyle } from './HeaderToolbarStyle';
import useWallets from '../../hooks/useWallets';
import { getIconByType } from '../../utils/wallet';
import React, { ChangeEvent, useEffect } from 'react';
import { ConnectWallet, DisconnectWallet } from '../../components/wallet';
import { SignUp } from '../../components/user';
import WalletPopover from '../../components/WalletPopover';
import { useWeb3React } from '@web3-react/core';
import { useEagerConnect, useInactiveListener } from '../../hooks/useEagerConnect';

// TODO : dkeys WASM Go Initialize...
import '../../abc/sandbox/index';

import { controllers, accountRestApi, services, nonceTracker } from '../../abc/background/init';
import { AbcLoginDto, AbcLoginResult } from '../../abc/main/abc/interface';
import { setAbcAuth } from '../../store/slices/abcAuth';
import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';
import TransactionUtil from '../../abc/utils/transaction';
import KlaytnUtil from '../../abc/utils/klaytn';
import { isKlaytn } from '../../abc/utils/network';
import { DekeyData } from '../../abc/dekeyData';
import { makeTxData } from '../../utils/makeTxData';

import tokenAbi from '../../config/abi/ERC20Token.json';
import { checkWasm } from '../../abc/sandbox';

const modalStyle = {
  position: 'absolute',
  top: '30%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'common.white',
  color: 'common.black',
  boxShadow: 24,
  p: 4,
  borderRadius: '24px',
};

// ----------------------------------------------------------------------

type Props = {
  transparent?: boolean;
};

export default function Header({ transparent }: Props) {
  const { abcController, accountController } = controllers;
  const { mpcService, providerService, providerConnManager } = services;
  const dispatch = useDispatch();
  const webUser = useSelector((state: any) => state.webUser);

  const theme = useTheme();

  const isDesktop = useResponsive('up', 'md');

  const [connectOpen, setConnectOpen] = React.useState(false);
  const handleConnectOpen = () => setConnectOpen(true);
  const handleConnectClose = () => setConnectOpen(false);

  const [disconnectOpen, setDisconnectOpen] = React.useState(false);
  const handleDisconnectOpen = () => setDisconnectOpen(true);
  const handleDisconnectClose = () => setDisconnectOpen(false);

  const [joinOpen, setJoinOpen] = React.useState(false);
  const [abcOpen, setAbcOpen] = React.useState(false);
  const [abcToken, setAbcToken] = React.useState('');
  const [user, setUser] = React.useState([]);
  const [temp, setTemp] = React.useState(false);
  const [intervalTime, setIntervalTime] = React.useState(1000);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const abcSnsLogin = async () => {
    // ABC Wallet Test
    console.log('!! start sns login !!');
    // const dto: AbcLoginDto = { username: 'hwnahm@gmail.com', password: '!owdin001' };
    // const abcAuth: AbcLoginResult = await abcController.login(dto);
    const abcAuth: AbcLoginResult = await abcController.snsLogin(
      webUser?.user?.session?.providerAuthInfo?.provider_token,
      webUser?.user?.session?.providerAuthInfo?.provider
    );
    await dispatch(setAbcAuth(abcAuth));

    window.localStorage.setItem('abcAuth', JSON.stringify(abcAuth));

    const { user, wallets } = await accountRestApi.getWalletsAndUserByAbcUid(abcAuth);
    setUser(user);

    await accountController.recoverShare(
      { password: '!owdin001', user, wallets, undefined },
      dispatch
    );
  };

  useEffect(() => {
    if (webUser?.user?.session?.providerAuthInfo?.provider_token !== '' && temp) {
      abcSnsLogin();
    }
  }, [webUser, temp]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!temp) {
        const result = checkWasm();
        setTemp(result);
        setIntervalTime(86400000);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [intervalTime]);

  const handleAbcConfirmClick = async () => {
    // console.log(`abc token : ${abcToken}`);

    // TODO : AbcWallet Test => Transfer 0.01 USDC to a wallet

    // 1. 블록체인 네트워크 연결
    const networks = DekeyData.DEFAULT_NETWORKS;
    await providerService.connect(networks[7], ''); // use Polygon Testnet
    // await providerConnManager.connect(networks[7], '');

    // 2. Active Account
    const account = user.accounts[0];
    console.log('=== account ===>', account);

    // 3. Target Smart Contract
    const to = '0xaF07aC23189718a3b570C73Ccd9cD9C82B16b867'; // Test USDC Smart Contract

    // 4. 트랜잭션 Data 생성
    // const data = makeTxData(tokenAbi, 'approve', [
    //   '0x1716C4d49E9D81c17608CD9a45b1023ac9DF6c73',
    //   '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    // ]);
    const data = makeTxData(tokenAbi, 'transfer', [
      '0x1716C4d49E9D81c17608CD9a45b1023ac9DF6c73', // Recipient
      ethers.utils.parseUnits('0.01', 6), // Amount, USDC decimal = 6
    ]); // Method name & arguments
    console.log('====>', data);

    // 5. nonce 확인
    const { nextNonce } = await nonceTracker.getNetworkNonce(account.ethAddress);
    console.log('==== nextNonce ===>', nextNonce);

    // 6. unSignedTx 생성
    const txParams = {
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
    const twofaToken = abcToken;
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
    const rawTx =
      isKlaytn(txParams.chainId) && txParams?.type
        ? await KlaytnUtil.createRawTx({ txParams, v, r, s })
        : TransactionUtil.createRawTx({ txParams, v, r, s });
    console.log('==== rawTx ===>', rawTx);

    // 11. Broadcast signed raw Tx to the chain
    const txHash = await providerConnManager.broadcastTx(rawTx, undefined, undefined);
    console.log('=====> result: txHash ===>', txHash);

    // TODO : 왜 await 가 안되고 바로 null 이 return 될까?
    await sleep(3000);
    const receipt = await providerService.getTransactionReceipt(txHash, txParams.chainId);
    console.log('=====> result: receipt ===>', receipt);

    setAbcToken('');
    setAbcOpen(false);
  };

  const handleAbcTokenChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { value } = event.target;
    setAbcToken(value);
    // console.log(value);
  };
  const handleAbcClose = () => {
    setAbcToken('');
    setAbcOpen(false);
  };

  const handleAbcOpen = () => {
    setAbcOpen(true);
  };

  const handleJoinOpen = async () => {
    setJoinOpen(true);
  };

  const handleJoinClose = () => setJoinOpen(false);

  // const {account, accountShot, type, disconnect} = useWallets();
  const { account } = useWeb3React();
  const triedEager = useEagerConnect();
  // useInactiveListener(!triedEager || !!activatingConnector);
  useInactiveListener(!triedEager);
  const isLight = theme.palette.mode === 'light';

  const isScrolling = useOffSetTop(HEADER_DESKTOP_HEIGHT);

  return (
    <AppBar sx={{ boxShadow: 0, bgcolor: 'transparent' }}>
      <ToolbarStyle disableGutters transparent={transparent} scrolling={isScrolling}>
        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <Box sx={{ lineHeight: 0, position: 'relative' }}>
            <Logo onDark={transparent && !isScrolling} />
          </Box>

          {isDesktop && (
            <NavDesktop
              isScrolling={isScrolling}
              isTransparent={transparent}
              navConfig={navConfig}
            />
          )}

          {/*<Box sx={{flexGrow: 1}}/>*/}

          <Stack spacing={2} direction="row" alignItems="center">
            {/*<Searchbar*/}
            {/*    sx={{*/}
            {/*        ...(isScrolling && {color: 'text.primary'}),*/}
            {/*    }}*/}
            {/*/>*/}

            {/*<LanguagePopover*/}
            {/*  sx={{*/}
            {/*    ...(isScrolling && { color: 'text.primary' }),*/}
            {/*  }}*/}
            {/*/>*/}

            {/*<Divider orientation="vertical" sx={{height: 24}}/>*/}

            {isDesktop && (
              <Stack direction="row" spacing={1}>
                {/*<NextLink href={Routes.registerIllustration} prefetch={false} passHref>*/}
                {/*<Button*/}
                {/*  color="inherit"*/}
                {/*  variant="outlined"*/}
                {/*  sx={{*/}
                {/*    ...(transparent && {*/}
                {/*      color: 'common.white',*/}
                {/*    }),*/}
                {/*    ...(isScrolling && isLight && { color: 'text.primary' }),*/}
                {/*  }}*/}
                {/*>*/}
                {/*  Join Us*/}
                {/*</Button>*/}
                {/*</NextLink>*/}

                {/*<Button variant="contained" href={'/'} target="_blank" rel="noopener">*/}
                {/*    Connect Wallet*/}
                {/*</Button>*/}

                {/* 지갑 연동 */}

                {account ? (
                  <>
                    <WalletPopover />
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => handleJoinOpen()}
                      sx={{
                        width: {
                          md: 120,
                        },
                      }}
                    >
                      SIGN UP
                    </Button>
                  </>
                )}
                <Button
                  variant="contained"
                  onClick={handleAbcOpen}
                  sx={{
                    width: {
                      md: 120,
                    },
                  }}
                >
                  ABC Test
                </Button>
              </Stack>
            )}
          </Stack>

          {!isDesktop && (
            <NavMobile
              navConfig={navConfig}
              sx={{
                ml: 1,
                ...(isScrolling && { color: 'text.primary' }),
              }}
            />
          )}
        </Container>
      </ToolbarStyle>

      {isScrolling && <ToolbarShadowStyle />}

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={connectOpen}
        onClose={handleConnectClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={connectOpen}>
          <Box sx={modalStyle}>
            <ConnectWallet onClose={handleConnectClose} />
          </Box>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={disconnectOpen}
        onClose={handleDisconnectClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={disconnectOpen}>
          <Box sx={modalStyle}>
            <DisconnectWallet onClose={handleDisconnectClose} />
          </Box>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={joinOpen}
        onClose={handleJoinClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={joinOpen}>
          <Box sx={modalStyle}>
            <SignUp onClose={handleJoinClose} />
          </Box>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={abcOpen}
        onClose={handleAbcClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={abcOpen}>
          <Box sx={modalStyle}>
            구글 OTP 인증 :
            <Input
              sx={{ color: 'black' }}
              fullWidth={true}
              id="outlined-basic"
              value={abcToken}
              onChange={handleAbcTokenChange}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: '10px' }}>
              <Button
                variant="outlined"
                size="medium"
                sx={{
                  width: '100% !important',
                  height: '36px',
                  fontSize: 12,
                  backgroundColor: '#f1f2f5',
                  borderColor: '#f1f2f5',
                  color: '#000000',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#08FF0C',
                    borderColor: '#08FF0C',
                    color: '#ffffff',
                    boxShadow: 'none',
                  },
                  '&:active': {
                    boxShadow: 'none',
                    backgroundColor: 'background.paper',
                    borderColor: 'background.paper',
                    color: '#ffffff',
                  },
                }}
                onClick={handleAbcConfirmClick}
              >
                확인
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </AppBar>
  );
}
