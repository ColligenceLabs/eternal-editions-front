import _ from 'lodash';
import { useTheme } from '@mui/material/styles';
import { Box, Stack, Button, AppBar, Container, Modal, Backdrop, Fade, Input } from '@mui/material';
import { useOffSetTop, useResponsive } from '../../hooks';
import { HEADER_DESKTOP_HEIGHT } from '../../config';
import { Logo } from '../../components';
import { NavMobile, NavDesktop, navConfig } from '../nav';
import { ToolbarStyle, ToolbarShadowStyle } from './HeaderToolbarStyle';
import React, { ChangeEvent, useEffect } from 'react';
import { ConnectWallet, DisconnectWallet } from '../../components/wallet';
import { SignUp } from '../../components/user';
import WalletPopover from '../../components/WalletPopover';
import { useEagerConnect, useInactiveListener } from '../../hooks/useEagerConnect';
import '../../abc/sandbox/index';
import { controllers, accountRestApi, services } from '../../abc/background/init';
import { AbcLoginResult } from '../../abc/main/abc/interface';
import { setAbcAuth } from '../../store/slices/abcAuth';
import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { checkWasm } from '../../abc/sandbox';
import secureLocalStorage from 'react-secure-storage';
import useAccount from '../../hooks/useAccount';
import { abcSendTx } from '../../utils/abcTransactions';
import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import { abcLogin } from '../../services/services';
import tokenAbi from '../../config/abi/ERC20Token.json';
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
      setUser(user);

      await accountController.recoverShare(
        { password: '!owdin001', user, wallets, keepDB: false },
        dispatch
      );
    }
  };

  useEffect(() => {
    const loginType = localStorage.getItem('loginType');
    console.log('!! login type = ', loginType);
    if (
      loginType !== 'password' &&
      webUser?.user?.session?.providerAuthInfo?.provider_token !== '' &&
      temp
    ) {
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
    <AppBar sx={{ boxShadow: 0, backgroundColor: 'transparent' }}>
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
                        color: 'white',
                      }}
                    >
                      SIGN UP
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
