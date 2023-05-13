import { ReactElement, useEffect, useState } from 'react';
// utils
// @types
// _data
// layouts
import Layout from 'src/layouts';
// components
import { Page } from 'src/components';
import { Box, Button, Divider, Grid, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ChainId,
  HEADER_DESKTOP_HEIGHT,
  HEADER_MOBILE_HEIGHT,
  WALLET_METAMASK,
  WALLET_WALLECTCONNECT,
} from 'src/config';
import { ClipboardCopy } from 'src/utils/wallet';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import useAccount from 'src/hooks/useAccount';
import Image from 'src/components/Image';
import NextLink from 'next/link';
import Routes from 'src/routes';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAddress, updateAddress } from 'src/services/services';
import { setWebUser } from 'src/store/slices/webUser';
import { useWeb3React } from '@web3-react/core';
import env from 'src/env';
import { setupNetwork } from 'src/utils/network';
import { injected, walletconnect } from 'src/hooks/connectors';
import getBalances from 'src/utils/getBalances';
import useResponsive from 'src/hooks/useResponsive';
import MyAccountWrapper from 'src/components/AccountWrapper';
import palette from 'src/theme/palette';
import { User } from 'src/@types/user';
// import { Radio } from '@mui/material';
import Radio from 'src/components/common/Radio';
// sections

// ----------------------------------------------------------------------
const RootStyle = styled('div')(({ theme }) => ({
  paddingBottom: HEADER_MOBILE_HEIGHT,
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
    paddingBottom: HEADER_DESKTOP_HEIGHT,
  },
}));

const CButton = styled('div')(({ theme }) => ({
  backgroundColor: '#F5F5F5',
  color: '#999999',
  padding: '10px 16px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '60px',
  cursor: 'pointer',
  fontSize: '12px',
  lineHeight: 13 / 12,
  fontWeight: 700,
}));

const ProfileTextAction = styled(Button)(({ theme }) => ({
  fontWeight: 700,
  fontSize: 12,
  lineHeight: 13 / 12,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: palette.dark.black.lighter,
  padding: '6px 0',
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  color: palette.dark.black.lighter,
  fontSize: '12px',
  fontWeight: 400,
  textTransform: 'uppercase',
}));

const SectionText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  lineHeight: 20 / 14,
}));

const Icon = styled(Box)(({ theme }) => ({
  width: '32px',
  height: '32px',
  backgroundColor: '#F5F5F5',
  borderRadius: '50px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

type Props = {};

export default function MyAccountPage({}: Props) {
  const isDesktop = useResponsive('up', 'md');
  const { account } = useAccount();
  const { user }: { user: User } = useSelector((state: any) => state.webUser);
  const context = useWeb3React();
  const { activate, chainId, deactivate, library } = context;
  const dispatch = useDispatch();
  const [doAddWallet, setDoAddWallet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const balance = getBalances(account, library);
  const [selectedAccount, setSelectedAccount] = useState(
    user.abc_address || user.eth_address || ''
  );
  console.log('🚀 ~ file: account.tsx:124 ~ MyAccountPage ~ selectedAccount:', selectedAccount);

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
        const signature = await library
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
        <MyAccountWrapper>
          <Box
            sx={{
              bgcolor: '#fff',
              color: '#000',
              borderRadius: 3,
            }}
          >
            <Grid container>
              <Grid item xs={12} md={4} lg={3} borderRight="1px solid rgba(0, 0, 0, 0.04)">
                <Stack>
                  <Box
                    sx={{
                      borderBottom: '1px solid #0000000A',
                      padding: {
                        xs: '19px 16px 24px',
                        md: '32px 24px',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
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
                        mt: {
                          xs: '8px',
                          md: '16px',
                        },
                      }}
                    >
                      <Image
                        alt="avatar"
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
                  <Box
                    sx={{
                      padding: {
                        xs: '24px 16px',
                        md: '32px 24px',
                      },
                    }}
                  >
                    <SectionHeader>Title</SectionHeader>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.7rem',
                      }}
                    >
                      <Stack gap="12px">
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Box sx={{ width: '20px' }}>
                              <Image
                                alt="edcp-logo"
                                src="/assets/img/ee-logo.svg"
                                sx={{ width: '100%' }}
                              />
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
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Box sx={{ width: '20px' }}>
                              <Image
                                alt="matic-token-icon"
                                src="/assets/img/matic-token-icon.png"
                                sx={{ width: '100%' }}
                              />
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
                            <Typography
                              sx={{ fontSize: '13px', fontWeight: '700', color: '#999999' }}
                            >
                              BUY
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </Box>
                    <Stack
                      mt={{ md: '205px' }}
                      sx={{
                        display: {
                          xs: 'none',
                          md: 'flex',
                        },
                      }}
                    >
                      <ProfileTextAction>Edit Profile</ProfileTextAction>
                      <ProfileTextAction>Change Password</ProfileTextAction>
                      <ProfileTextAction>Logout</ProfileTextAction>
                    </Stack>
                  </Box>

                  <Stack
                    gap="16px"
                    sx={{
                      display: {
                        xs: 'none',
                        md: 'flex',
                      },
                    }}
                  >
                    <Divider />
                    <Box padding={{ xs: '16px 0 0', md: '32px' }} textAlign="center">
                      <ProfileTextAction>Deactivate Account</ProfileTextAction>
                    </Box>
                  </Stack>
                </Stack>
              </Grid>
              <Grid
                item
                xs={12}
                md={8}
                lg={9}
                padding={{
                  xs: '0 16px 13px',
                  md: '32px 24px',
                }}
              >
                <Stack gap="16px">
                  <Stack gap="12px">
                    <SectionHeader>SIGNED-IN SOCIAL ACCOUNT</SectionHeader>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icon>
                        <Image
                          alt="google-icon"
                          src="/assets/icons/google-icon.png"
                          sx={{ width: '18px' }}
                        />
                      </Icon>
                      <SectionText>{user.email}</SectionText>
                    </Box>
                  </Stack>

                  <Divider />

                  <Stack gap="12px">
                    <SectionHeader>Linking another social account</SectionHeader>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                        <Image
                          alt="google-icon"
                          src="/assets/icons/google-icon.png"
                          sx={{ width: '18px' }}
                        />
                      </Box>
                    </Box>
                  </Stack>

                  <Divider />

                  <Stack gap="12px">
                    <SectionHeader>NAME</SectionHeader>
                    <SectionText>{user.name}</SectionText>
                  </Stack>

                  <Divider />
                  <Stack gap="12px">
                    <SectionHeader>Birth Date</SectionHeader>
                    <SectionText color="red">12/25/1984</SectionText>
                  </Stack>

                  <Divider />

                  <Stack gap="12px">
                    <SectionHeader>Gender</SectionHeader>
                    <SectionText color="red">Male</SectionText>
                  </Stack>

                  <Divider />

                  <Stack gap="12px">
                    <SectionHeader>Phone Number</SectionHeader>
                    <SectionText color="red">+82 10-1234-5678</SectionText>
                  </Stack>

                  <Divider />

                  <Box>
                    <SectionHeader>WALLET ADDRESS</SectionHeader>

                    <form>
                      <Stack gap="12px" sx={{ mt: '12px' }}>
                        {user.abc_address && (
                          <Radio
                            checked={selectedAccount === user.abc_address}
                            value={user.abc_address}
                            name="wallet-address"
                            label={
                              <Stack direction="row" alignItems="center" gap="4px">
                                <Image
                                  alt="abc-logo"
                                  src="/assets/icons/abc-logo.png"
                                  sx={{ width: '24px' }}
                                />
                                <SectionText flex={1} sx={{ wordBreak: 'break-word' }}>
                                  {user.abc_address}
                                </SectionText>
                              </Stack>
                            }
                            onClick={() => setSelectedAccount(user.abc_address)}
                          />
                        )}

                        {user.eth_address && (
                          <Radio
                            checked={selectedAccount === user.eth_address}
                            value={user.eth_address}
                            name="wallet-address"
                            label={
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  mt: '14px',
                                }}
                              >
                                <Image
                                  alt="metamask-logo"
                                  src="/assets/icons/metamask-logo.png"
                                  sx={{ width: '24px' }}
                                />
                                <SectionText>{user.eth_address}</SectionText>
                              </Box>
                            }
                            onClick={() => setSelectedAccount(user.eth_address || '')}
                          />
                        )}
                      </Stack>
                    </form>
                  </Box>

                  <Stack gap="16px">
                    <Box
                      sx={{
                        display: isDesktop ? 'flex' : 'grid',
                        gridTemplateColumns: isDesktop ? 'unset' : 'repeat(2, 1fr)',
                        gap: 0.25,
                      }}
                    >
                      <CButton
                        onClick={() => {
                          setDoAddWallet(true);
                          setOpenSignUp(true);
                        }}
                      >
                        ADD
                      </CButton>

                      {/* {user.eth_address ? ( */}
                      <CButton onClick={handleDeleteAddressClick}>DELETE</CButton>
                      {/* ) : null} */}
                    </Box>

                    {openSignUp && (
                      <Box sx={{ display: 'flex', gap: 2 }}>
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
                  </Stack>

                  <Divider sx={{ display: { xs: 'none', md: 'block' } }} />
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </MyAccountWrapper>
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

MyAccountPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout
      background={{
        backgroundImage: `url(/assets/background/bg-account.jpg)`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
      verticalAlign="top"
    >
      {page}
    </Layout>
  );
};
