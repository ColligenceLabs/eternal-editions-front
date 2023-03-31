// next
import NextLink from 'next/link';
// @mui
import _ from 'lodash';
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

import { checkWasm } from '../../abc/sandbox';

import secureLocalStorage from 'react-secure-storage';
import { TxParams } from '../../abc/main/transactions/interface';
import useAccount from '../../hooks/useAccount';
import { abcSendTx } from '../../utils/abcTransactions';
import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import { abcLogin, requestWalletLogin } from '../../services/services';
import tokenAbi from '../../config/abi/ERC20Token.json';
import { tokenize } from 'protobufjs';
import { AbcLoginResponse } from '../../abc/schema/account';

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
  const { account } = useAccount();
  const { library, deactivate } = useActiveWeb3React();
  const dispatch = useDispatch();
  const webUser = useSelector((state: any) => state.webUser);
  // const abcAccount = useSelector((state: any) => state.user);
  // console.log(abcAccount.accounts[0].ethAddress);
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

  const abcUser = useSelector((state: any) => state.user);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const abcSnsLogin = async () => {
    // ABC Wallet Test
    console.log('!! start sns login !!');
    // // const dto: AbcLoginDto = { username: 'hwnahm@gmail.com', password: '!owdin001' };
    // // const abcAuth: AbcLoginResult = await abcController.login(dto);
    // const abcAuth: AbcLoginResult = await abcController.snsLogin(
    //   webUser?.user?.session?.providerAuthInfo?.provider_token,
    //   webUser?.user?.session?.providerAuthInfo?.provider
    // );
    // console.log('===>', webUser?.user?.session?.providerAuthInfo?.provider_token);
    // console.log('===>', webUser?.user?.session?.providerAuthInfo?.provider);
    const res = await abcLogin({
      token: webUser?.user?.session?.providerAuthInfo?.provider_token,
      service: webUser?.user?.session?.providerAuthInfo?.provider,
      audience: 'https://mw.myabcwallet.com',
    });
    console.log('!! abcLogin Result : ', res.data);
    if (
      res.data !== null &&
      res.data !== undefined &&
      res.data.data !== null &&
      res.data.error === undefined
    ) {
      const resData = AbcLoginResponse.parse(res.data);
      const abcAuth: AbcLoginResult = {
        accessToken: resData.access_token,
        refreshToken: resData.refresh_token,
        tokenType: resData.token_type,
        expiresIn: resData.expire_in,
      };
      await dispatch(setAbcAuth(abcAuth));

      // window.localStorage.setItem('abcAuth', JSON.stringify(abcAuth));
      secureLocalStorage.setItem('abcAuth', JSON.stringify(abcAuth));

      const { user, wallets } = await accountRestApi.getWalletsAndUserByAbcUid(abcAuth);
      setUser(user);

      await accountController.recoverShare(
        { password: '!owdin001', user, wallets, keepDB: false },
        dispatch
      );
    }
  };

  useEffect(() => {
    if (webUser?.user?.session?.providerAuthInfo?.provider_token !== '' && temp) {
      if (_.isEmpty(abcUser) || abcUser.uid === '') {
        abcSnsLogin();
      }
    }
  }, [webUser, temp, abcUser]);

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

  // useEffect(() => {
  //   const walletLogin = async () => {
  //     if (!library) return;
  //     const target_copy = Object.assign({}, library.provider);
  //     const isAbc = target_copy.isABC === true;
  //     // const isKaikas = typeof target_copy._kaikas !== 'undefined';
  //     let signature;
  //     const message = `apps.talken.io wants you to sign in with your Ethereum account.
  //
  // Talken Drops Signature Request
  //
  // Type: Login request`;
  //     // if (isKaikas) {
  //     //   const caver = new Caver(window.klaytn);
  //     //   signature = await caver.klay.sign(message, account ?? '').catch(() => deactivate());
  //     // } else {
  //     //   signature = await library
  //     //     .getSigner()
  //     //     .signMessage(message)
  //     //     .catch(() => deactivate());
  //     // }
  //     signature = await library
  //       .getSigner()
  //       .signMessage(message)
  //       .catch(() => deactivate());
  //     if (!signature) return; // 서명 거부
  //     // const data = { message, signature, isKaikas, isAbc };
  //     const data = { message, signature, isAbc };
  //     const res = await requestWalletLogin(data);
  //     console.log(res);
  //     if (res.data === 'loginSuccess') location.replace('/');
  //     if (res.data === 'User not found!') {
  //       deactivate();
  //       window.localStorage.removeItem('loginBy');
  //       alert('Please continue with SNS and register wallet address on My Profile page.');
  //     }
  //     // setDoSign(false);
  //   };
  //
  //   walletLogin();
  // }, [library]);

  const handleAbcConfirmClick = async () => {
    console.log(`abc token : ${abcToken}`); // Google OTP

    const to = '0xaF07aC23189718a3b570C73Ccd9cD9C82B16b867'; // Test USDC Smart Contract
    const method = 'transfer';
    const txArgs = [
      '0x1716C4d49E9D81c17608CD9a45b1023ac9DF6c73', // Recipient
      ethers.utils.parseUnits('0.01', 6), // Amount, USDC decimal = 6
    ];
    const result: any = await abcSendTx(abcToken, to, tokenAbi, method, txArgs, abcUser);
    console.log('== tx result ==', result.status);
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
  // const { account } = useWeb3React();
  const triedEager = useEagerConnect();
  // useInactiveListener(!triedEager || !!activatingConnector);
  useInactiveListener(!triedEager);
  const isLight = theme.palette.mode === 'light';

  const isScrolling = useOffSetTop(HEADER_DESKTOP_HEIGHT);

  useEffect(() => {
    console.log(account);
  }, [account]);

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

            {isDesktop && <></>}
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
                {isDesktop && (
                  <Button
                    variant="contained"
                    onClick={() => handleJoinOpen()}
                    sx={{
                      width: {
                        md: 120,
                      },
                      color: 'white'
                    }}
                  >
                    SIGN UP
                  </Button>
                )}
              </>
            )}
            {/*<Button*/}
            {/*  variant="contained"*/}
            {/*  onClick={handleAbcOpen}*/}
            {/*  sx={{*/}
            {/*    width: {*/}
            {/*      md: 120,*/}
            {/*    },*/}
            {/*  }}*/}
            {/*>*/}
            {/*  ABC Test*/}
            {/*</Button>*/}
          </Stack>
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
            <SignUp hideSns={false} onClose={handleJoinClose} />
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
