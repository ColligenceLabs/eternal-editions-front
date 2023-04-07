import { ReactElement, useEffect, useState } from 'react';
// utils
// @types
// _data
// layouts
import Layout from '../../src/layouts';
// components
import { Iconify, Page } from '../../src/components';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ChainId,
  HEADER_DESKTOP_HEIGHT,
  HEADER_MOBILE_HEIGHT,
  WALLET_METAMASK,
  WALLET_WALLECTCONNECT,
} from '../../src/config';
import { RegisterForm } from '../../src/sections/auth';
import AccountForm from '../../src/sections/@my/AccountForm';
import * as React from 'react';
import { ClipboardCopy, getShotAddress } from '../../src/utils/wallet';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import useAccount from '../../src/hooks/useAccount';
import Image from '../../src/components/Image';
import NextLink from 'next/link';
import Routes from '../../src/routes';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAddress, updateAddress } from '../../src/services/services';
import { setWebUser } from '../../src/store/slices/webUser';
import { useWeb3React } from '@web3-react/core';
import env from '../../src/env';
import { setupNetwork } from '../../src/utils/network';
import { injected, walletconnect } from '../../src/hooks/connectors';
import getBalances from '../../src/utils/getBalances';
import useResponsive from '../../src/hooks/useResponsive';
// sections

// ----------------------------------------------------------------------
const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

const CButton = styled('div')(({ theme }) => ({
  backgroundColor: '#F5F5F5',
  color: '#999999',
  width: '100px',
  height: '40px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '12px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 700,
}));

type Props = {};

export default function MyAccountPage({}: Props) {
  const isDesktop = useResponsive('up', 'md');
  const { account } = useAccount();
  const { user } = useSelector((state: any) => state.webUser);
  const context = useWeb3React();
  const { activate, chainId, deactivate, library } = context;
  const dispatch = useDispatch();
  const [doAddWallet, setDoAddWallet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const balance = getBalances(account, library);

  const handleSignUpClose = () => {
    setOpenSignUp(false);
  };

  const handleDeleteAddressClick = async () => {
    setIsLoading(true);
    try {
      window.localStorage.removeItem('walletStatus');
      const data = {};
      const res = await deleteAddress(data);
      dispatch(setWebUser(res.data));
      deactivate();
      localStorage.removeItem('walletconnect');
    } catch (error: any) {
      console.log(error.message);
    }
    setIsLoading(false);
  };

  const connectWallet = async (id: any) => {
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
    } finally {
      handleSignUpClose();
    }
  };

  useEffect(() => {
    const saveAddress = async () => {
      setIsLoading(true);
      try {
        const target_copy = Object.assign({}, library.provider);
        const isAbc = target_copy.isABC === true;
        // const isKaikas = typeof target_copy._kaikas !== 'undefined';
        let signature;
        const message = `apps.eternaleditions.io wants you to sign in with your Ethereum account.

EternalEditions Signature Request

Type: Address verification`;
        // if (isKaikas) {
        //   const caver = new Caver(window.klaytn);
        //   signature = await caver.klay.sign(message, account ?? '').catch(() => deactivate());
        // } else {
        //   signature = await library
        //     .getSigner()
        //     .signMessage(message)
        //     .catch(() => deactivate());
        // }
        signature = await library
          .getSigner()
          .signMessage(message)
          .catch(() => deactivate());
        if (!signature) return setIsLoading(false); // 서명 거부
        // const data = { message, signature, isKaikas, isAbc };
        const data = { message, signature, isAbc };
        const res = await updateAddress(data);
        dispatch(setWebUser(res.data));
      } catch (error: any) {
        console.log(error.message);
      } finally {
        setDoAddWallet(false);
        setIsLoading(false);
      }
    };

    if (!library?.connection || !doAddWallet) {
      console.log('exited');
      return;
    }
    saveAddress();
  }, [library]);

  return (
    <Page title="Account">
      <RootStyle>
        <Container sx={{ my: 5 }}>
          {/*<Box sx={{ display: 'flex' }}>*/}
          {/*  <Box sx={{ border: '1px solid yellow', width: '200px' }}>*/}
          {/*    <Box>PROFILE</Box>*/}
          {/*    <Box>MY ITEMS</Box>*/}
          {/*    <Box>TRANSACTION</Box>*/}
          {/*    <Box>FAQ</Box>*/}
          {/*    <Box>NOTICE</Box>*/}
          {/*    <Box>CONTACT US</Box>*/}
          {/*  </Box>*/}
          {/*  <Box sx={{ border: '1px solid yellow', flex: 1 }}>contents area</Box>*/}
          {/*</Box>*/}
          <Box
            sx={{
              width: '100%',
              backgroundColor: '#fff',
              color: '#000',
              borderRadius: '24px',
              // padding: '28px 24px',
              display: 'flex',
            }}
          >
            {isDesktop && (
              <Box sx={{ width: '370px', borderRight: '1px solid #0000000A' }}>
                <Box
                  sx={{
                    borderBottom: '1px solid #0000000A',
                    padding: '28px 24px',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '50%',
                        backgroundColor: '#F5F5F5',
                        width: '32px',
                        height: '32px',
                        cursor: 'pointer',
                      }}
                      onClick={() => ClipboardCopy(account ?? '', '지갑주소가 복사되었습니다.')}
                    >
                      <ContentCopyOutlinedIcon sx={{ color: '#999999', fontSize: '14px' }} />
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '50%',
                        backgroundColor: '#F5F5F5',
                        width: '32px',
                        height: '32px',
                        cursor: 'pointer',
                      }}
                    >
                      <OpenInNewOutlinedIcon sx={{ color: '#999999', fontSize: '14px' }} />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mt: '16px',
                    }}
                  >
                    <Image
                      src={
                        user.profile_image ? user.profile_image : '/assets/icons/profile-logo.png'
                      }
                      sx={{ width: 96 }}
                    />
                    <Typography sx={{ fontSize: '16px', fontWeight: '700', mt: '16px' }}>
                      {user.name}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ padding: '28px 24px' }}>
                  <Typography
                    sx={{ fontSize: '12px', fontWeight: 400, color: '#999999', mb: '20px' }}
                  >
                    NAME
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.7rem',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Box sx={{ width: '20px' }}>
                          <Image src="/assets/img/ee-logo.svg" sx={{ width: '100%' }} />
                        </Box>
                        <Typography sx={{ fontSize: '13px', fontWeight: '700' }}>
                          {user.point ? user.point : 0} EDCP
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          backgroundColor: '#F5F5F5',
                          textAlign: 'center',
                          borderRadius: '40px',
                          cursor: 'pointer',
                          padding: '5px 15px',
                        }}
                      >
                        <NextLink href={Routes.eternalEditions.payment.point} passHref>
                          <Typography
                            sx={{ fontSize: '13px', fontWeight: '700', color: '#999999' }}
                          >
                            BUY
                          </Typography>
                        </NextLink>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Box sx={{ width: '20px' }}>
                          <Image src="/assets/img/matic-token-icon.png" sx={{ width: '100%' }} />
                        </Box>
                        <Typography sx={{ fontSize: '13px', fontWeight: '700' }}>
                          {balance.toFixed(5)} MATIC
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          backgroundColor: '#F5F5F5',
                          textAlign: 'center',
                          borderRadius: '40px',
                          cursor: 'pointer',
                          padding: '5px 15px',
                        }}
                      >
                        <Typography sx={{ fontSize: '13px', fontWeight: '700', color: '#999999' }}>
                          BUY
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
            <Box sx={{ width: '100%' }}>
              <Box
                sx={{
                  padding: '28px 24px',
                  borderBottom: '1px solid #0000000A',
                }}
              >
                <Typography sx={{ color: '#BBBBBB', fontSize: '12px', fontWeight: 400 }}>
                  SIGNED-IN SOCIAL ACCOUNT
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.7rem', mt: '14px' }}>
                  <Box
                    sx={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: '#F5F5F5',
                      borderRadius: '50px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Image src="/assets/icons/google-icon.png" sx={{ width: '18px' }} />
                  </Box>
                  <Typography>{user.email}</Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  padding: '28px 24px',
                  borderBottom: '1px solid #0000000A',
                }}
              >
                <Typography sx={{ color: '#BBBBBB', fontSize: '12px', fontWeight: 400 }}>
                  NAME
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.7rem', mt: '14px' }}>
                  <Typography>{user.name}</Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  padding: '28px 24px',
                  borderBottom: '1px solid #0000000A',
                }}
              >
                <Typography sx={{ color: '#BBBBBB', fontSize: '12px', fontWeight: 400 }}>
                  WALLET ADDRESS
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    // alignItems: 'center',
                    mt: '7px',
                  }}
                >
                  {user.abc_address && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.7rem', mt: '14px' }}>
                      <Image src="/assets/icons/abc-logo.png" sx={{ width: '24px' }} />
                      <Typography>
                        {isDesktop ? user.eth_address : getShotAddress(user.abc_address)}
                      </Typography>
                    </Box>
                  )}
                  {user.eth_address && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.7rem', mt: '14px' }}>
                      <Image src="/assets/icons/metamask-logo.png" sx={{ width: '24px' }} />
                      <Typography>
                        {isDesktop ? user.eth_address : getShotAddress(user.eth_address)}
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', mt: '14px' }}>
                  {user.eth_address ? (
                    <CButton onClick={handleDeleteAddressClick}>DELETE</CButton>
                  ) : (
                    <CButton
                      onClick={() => {
                        setDoAddWallet(true);
                        setOpenSignUp(true);
                      }}
                    >
                      ADD
                    </CButton>
                  )}

                  {openSignUp && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                      <CButton
                        onClick={async () => {
                          await connectWallet(WALLET_METAMASK);
                        }}
                      >
                        Metamask
                      </CButton>
                      <CButton
                        onClick={async () => {
                          await connectWallet(WALLET_WALLECTCONNECT);
                        }}
                      >
                        WalletConnect
                      </CButton>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

MyAccountPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
