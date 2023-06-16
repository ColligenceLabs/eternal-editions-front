import React, { ReactElement, useEffect, useState } from 'react';
import Layout from 'src/layouts';
import { Page } from 'src/components';
import {
  Box,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
  formControlLabelClasses,
  svgIconClasses,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { styled } from '@mui/material/styles';
import {
  ChainId,
  HEADER_DESKTOP_HEIGHT,
  HEADER_MOBILE_HEIGHT,
  SUCCESS,
  targetNetwork,
  WALLET_METAMASK,
  WALLET_WALLECTCONNECT,
} from 'src/config';
import { getShotAddress } from 'src/utils/wallet';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import useAccount from 'src/hooks/useAccount';
import Image from 'src/components/Image';
import NextLink from 'next/link';
import Routes from 'src/routes';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteAddress,
  getCertifications,
  getUser,
  removeUser,
  savePhoneNumber,
  updateAddress,
} from 'src/services/services';
import { setWebUser } from 'src/store/slices/webUser';
import env from 'src/env';
import { setupNetwork } from 'src/utils/network';
import { injected, walletconnect } from 'src/hooks/connectors';
import getBalances from 'src/utils/getBalances';
import useResponsive from 'src/hooks/useResponsive';
import MyAccountWrapper from 'src/components/AccountWrapper';
import palette from 'src/theme/palette';
import { User } from 'src/@types/user';
import { delUser } from 'src/store/slices/user';
import { useRouter } from 'next/router';
import ModalCustom from 'src/components/common/ModalCustom';
import { PriorityHigh } from '@mui/icons-material';
import { FormControlLabel } from '@mui/material';
import RoundedButton from 'src/components/common/RoundedButton';
import CreateWalletForm from 'src/components/user/CreateWalletForm';
import moment from 'moment';
import useActiveWeb3React from 'src/hooks/useActiveWeb3React';
import RegisterAccount from 'src/components/user/RegisterAccount';
import ImportEETickets from 'src/components/user/ImportEETickets';
import useUSDC from 'src/hooks/useUSDC';
import useEDCP from 'src/hooks/useEDCP';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SendIcon from '@mui/icons-material/Send';
import Transfer from 'src/components/user/Transfer';
import CSnackbar from 'src/components/common/CSnackbar';
import HyperlinkButton from 'src/components/ticket/HyperlinkButton';
import MyWalletModal from 'src/components/my-tickets/MyWalletModal';
import CopyButton from 'src/components/common/CopyButton';

// ----------------------------------------------------------------------
const RootStyle = styled('div')(({ theme }) => ({
  paddingBottom: HEADER_MOBILE_HEIGHT,
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
    paddingBottom: HEADER_DESKTOP_HEIGHT,
  },
}));

const CButton = styled('div')(() => ({
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

const ProfileTextAction = styled(Box)(() => ({
  fontWeight: 700,
  fontSize: 12,
  lineHeight: 13 / 12,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: palette.dark.black.lighter,
  padding: '6px',
  textAlign: 'left',
  cursor: 'pointer',
}));

const SectionHeader = styled(Typography)(() => ({
  color: palette.dark.black.lighter,
  fontSize: '12px',
  fontWeight: 400,
  textTransform: 'uppercase',
}));

export const SectionText = styled(Typography)(() => ({
  fontSize: '14px',
  lineHeight: 20 / 14,
}));

const Icon = styled(Box)(() => ({
  width: '32px',
  height: '32px',
  backgroundColor: '#F5F5F5',
  borderRadius: '50px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const CryptoButtonsWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
`;

const CryptoButtonWrapper = styled(Box)`
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
`;

type BankAccountTypes = {
  accountHolder: string;
  accountNumber: string;
  bank: string;
};

export default function MyAccountPage() {
  const isMobile = useResponsive('down', 'sm');
  const { usdcBalance } = useUSDC();
  const { edcpPoint } = useEDCP();
  const router = useRouter();
  const isDesktop = useResponsive('up', 'md');
  const { account } = useAccount();
  const abcUser = useSelector((state: any) => state.user);
  const context = useActiveWeb3React();
  const { activate, chainId, deactivate, library } = context;
  const dispatch = useDispatch();
  const [user, setUser] = useState<User | null>(null);
  const [doAddWallet, setDoAddWallet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const balance = getBalances(account, library);
  const [isOpenTransfer, setIsOpenTransfer] = useState({ open: false, token: '', amount: 0 });
  const [openDeactivateModal, setOpenDeactivateModal] = useState(false);
  const [isConfirmDeactivate, setIsConfirmDeactivate] = useState(false);
  const [isOpenCreateWalletForm, setIsOpenCreateWalletForm] = useState<boolean>(false);
  const [bankAccount, setBankAccount] = useState<BankAccountTypes | null>(null);
  const [isOpenBankAccountForm, setIsOpenBankAccountForm] = useState(false);
  const [isOpenImportAccountForm, setIsOpenImportAccountForm] = useState(false);
  const [refetchUserInfo, setRefetchUserInfo] = useState(true);
  const [isUpdated, setIsUpdated] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    type: '',
    message: '',
  });
  const [myWalletModalState, setMyWalletModalState] = useState({
    open: false,
    iconSrc: '',
    walletAddress: '',
  });

  const onOpenMyWalletModal = ({
    walletAddress,
    iconSrc,
  }: {
    walletAddress: string;
    iconSrc?: string;
  }) => {
    setMyWalletModalState({
      open: true,
      walletAddress,
      iconSrc: iconSrc || '',
    });
  };

  const resetMyWalletModalState = () => {
    setMyWalletModalState({
      open: false,
      iconSrc: '',
      walletAddress: '',
    });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar({
      open: false,
      type: '',
      message: '',
    });
  };
  const onCloseDeactivateModal = () => {
    deactivate();
    setOpenDeactivateModal(false);
    setIsConfirmDeactivate(false);
  };

  const logout = async () => {
    try {
      window.localStorage.setItem('walletStatus', 'disconnected');
      window.localStorage.removeItem('jwtToken');
      window.localStorage.removeItem('loginBy');
      window.localStorage.removeItem('loginType');
      router.push(`${env.REACT_APP_API_URL}/auth/logout`);
      dispatch(delUser());
    } catch (e) {
      console.log(e);
      alert(e);
    }
  };

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
    } finally {
      setIsLoading(false);
      setRefetchUserInfo(true);
    }
  };

  const handleClickDeactivate = async () => {
    const res = await removeUser();
    console.log(res);
    if (res.data.status === SUCCESS) {
      await logout();
      router.push('/');
    }
  };

  const handleClickChangePhonenumber = () => {
    try {
      // @ts-ignore
      const IMP = window.IMP; // 생략 가능
      IMP.init('imp65486314');
      IMP.certification(
        {
          // param
          // pg:'store-f6fdb096-d201-4df1-948e-a37ee76bb26f',//본인인증 설정이 2개이상 되어 있는 경우 필수
          merchant_uid: `mid_${new Date().getTime()}`, // 주문 번호
          m_redirect_url: Routes.eternalEditions.register, // 모바일환경에서 popup:false(기본값) 인 경우 필수, 예: https://www.myservice.com/payments/complete/mobile
          popup: false, // PC환경에서는 popup 파라미터가 무시되고 항상 true 로 적용됨
        },
        function (rsp: any) {
          // callback
          if (rsp.success) {
            console.log('success', rsp);
            router.push(
              `/my/account?imp_uid=${rsp.imp_uid}&merchant_uid=${rsp.merchant_uid}&success=${rsp.success}`
            );
          } else {
            console.log('fail', rsp);
          }
        }
      );
    } catch (e) {
      console.log(e);
    }
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
        window.localStorage.setItem('wallet', WALLET_METAMASK);
        //   // setRefetchUserInfo(true);
        // });
        // dispatch(setActivatingConnector(injected));
        fetchUser();
      } else if (id === WALLET_WALLECTCONNECT) {
        window.localStorage.removeItem('walletconnect');
        const wc = walletconnect(true);

        const res = await activate(wc, undefined, true);
        console.log(res);
        window.localStorage.setItem('wallet', WALLET_WALLECTCONNECT);
        //   // setRefetchUserInfo(true);
        // });
        fetchUser();
      }
    } catch (e) {
      console.log('connect wallet error', e);
      alert(e);
    } finally {
      handleSignUpClose();
    }
  };

  const handleClickSend = (token: string, amount: number | string) => {
    console.log(`handle click ${token} send.`);
    setIsOpenTransfer({
      open: true,
      token: token,
      amount: typeof amount === 'string' ? parseFloat(amount) : amount,
    });
  };

  const handleClickReceive = (token: string) => {
    onOpenMyWalletModal({
      walletAddress: account!,
      iconSrc:
        token === 'matic' ? '/assets/img/matic-token-icon.png' : '/assets/img/usdc-token-icon.png',
    });
    console.log(`handle click ${token} receive.`);
  };

  const handleClickCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      alert('Copied!');
    } catch (error) {
      console.error('Failed to save to clipboard:', error);
    }
  };

  const moveToScope = (address: string) => {
    if (targetNetwork === ChainId.MUMBAI) {
      window.open(`https://mumbai.polygonscan.com/address/${address}`, '_blank');
    } else if (targetNetwork === ChainId.POLYGON) {
      window.open(`https://polygonscan.com/address/${address}`, '_blank');
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    const changePhoneNumber = async (impUid: any) => {
      // 본인인증 정보 조회
      const res = await getCertifications(impUid);
      console.log(res);
      if (user && res.data?.status === SUCCESS) {
        // save phone number
        const rst = await savePhoneNumber({ uid: user.uid, phone: res.data.data.phone });
        if (rst.data?.status === SUCCESS) {
          await dispatch(setWebUser(rst.data.data));
        } else {
          alert('핸드폰 번호 변경에 실패하였습니다.');
        }
      } else {
        alert('인증정보가 존재하지 않습니다.');
        await router.push('/my/account');
      }
    };
    const impUid = router.query['imp_uid'];
    const success = router.query['success'];
    if (!isUpdated && user && user.uid && success === 'true' && impUid) {
      changePhoneNumber(impUid);
      setIsUpdated(true);
    }
  }, [router.isReady]);

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

  const fetchUser = async () => {
    const userRes = await getUser();
    if (userRes.status === 200 && userRes.data.status != 0) {
      console.log(userRes);
      setBankAccount({
        accountHolder: userRes.data.user.accountHolder,
        accountNumber: userRes.data.user.accountNumber,
        bank: userRes.data.user.bank,
      });
      dispatch(setWebUser(userRes.data.user));
      setUser(userRes.data.user);
      setRefetchUserInfo(false);
    }
  };

  useEffect(() => {
    if (refetchUserInfo || library?.connection || doAddWallet) fetchUser();
  }, [refetchUserInfo, library, doAddWallet]);

  return (
    <Page title="Account">
      <RootStyle>
        {user && (
          <MyAccountWrapper>
            <Box
              sx={{
                bgcolor: '#fff',
                color: '#000',
                borderRadius: 3,
              }}
            >
              <Grid container>
                <Grid item xs={12} md={4} lg={4} borderRight="1px solid rgba(0, 0, 0, 0.04)">
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
                      <Box
                        sx={{
                          position: 'relative',
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
                            user.profile_image
                              ? user.profile_image
                              : '/assets/icons/profile-logo.png'
                          }
                          sx={{ width: 96 }}
                        />
                        <Typography sx={{ fontSize: '16px', fontWeight: '700', mt: '16px' }}>
                          {user.name}
                        </Typography>
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '45%',
                            right: '30%',
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
                          <BorderColorIcon sx={{ color: '#999999', fontSize: '17px' }} />
                        </Box>
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
                                {edcpPoint} EDCP
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
                              <Typography
                                sx={{ fontSize: '13px', fontWeight: '700', paddingRight: '20px' }}
                              >
                                {balance.toFixed(5)} MATIC
                              </Typography>
                            </Box>
                            <CryptoButtonsWrapper>
                              <CryptoButtonWrapper sx={{ padding: '8px' }}>
                                <SaveAltIcon
                                  sx={{ color: '#999999', fontSize: '17px' }}
                                  onClick={() => handleClickReceive('matic')}
                                />
                              </CryptoButtonWrapper>
                              <CryptoButtonWrapper sx={{ padding: '8px' }}>
                                <SendIcon
                                  sx={{ color: '#999999', fontSize: '17px' }}
                                  onClick={() => handleClickSend('matic', balance)}
                                />
                              </CryptoButtonWrapper>
                            </CryptoButtonsWrapper>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Box sx={{ width: '20px' }}>
                                <Image
                                  alt="matic-token-icon"
                                  src="/assets/img/usdc-token-icon.png"
                                  sx={{ width: '100%' }}
                                />
                              </Box>
                              <Typography
                                sx={{ fontSize: '13px', fontWeight: '700', paddingRight: '20px' }}
                              >
                                {usdcBalance} USDC
                              </Typography>
                            </Box>
                            <CryptoButtonsWrapper>
                              <CryptoButtonWrapper sx={{ padding: '8px' }}>
                                <SaveAltIcon
                                  sx={{ color: '#999999', fontSize: '17px' }}
                                  onClick={() => handleClickReceive('usdc')}
                                />
                              </CryptoButtonWrapper>
                              <CryptoButtonWrapper sx={{ padding: '8px' }}>
                                <SendIcon
                                  sx={{ color: '#999999', fontSize: '17px' }}
                                  onClick={() => handleClickSend('usdc', usdcBalance)}
                                />
                              </CryptoButtonWrapper>
                            </CryptoButtonsWrapper>
                          </Box>
                        </Stack>
                      </Box>

                      <Stack mt={'20px'} ml="-5px">
                        <ProfileTextAction onClick={() => setIsOpenImportAccountForm(true)}>
                          Get Existing Account (EE Market)
                        </ProfileTextAction>
                        <ProfileTextAction onClick={() => setOpenDeactivateModal(true)}>
                          Deactivate Account
                        </ProfileTextAction>
                        <ProfileTextAction onClick={logout}>Logout</ProfileTextAction>
                      </Stack>
                    </Box>
                  </Stack>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={8}
                  lg={8}
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
                      <SectionHeader>Birth Date</SectionHeader>
                      <SectionText>
                        {user.birthday && moment(user.birthday).format('MM/DD/YYYY')}
                      </SectionText>
                    </Stack>

                    <Divider />

                    <Stack gap="12px">
                      <SectionHeader>Gender</SectionHeader>
                      <SectionText>
                        {user.gender && user.gender.replace(/^[a-z]/, (char) => char.toUpperCase())}
                      </SectionText>
                    </Stack>

                    <Divider />

                    <Stack gap="12px">
                      <SectionHeader>Phone Number</SectionHeader>
                      <SectionText>{user.phone && user.phone}</SectionText>
                      <Stack flexDirection="row">
                        <CButton onClick={handleClickChangePhonenumber}>
                          CHANGE PHONE NUMBER
                        </CButton>
                      </Stack>
                    </Stack>

                    <Divider />

                    <Stack gap="12px">
                      <SectionHeader>bank Account</SectionHeader>
                      {bankAccount ? (
                        <SectionText>{`${bankAccount.bank ?? ''} ${
                          bankAccount.accountNumber ?? ''
                        }`}</SectionText>
                      ) : null}
                      <Stack flexDirection="row">
                        <CButton
                          onClick={() => {
                            setIsOpenBankAccountForm(true);
                          }}
                        >
                          {bankAccount ? 'Change Account' : 'ADD'}
                        </CButton>
                      </Stack>
                    </Stack>

                    <Divider />

                    <Box>
                      <SectionHeader>WALLET ADDRESS</SectionHeader>
                      <form>
                        <Stack
                          gap="12px"
                          sx={{
                            mt: '12px',
                            width: '100%',
                            maxWidth: '100%',
                          }}
                        >
                          {user.abc_address && (
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'space-between',
                                gap: '12px',
                              }}
                            >
                              <Stack direction="row" alignItems="center" gap="2px">
                                <Image
                                  alt="abc-logo"
                                  src="/assets/icons/abc-logo.png"
                                  sx={{ width: '24px' }}
                                />
                                <SectionText
                                  sx={{
                                    wordBreak: 'break-word',
                                    minWidth: isMobile ? '80px' : '325px',
                                  }}
                                >
                                  {isMobile ? getShotAddress(user.abc_address) : user.abc_address}
                                </SectionText>
                              </Stack>

                              <Stack
                                sx={{
                                  boxSizing: 'border-box',
                                  display: 'flex',
                                  flexDirection: 'row',
                                  width: isMobile ? '100px' : '250px',
                                }}
                              >
                                <CopyButton
                                  content={user.abc_address}
                                  onClick={() => handleClickCopy(user?.abc_address)}
                                />
                                <HyperlinkButton onClick={() => moveToScope(user?.abc_address)} />
                              </Stack>
                            </Box>
                          )}

                          {user.eth_address && (
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'space-between',
                                gap: '12px',
                              }}
                            >
                              <Stack direction="row" alignItems="center" gap="2px">
                                <Image
                                  alt="metamask-logo"
                                  src="/assets/icons/metamask-logo.png"
                                  sx={{ width: '24px' }}
                                />
                                <SectionText
                                  flex={1}
                                  sx={{
                                    wordBreak: 'break-word',
                                    minWidth: isMobile ? '80px' : '325px',
                                  }}
                                >
                                  {isMobile ? getShotAddress(user.eth_address) : user.eth_address}
                                </SectionText>
                              </Stack>

                              <Stack
                                sx={{
                                  boxSizing: 'border-box',
                                  display: 'flex',
                                  flexDirection: 'row',
                                  width: isMobile ? '100px' : '250px',
                                }}
                              >
                                <CopyButton
                                  content={user.eth_address}
                                  onClick={() => handleClickCopy(user?.eth_address)}
                                />
                                <HyperlinkButton onClick={() => moveToScope(user?.eth_address)} />
                                <IconButton
                                  sx={{
                                    borderRadius: '100%',
                                    width: '32px',
                                    height: '32px',
                                  }}
                                >
                                  <DeleteOutlineIcon
                                    sx={{ color: palette.dark.black.lighter, fontSize: '18px' }}
                                    onClick={handleDeleteAddressClick}
                                  />
                                </IconButton>
                              </Stack>
                            </Box>
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
                        {!abcUser.twoFactorEnabled && (
                          <CButton onClick={() => setIsOpenCreateWalletForm(true)}>
                            Activate Wallet
                          </CButton>
                        )}

                        {!user.eth_address && (
                          <CButton
                            onClick={() => {
                              setDoAddWallet(true);
                              setOpenSignUp(true);
                            }}
                          >
                            ADD External Wallet
                          </CButton>
                        )}

                        {/* {user.eth_address ? ( */}

                        {/* ) : null} */}
                      </Box>

                      {openSignUp && (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <CButton
                            onClick={async () => {
                              await connectWallet(WALLET_METAMASK);
                              setRefetchUserInfo(true);
                            }}
                          >
                            Metamask
                          </CButton>

                          <CButton
                            onClick={async () => {
                              await connectWallet(WALLET_WALLECTCONNECT);
                              setRefetchUserInfo(true);
                            }}
                          >
                            WalletConnect
                          </CButton>
                        </Box>
                      )}
                    </Stack>

                    <Divider sx={{ display: { xs: 'none', md: 'block' } }} />

                    {!isDesktop ? <RoundedButton onClick={logout}>Disconnect</RoundedButton> : null}
                  </Stack>
                </Grid>
              </Grid>
            </Box>
            <CSnackbar
              open={openSnackbar.open}
              type={openSnackbar.type}
              message={openSnackbar.message}
              handleClose={handleCloseSnackbar}
            />
          </MyAccountWrapper>
        )}

        <MyWalletModal
          open={myWalletModalState.open}
          onClose={resetMyWalletModalState}
          walletAddress={myWalletModalState.walletAddress}
          iconSrc={myWalletModalState.iconSrc}
        />

        <ModalCustom
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={isOpenCreateWalletForm}
          onClose={() => {
            setIsOpenCreateWalletForm(false);
          }}
        >
          <CreateWalletForm onClose={() => setIsOpenCreateWalletForm(false)} />
        </ModalCustom>

        <ModalCustom
          open={isOpenBankAccountForm}
          onClose={() => {
            setIsOpenBankAccountForm(false);
            setRefetchUserInfo(true);
          }}
        >
          <RegisterAccount
            bankAccount={bankAccount}
            setOpenSnackbar={setOpenSnackbar}
            setIsOpenBankAccountForm={setIsOpenBankAccountForm}
          />
        </ModalCustom>

        <ModalCustom
          open={isOpenImportAccountForm}
          onClose={() => setIsOpenImportAccountForm(false)}
        >
          <ImportEETickets />
        </ModalCustom>

        <ModalCustom
          open={isOpenTransfer.open}
          onClose={() => setIsOpenTransfer({ open: false, token: '', amount: 0 })}
        >
          <Transfer
            token={isOpenTransfer.token}
            amount={isOpenTransfer.amount}
            onClose={() => setIsOpenTransfer({ open: false, token: '', amount: 0 })}
          />
        </ModalCustom>

        <ModalCustom
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openDeactivateModal}
          onClose={onCloseDeactivateModal}
        >
          <Stack gap={3}>
            <PriorityHigh sx={{ fontSize: '36px' }} />
            <Stack gap={1}>
              <SectionText>
                If you withdraw from the membership, all information and records accumulated while
                signing up/using the service with the account will be deleted and cannot be
                recovered.
              </SectionText>

              <SectionText>
                If you have points accumulated with the account, they will disappear permanently
                with the withdrawal of membership, so please check in advance and exhaust them
                before withdrawing.
              </SectionText>
            </Stack>
            <Stack>
              <Divider />
              <FormControlLabel
                value={isConfirmDeactivate}
                control={
                  <Checkbox
                    sx={{
                      padding: '8px',

                      '&:hover': {
                        background: 'transparent',
                      },
                      [`.${svgIconClasses.root}`]: {
                        width: '16px',
                        height: '16px',
                      },
                    }}
                  />
                }
                onChange={() => setIsConfirmDeactivate(!isConfirmDeactivate)}
                label={
                  'I have checked all of the above and agree that all information cannot be recovered upon withdrawal.'
                }
                sx={{
                  alignItems: 'flex-start',
                  color: palette.dark.black.lighter,
                  marginLeft: '-8px',
                  [`.${formControlLabelClasses.label}`]: {
                    marginTop: '8px',
                    fontSize: 12,
                    lineHeight: 16 / 12,
                  },
                }}
              />
            </Stack>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              <RoundedButton onClick={onCloseDeactivateModal}>Cancel</RoundedButton>
              <RoundedButton
                disabled={!isConfirmDeactivate}
                variant="inactive"
                sx={{ color: palette.dark.common.black }}
                onClick={handleClickDeactivate}
              >
                Deactivate
              </RoundedButton>
            </Box>
          </Stack>
        </ModalCustom>
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
