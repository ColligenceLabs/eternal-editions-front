// @mui
import { styled } from '@mui/material/styles';
import {
  Stack,
  Button,
  Typography,
  Divider,
  Backdrop,
  Fade,
  Box,
  Modal,
  Input,
  TextField,
} from '@mui/material';
import Image from '../Image';
import * as React from 'react';
// import useWallets from '../../hooks/useWallets';
import { getIconByType } from '../../utils/wallet';
import { ChainId, SUCCESS, WALLET_METAMASK, WALLET_WALLECTCONNECT } from '../../config';
import { useWeb3React } from '@web3-react/core';
import { setupNetwork } from '../../utils/network';
import { injected, walletconnect } from '../../hooks/connectors';
import env from '../../env';
import useCreateToken from '../../hooks/useCreateToken';
import { useEffect, useState } from 'react';
import { Iconify } from '../index';
import { eternalLogin, getUser, requestWalletLogin } from '../../services/services';
import { setWebUser } from '../../store/slices/webUser';
import { useDispatch } from 'react-redux';
import { ChangeEvent } from 'react';
import { Base64 } from 'js-base64';
import Router from 'next/router';
import Link from 'next/link';

// ----------------------------------------------------------------------

const MetaMaskButton = styled(Button)({
  width: '100% !important',
  height: '36px',
  fontSize: 12,
  backgroundColor: '#f1f2f5',
  borderColor: '#f1f2f5',
  color: '#000000',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: 'background.paper',
    borderColor: 'background.paper',
    color: '#ffffff',
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: 'background.paper',
    borderColor: 'background.paper',
    color: '#ffffff',
  },
});

const WalletConnectButton = styled(Button)({
  width: '100% !important',
  height: '36px',
  fontSize: 12,
  backgroundColor: '#f1f2f5',
  borderColor: '#f1f2f5',
  color: '#000000',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: 'background.paper',
    borderColor: 'background.paper',
    color: '#ffffff',
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: 'background.paper',
    borderColor: 'background.paper',
    color: '#ffffff',
  },
});

const GoogleButton = styled(Button)({
  width: '100% !important',
  height: '36px',
  fontSize: 12,
  backgroundColor: '#f1f2f5',
  borderColor: '#f1f2f5',
  color: '#000000',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#DD4B39',
    borderColor: '#DD4B39',
    color: '#ffffff',
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: 'background.paper',
    borderColor: 'background.paper',
    color: '#ffffff',
  },
});

const FacebookButton = styled(Button)({
  width: '100% !important',
  height: '36px',
  fontSize: 12,
  backgroundColor: '#f1f2f5',
  borderColor: '#f1f2f5',
  color: '#000000',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#4460d1',
    borderColor: '#4460d1',
    color: '#ffffff',
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: 'background.paper',
    borderColor: 'background.paper',
    color: '#ffffff',
  },
});

const IDPWDButton = styled(Button)({
  width: '100% !important',
  height: '36px',
  fontSize: 12,
  backgroundColor: '#f1f2f5',
  borderColor: '#f1f2f5',
  color: '#000000',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#9360d1',
    borderColor: '#4460d1',
    color: '#ffffff',
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: 'background.paper',
    borderColor: 'background.paper',
    color: '#ffffff',
  },
});

const LogInButton = styled(Button)({
  width: '100% !important',
  // height: '36px',
  height: '100%',
  fontSize: 12,
  padding: '30px',
  backgroundColor: '#f1f2f5',
  borderColor: '#f1f2f5',
  color: '#000000',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#9360d1',
    borderColor: '#4460d1',
    color: '#ffffff',
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: 'background.paper',
    borderColor: 'background.paper',
    color: '#ffffff',
  },
});

// ----------------------------------------------------------------------

export default function SignUp({ onClose, hideSns, ...other }) {
  const context = useWeb3React();
  const { activate, chainId, deactivate, library } = context;
  const [doSign, setDoSign] = useState(false);
  const [openIDPWD, setOpenIDPWD] = useState(false);
  const [userId, setUserId] = useState('');
  const [userPWD, setUserPWD] = useState('');

  const handleChangeUserId = (event) => {
    setUserId(event.target.value);
  };

  const handleChangeUserPWD = (event) => {
    setUserPWD(event.target.value);
  };

  const onClickIDLogin = async () => {
    const res = await eternalLogin({ email: userId, password: userPWD });
    console.log(`ID : ${userId}`);
    console.log(`PWD : ${userPWD}`);
    console.log(res);
    if (res.data.status === SUCCESS) {
      console.log('로그인 성공');
      window.localStorage.setItem('loginType', 'password');
      Router.push({
        pathname: '/register',
        query: { eternal: Base64.encode(userPWD) },
      });
    } else {
      alert('로그인에 실패했습니다.');
    }
    onClose();
  };

  const tokenGenerator = useCreateToken();
  const dispatch = useDispatch();
  // const { connectKaikas, connectMetamask, connectKlip, disconnect, requestKey, message, type } = useWallets();

  useEffect(() => {
    const walletLogin = async () => {
      if (!library) return;
      const target_copy = Object.assign({}, library.provider);
      const isAbc = target_copy.isABC === true;
      // const isKaikas = typeof target_copy._kaikas !== 'undefined';
      let signature;
      const message = `apps.eternaleditions.io wants you to sign in with your Ethereum account.

  EternalEditions Signature Request

  Type: Login request`;
      signature = await library
        .getSigner()
        .signMessage(message)
        .catch(() => deactivate());
      if (!signature) return; // 서명 거부
      const data = { message, signature, isAbc };
      const res = await requestWalletLogin(data);
      if (res.data === 'loginSuccess') {
        const userRes = await getUser();
        if (userRes.status === 200 && userRes.data.status !== 0)
          dispatch(setWebUser(userRes.data.user));
        onClose();
        // createToken();
      }
      if (res.data === 'User not found!') {
        deactivate();
        window.localStorage.removeItem('loginBy');
        window.localStorage.removeItem('loginType');
        alert('Please continue with SNS and register wallet address on My Profile page.');
      }
    };

    if (library) walletLogin();
  }, [library]);

  const connectWallet = async (id) => {
    try {
      const targetNetwork = env.REACT_APP_TARGET_NETWORK ?? ChainId.MUMBAI;
      try {
        if (id === WALLET_METAMASK && chainId !== targetNetwork) {
          await setupNetwork(targetNetwork);
        }
      } catch (e) {
        console.log('change network error', e);
      }
      if (id === WALLET_METAMASK) {
        await activate(injected, undefined, true);
        // dispatch(setActivatingConnector(injected));
        window.localStorage.setItem('wallet', WALLET_METAMASK);
      } else if (id === WALLET_WALLECTCONNECT) {
        window.localStorage.removeItem('walletconnect');
        const wc = walletconnect(true);
        await activate(wc, undefined, true);
        window.localStorage.setItem('wallet', WALLET_WALLECTCONNECT);
      }
    } catch (e) {
      console.log('connect wallet error', e);
      alert(e);
    }
  };

  console.log('googleredirecturl:::', `${env.REACT_APP_API_URL}/auth/google?redirectUrl=/`);
  const handleSnsLogin = async (snsType) => {
    window.localStorage.setItem('loginBy', 'sns');
    window.localStorage.removeItem('loginType');
    window.location.href = `${env.REACT_APP_API_URL}/auth/${snsType}?redirectUrl=/`;
  };

  return (
    <Stack {...other}>
      <Typography id="transition-modal-title" variant="h4" component="h2" sx={{ mb: 2 }}>
        SIGN UP {openIDPWD ? '(기존회원)' : ''}
      </Typography>

      <Divider />

      {openIDPWD ? (
        <Stack spacing={2} sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.7rem',
              }}
            >
              <TextField
                label="ID"
                variant="outlined"
                fullWidth
                size={'small'}
                inputProps={{ style: { color: '#999999' } }}
                value={userId}
                onChange={handleChangeUserId}
              />
              <TextField
                type="password"
                label="Password"
                variant="outlined"
                fullWidth
                size={'small'}
                inputProps={{ style: { color: '#999999' } }}
                value={userPWD}
                onChange={handleChangeUserPWD}
              />
            </Box>
            <Box>
              <LogInButton onClick={onClickIDLogin}>Login</LogInButton>
            </Box>
          </Box>

          <IDPWDButton onClick={() => setOpenIDPWD(false)}>뒤로</IDPWDButton>
        </Stack>
      ) : (
        <Stack spacing={2} sx={{ mt: 4 }}>
          <Stack spacing={1}>
            {!hideSns && (
              <>
                <Stack>
                  <IDPWDButton
                    variant="contained"
                    onClick={() => {
                      setOpenIDPWD(true);
                    }}
                    startIcon={<Iconify icon="ic:sharp-supervised-user-circle" />}
                    // startIcon={<Iconify icon={'mdi:facebook'} />}
                  >
                    ID / PASSWORD (기존 회원)
                  </IDPWDButton>
                </Stack>
                <Stack>
                  <GoogleButton
                    variant="contained"
                    onClick={() => handleSnsLogin('google')}
                    startIcon={<Iconify icon={'mdi:google-plus'} />}
                  >
                    CONTINUE WITH GOOGLE
                  </GoogleButton>
                </Stack>
                <Stack>
                  <FacebookButton
                    variant="contained"
                    onClick={() => handleSnsLogin('facebook')}
                    startIcon={<Iconify icon={'mdi:facebook'} />}
                  >
                    CONTINUE WITH FACEBOOK
                  </FacebookButton>
                </Stack>
                <Stack direction="row" justifyContent="center" alignItems="center">
                  <Typography variant="caption">or</Typography>
                </Stack>
              </>
            )}
          </Stack>

          <Stack spacing={1}>
            <Stack>
              <MetaMaskButton
                variant="contained"
                onClick={async () => {
                  window.localStorage.setItem('loginBy', 'wallet');
                  window.localStorage.removeItem('loginType');
                  await connectWallet(WALLET_METAMASK);
                  // await connectMetamask();
                  // onClose();
                }}
                startIcon={
                  <Image
                    alt="metamask icon"
                    src={getIconByType(WALLET_METAMASK)}
                    sx={{ width: 24, height: 24 }}
                  />
                }
              >
                CONNECT TO METAMASK WALLET
              </MetaMaskButton>
            </Stack>
            <Stack>
              <WalletConnectButton
                variant="contained"
                onClick={async () => {
                  window.localStorage.setItem('loginBy', 'wallet');
                  window.localStorage.removeItem('loginType');
                  await connectWallet(WALLET_WALLECTCONNECT);
                  // onClose();
                }}
                startIcon={
                  <Image
                    alt="metamask icon"
                    src={getIconByType(WALLET_WALLECTCONNECT)}
                    sx={{ width: 24, height: 24 }}
                  />
                }
              >
                CONNECT TO WALLET CONNECT
              </WalletConnectButton>
            </Stack>
          </Stack>
          <Divider sx={{ mt: 1, mb: 1 }} />
          <Stack sx={{ textAlign: 'center' }}>
            {/* <a
              style={{ textDecoration: 'none', color: 'black' }}
              href={'https://eedao.notion.site/Eternal-Editions-168957fedc5a4ffe8ea7fcbc2ae1d05f'}
              target={'_blank'}
              rel="noreferrer"
              >
            </a> */}
            <Button fullWidth size="large" variant="vivid" href="#">
              <Typography variant={'caption'}>회원가입 가이드</Typography>
            </Button>
          </Stack>
        </Stack>
      )}

      {/*<Modal*/}
      {/*  aria-labelledby="transition-modal-title"*/}
      {/*  aria-describedby="transition-modal-description"*/}
      {/*  open={openIDPWD}*/}
      {/*  onClose={handleIDPWDClose}*/}
      {/*  closeAfterTransition*/}
      {/*  // BackdropComponent={Backdrop}*/}
      {/*  // BackdropProps={{*/}
      {/*  //   timeout: 500,*/}
      {/*  // }}*/}
      {/*>*/}
      {/*  <Fade in={openIDPWD}>*/}
      {/*    <Box sx={modalStyle}>*/}
      {/*      <Stack {...other}>*/}
      {/*        <Typography id="transition-modal-title" variant="h4" component="h2" sx={{ mb: 2 }}>*/}
      {/*          SIGN UP*/}
      {/*        </Typography>*/}

      {/*        <Divider />*/}
      {/*      </Stack>*/}
      {/*    </Box>*/}
      {/*  </Fade>*/}
      {/*</Modal>*/}
    </Stack>
  );
}
