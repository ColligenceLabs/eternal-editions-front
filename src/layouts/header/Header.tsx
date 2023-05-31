import {
  AppBar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Fade,
  Input,
  Modal,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ethers } from 'ethers';
import _ from 'lodash';
import React, { ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import secureLocalStorage from 'react-secure-storage';
import { Logo } from 'src/components';
import WalletPopover from 'src/components/WalletPopover';
import { SignUp } from 'src/components/user';
import { ConnectWallet, DisconnectWallet } from 'src/components/wallet';
import { accountRestApi, controllers, services } from '../../abc/background/init';
import { AbcLoginResult } from '../../abc/main/abc/interface';
import { checkWasm } from '../../abc/sandbox';
import '../../abc/sandbox/index';
import { AbcLoginResponse } from '../../abc/schema/account';
import { HEADER_DESKTOP_HEIGHT } from '../../config';
import tokenAbi from '../../config/abi/ERC20Token.json';
import { useOffSetTop, useResponsive } from '../../hooks';
import useAccount from '../../hooks/useAccount';
import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import { useEagerConnect, useInactiveListener } from '../../hooks/useEagerConnect';
import { abcLogin, getSession } from '../../services/services';
import { setAbcAuth } from '../../store/slices/abcAuth';
import { abcSendTx } from '../../utils/abcTransactions';
import { NavDesktop, NavMobile, navConfig } from '../nav';
import { ToolbarShadowStyle, ToolbarStyle } from './HeaderToolbarStyle';
import onLogin, { setOnLogin } from 'src/store/slices/onLogin';

import { AbcWeb3Provider } from '@colligence/klip-web3-provider';
import Web3Modal from '@colligence/web3modal';

// TODO : dkeys WASM Go Initialize...
import 'src/abc/sandbox/index';
import { approve } from 'src/utils/abcProviderTxs';
import ModalCustom from 'src/components/common/ModalCustom';
import { setWallet } from 'src/store/slices/wallet';
import { setUser } from 'src/store/slices/user';

const modalStyle = {
  position: 'absolute',
  top: '30%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'common.white',
  color: 'common.black',
  p: 3,
  boxShadow: 24,
  borderRadius: '24px',
  width: 'min(100%, 400px)',
};

// ----------------------------------------------------------------------

type Props = {
  transparent?: boolean;
  sx?: object;
};

export default function Header({ transparent, sx }: Props) {
  const { abcController, accountController } = controllers;
  const { mpcService, providerService, providerConnManager } = services;
  const { account } = useAccount();
  const { library, deactivate } = useActiveWeb3React();
  const dispatch = useDispatch();
  const webUser = useSelector((state: any) => state.webUser);
  const { onLogin } = useSelector((state: any) => state.onLogin);
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
  // const [user, setUser] = React.useState([]); // TODO : redux 와 중복... 쓰는 곳이 없어서...
  const [temp, setTemp] = React.useState(false);
  const [intervalTime, setIntervalTime] = React.useState(1000);

  const abcUser = useSelector((state: any) => state.user);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const abcSnsLogin = async () => {
    try {
      await dispatch(setOnLogin(true));
      console.log('!! start sns login !!');
      const res = await abcLogin({
        token: webUser?.user?.session?.providerAuthInfo?.provider_token,
        service: webUser?.user?.session?.providerAuthInfo?.provider,
        audience: 'https://mw.myabcwallet.com',
      });
      console.log('!! abcLogin Result : ', res.data.code);
      if (res.data.code !== 618 && res.data.data !== null && res.data.error === undefined) {
        const resData = AbcLoginResponse.parse(res.data);
        const abcAuth: AbcLoginResult = {
          accessToken: resData.access_token,
          refreshToken: resData.refresh_token,
          tokenType: resData.token_type,
          expiresIn: resData.expire_in,
        };
        await dispatch(setAbcAuth(abcAuth));
        secureLocalStorage.setItem('abcAuth', JSON.stringify(abcAuth));

        const { user, wallets } = await accountRestApi.getWalletsAndUserByAbcUid(abcAuth);
        console.log('=== header ====> ', user, wallets);
        // setUser(user); // TODO : redux 와 중복... 쓰는 곳이 없어서...

        if (user === null) {
          // TODO : 특이 케이스. ABC 가입은 되었으나 MPC 지갑이 만들어 지지 않은 경우...
          const rlt = await getSession();
          if (rlt.data?.providerAuthInfo) {
            // TODO: abc-web3-provider 초기화
            const data = JSON.parse(rlt.data?.providerAuthInfo?.provider_data);
            const email = data.email;
            // MPC 지갑 생성
            await accountController.createMpcBaseAccount(
              {
                accountName: email,
                password: '!owdin001',
                email: email,
              },
              dispatch
            );
          }
        }

        if (user) {
          if (user?.twoFactorEnabled) {
            await accountController.recoverShare(
              { password: '!owdin001', user, wallets, keepDB: false },
              dispatch
            );
          } else {
            await dispatch(setUser(user));
            await dispatch(setWallet(wallets));
          }
        }

        const rlt = await getSession();
        if (rlt.data?.providerAuthInfo) {
          // TODO: abc-web3-provider 초기화
          const id_token = rlt.data?.providerAuthInfo?.provider_token;
          const service = rlt.data?.providerAuthInfo?.provider;
          const data = JSON.parse(rlt.data?.providerAuthInfo?.provider_data);
          const email = data.email;
          console.log(service, id_token, data.email);

          try {
            const providerOptions = {
              abc: {
                package: AbcWeb3Provider, //required
                options: {
                  bappName: 'web3Modal Example App', //required
                  chainId: '0x13881',
                  rpcUrl: 'https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78', //required
                  email,
                  id_token,
                  serv: service,
                },
              },
            };
            const web3Modal = new Web3Modal({
              providerOptions: providerOptions, //required
            });

            // Connect Wallet
            const instance = await web3Modal.connect();

            if (instance) {
              const abcUser = JSON.parse(secureLocalStorage.getItem('abcUser') as string);
              console.log('==========================', abcUser);
              console.log(
                '=============>',
                abcUser && abcUser?.accounts ? abcUser?.accounts[0].ethAddress : 'No ethAddress'
              );

              const provider = new ethers.providers.Web3Provider(instance);
              // // await provider.enable();
              // const signer = provider.getSigner();
              // console.log('=============>', signer);
              //
              // const rltApprove = await approve(
              //     '0xae16Dd27539a255A43596481d0F0824ceD8170e1', // Test USDT
              //     '0x2BD1F8FF37A69937fDF6272504668F750008376B',
              //     '0.1',
              //     '0x574caab053de2e7accfb088fb6c2bca3e335c4a0',
              //     signer
              // );
              // if (rltApprove === 1) alert('Approve ... Success');
              // else alert('Approve ... Failed');
            }
          } catch (err) {
            console.log('!! AbcWeb3Provider 초기화 실패');
          }
        }
      }
    } catch (e) {
      console.log('------------------------');
      console.log(e);
    } finally {
      await dispatch(setOnLogin(false));
    }
  };

  useEffect(() => {
    const loginBy = localStorage.getItem('loginBy');
    console.log('!! login type = ', loginBy);
    if (
      loginBy !== 'password' &&
      webUser?.user?.session?.providerAuthInfo?.provider_token !== '' &&
      temp
    ) {
      if (_.isEmpty(abcUser) || abcUser.uid === '') {
        try {
          abcSnsLogin();
        } catch (err) {
          console.log('!! header abcSnsLogin error = ', err);
        }
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
  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager);
  const isLight = theme.palette.mode === 'light';
  const isScrolling = useOffSetTop(HEADER_DESKTOP_HEIGHT);

  return (
    <AppBar sx={{ boxShadow: 0, backgroundColor: 'transparent', ...sx }}>
      <ToolbarStyle disableGutters transparent={transparent} scrolling={isScrolling}>
        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
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

          <Stack spacing={2} direction="row" alignItems="center">
            {isDesktop && <></>}
          </Stack>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Stack direction="row" spacing={1}>
              {account ? (
                <>
                  <WalletPopover />
                </>
              ) : onLogin ? (
                <CircularProgress size={25} color="secondary" />
              ) : (
                <>
                  {isDesktop && (
                    <Button
                      variant="contained"
                      onClick={() => handleJoinOpen()}
                      sx={{ color: 'white', whiteSpace: 'nowrap', px: 2 }}
                    >
                      LOG IN / SIGN UP
                    </Button>
                  )}
                </>
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
          </Box>
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
      <ModalCustom open={joinOpen} onClose={handleJoinClose}>
        <SignUp hideSns={false} onClose={handleJoinClose} />
      </ModalCustom>
      {/* <Modal
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
      </Modal> */}

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
