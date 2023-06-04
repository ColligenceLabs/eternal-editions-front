// @mui
import { styled } from '@mui/material/styles';
import { Stack, Button, Typography, Box, TextField, IconButton, Link } from '@mui/material';
import Image from '../Image';
import * as React from 'react';
// import useWallets from '../../hooks/useWallets';
import { getIconByType } from '../../utils/wallet';
import {
  APPLE_ICON,
  ChainId,
  FACEBOOK_ICON,
  GOOGLE_ICON,
  MAIL_ICON,
  SUCCESS,
  WALLET_METAMASK,
  WALLET_WALLECTCONNECT,
} from '../../config';
import { useWeb3React } from '@web3-react/core';
import { setupNetwork } from '../../utils/network';
import { injected, walletconnect } from '../../hooks/connectors';
import env from '../../env';
import useCreateToken from '../../hooks/useCreateToken';
import { useEffect, useState } from 'react';
import { eternalLogin, getUser, requestWalletLogin } from '../../services/services';
import { setWebUser } from '../../store/slices/webUser';
import { useDispatch } from 'react-redux';
import { ChangeEvent } from 'react';
import { Base64 } from 'js-base64';
import Router from 'next/router';
import EmailLoginForm from './EmailLoginForm';
import NextLink from 'next/link';
import Routes from 'src/routes';

// ----------------------------------------------------------------------
const CustomIconButton = styled(IconButton)(({ theme }) => ({
  width: '56px',
  height: '56px',
  backgroundColor: '#F5F5F5',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    color: '#ffffff',
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    color: '#ffffff',
  },
}));
const CustomButton = styled(Button)({
  width: '100% !important',
  height: '56px',
  fontSize: 12,
  backgroundColor: '#f1f2f5',
  borderColor: '#f1f2f5',
  color: '#000000',
  boxShadow: 'none',
  justifyContent: 'flex-start',
  letterSpacing: '0.08em',
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
      window.localStorage.setItem('loginBy', 'password');
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
        window.localStorage.setItem('walletStatus', 'connected');
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
      {openIDPWD ? (
        <EmailLoginForm onClose={onClose} />
      ) : (
        <>
          <Typography id="transition-modal-title" variant="h4" component="h2" sx={{ mb: 2 }}>
            Connect your account {openIDPWD ? '(기존회원)' : ''}
          </Typography>
          <Stack sx={{ mt: 4 }}>
            <Stack spacing={1}>
              {!hideSns && (
                <Stack direction={'row'} justifyContent={'space-between'}>
                  <CustomIconButton
                    onClick={() => {
                      setOpenIDPWD(true);
                    }}
                  >
                    <Image alt="apple icon" src={getIconByType(APPLE_ICON)} sx={{ height: 32 }} />
                  </CustomIconButton>
                  <CustomIconButton onClick={() => handleSnsLogin('google')}>
                    <Image alt="google icon" src={getIconByType(GOOGLE_ICON)} sx={{ height: 32 }} />
                  </CustomIconButton>
                  {/* <NextLink
                    passHref
                    as={Routes.eternalEditions.registerGoogle}
                    href={Routes.eternalEditions.registerGoogle}
                  >
                    <CustomIconButton>
                      <Image
                        alt="google icon"
                        src={getIconByType(GOOGLE_ICON)}
                        sx={{ height: 32 }}
                      />
                    </CustomIconButton>
                  </NextLink> */}
                  <CustomIconButton onClick={() => handleSnsLogin('facebook')}>
                    <Image
                      alt="facebook icon"
                      src={getIconByType(FACEBOOK_ICON)}
                      sx={{ width: 32, height: 32 }}
                    />
                  </CustomIconButton>
                  <CustomIconButton onClick={() => setOpenIDPWD(true)}>
                    <Image
                      alt="mail icon"
                      src={getIconByType(MAIL_ICON)}
                      sx={{ width: 30, pt: '2px' }}
                    />
                  </CustomIconButton>
                </Stack>
              )}
            </Stack>
            <Stack spacing="12px" mt={8}>
              <Typography variant="h4">or connect wallet</Typography>
              <Stack gap="2px">
                <CustomButton
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
                      sx={{ width: 24, height: 24, mx: 1 }}
                    />
                  }
                >
                  CONNECT META MASK
                </CustomButton>
                <CustomButton
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
                      sx={{ width: 24, height: 24, mx: 1 }}
                    />
                  }
                >
                  CONNECT WALLET
                </CustomButton>
              </Stack>
              <Typography variant={'caption'} sx={{ lineHeight: 16 / 12 }}>
                If you don’t have a wallet, you can select a provider and create one now.
                <Link href="https://eedao.notion.site/Eternal-Editions-168957fedc5a4ffe8ea7fcbc2ae1d05f">
                  {' '}
                  Learn more
                </Link>
              </Typography>
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  );
}
