import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { abcLogin, getSession, userRegister } from '../src/services/services';
import Layout from '../src/layouts';
import { Page } from '../src/components';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  Input,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from '../src/config';

import secureLocalStorage from 'react-secure-storage';

// TODO : dkeys WASM Go Initialize...
import '../src/abc/sandbox/index';
import { controllers, accountRestApi } from '../src/abc/background/init';
import { AbcLoginResult, AbcSnsAddUserDto } from '../src/abc/main/abc/interface';
import { setAbcAuth } from '../src/store/slices/abcAuth';
import { setTwoFa } from '../src/store/slices/twoFa';
import { setProvider } from '../src/store/slices/webUser';
import { AbcLoginResponse } from '../src/abc/schema/account';

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));
export default function Register(effect: React.EffectCallback, deps?: React.DependencyList) {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const twoFa = useSelector((state: any) => state.twoFa);
  const { abcController, accountController } = controllers;
  const [isCheck, setIsCheck] = useState({
    check1: false,
    check2: false,
    check3: false,
    check4: false,
    check5: false,
  });
  const [isCheckAll, setIsCheckAll] = useState(isCheck.check1 && isCheck.check2 && isCheck.check3);
  const [idToken, setIdToken] = useState('');
  const [service, setService] = useState('');
  const [email, setEmail] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [qrSecret, setQrSecret] = useState('');
  const [memberCheck, setMemberCheck] = useState(true);

  const handleAbcTokenChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { value } = event.target;
    setOtpToken(value);
    // console.log(value);
  };

  const handleAbcConfirmClick = async () => {
    // // optToken : 입력 받은 OTP 값을 입력 받은 후 아래 코드 실행
    const twofaResetCode = await accountController.verifyTwoFactorGen({ token: otpToken });
    // console.log('=== 가입 완료 단계 ===>', qrSecret, twofaResetCode);
    dispatch(setTwoFa({ secret: qrSecret, reset: twofaResetCode }));
    setResetCode(twofaResetCode);

    // // TODO : ABC Wallet 가입 성공하면... 우리 쪽 가입 실행
    if (twofaResetCode !== null && twofaResetCode !== '') {
      const res = await userRegister({ abc_address: user.accounts[0].ethAddress });
      console.log(res);
      if (res.status === 200) {
        // 성공. 리다이렉트..
        alert('가입이 완료되었습니다. 다시 로그인 해주세요.');
        location.replace('/');
      }
    }
  };

  const handleCheckItem = (check: 'check1' | 'check2' | 'check3' | 'check4' | 'check5') => {
    const newCheck = { ...isCheck, [check]: !isCheck[check] };
    setIsCheck(newCheck);
  };
  // const isCheckAll = isCheck.check1 && isCheck.check2 && isCheck.check3;
  const handleCheckAll = () => {
    setIsCheckAll((cur) => !cur);
    setIsCheck({
      check1: !isCheckAll,
      check2: !isCheckAll,
      check3: !isCheckAll,
      check4: !isCheckAll,
      check5: !isCheckAll,
    });
  };

  const handleClickRegister = async () => {
    // ABC Wallet 로그임
    const result = await abcLogin({
      token: idToken,
      service,
      audience: 'https://mw.myabcwallet.com',
    });

    // 기 가입자인지 신규 가입자인지 확인
    console.log('=== abcLogin ===>', result.data.msg);
    const flCreate = result.data.msg !== undefined ? true : false;

    let abcAuth: AbcLoginResult = {
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: 0,
    };

    if (flCreate) {
      // 신규 가립자 생성
      const sixCode = JSON.parse(result.data.msg).sixcode;
      console.log('=== sixcode ===>', sixCode);
      const dto: AbcSnsAddUserDto = {
        username: email,
        code: sixCode,
        joinpath: 'https://colligence.io',
        overage: isCheck.check1 ? 1 : 0,
        agree: isCheck.check2 ? 1 : 0,
        collect: isCheck.check3 ? 1 : 0,
        advertise: isCheck.check4 ? 1 : 0,
        thirdparty: isCheck.check5 ? 1 : 0,
      };
      const newAccount = await abcController.snsAddUser(dto);
      console.log('== created account =>', newAccount);

      // 신규 가입 후 ABC 로그인
      console.log('=== start to sns login =====');
      abcAuth = await abcController.snsLogin(idToken, service);
      console.log('==========> ', abcAuth);
    } else {
      // 기 가입자 토큰 처리
      if (result.data.data !== null) {
        const resData = AbcLoginResponse.parse(result.data);
        abcAuth = {
          accessToken: resData.access_token,
          refreshToken: resData.refresh_token,
          tokenType: resData.token_type,
          expiresIn: resData.expire_in,
        };
      } else {
        // TODO : What ?
        console.log('===== ABC Wallet ... SNS Login ... Failed !! =====');
      }
    }

    // 새 토큰 저장
    await dispatch(setAbcAuth(abcAuth));
    // window.localStorage.setItem('abcAuth', JSON.stringify(abcAuth));
    secureLocalStorage.setItem('abcAuth', JSON.stringify(abcAuth));

    // 신규 가입자 지갑 생성
    if (flCreate) {
      await accountController.createMpcBaseAccount(
        {
          accountName: email,
          password: '!owdin001',
          email: email,
        },
        dispatch
      );
      console.log('===== createMpcBaseAccount ... done =====');
    }

    if (flCreate || twoFa.reset.length === 0) {
      // 신규 가입자 OTP 등록
      const { qrcode, secret } = await accountController.generateTwoFactor({ reset: false });
      console.log('!!!!!!!!!!!', qrcode, secret);
      setQrCode(qrcode);
      setQrSecret(secret);
    } else {
      // 기 가입자 지갑 복구
      const { user, wallets } = await accountRestApi.getWalletsAndUserByAbcUid(abcAuth);
      console.log('====== user =====>', user);

      await accountController.recoverShare(
        { password: '!owdin001', user, wallets, keepDB: false },
        dispatch
      );
    }
  };

  // ABC Wallet 기가입자 중 users 테이블어 등록되지 않은 경우
  // Case 1 : 다른 서비스에서 ABC Wallet 기 가입자가  우리 서비스에 로그인 시 처리
  const tryRecoverABC = async (token: string, serv: string) => {
    // ABC Wallet 로그임
    const result = await abcLogin({
      token: token,
      service: serv,
      audience: 'https://mw.myabcwallet.com',
    });

    // 기 가입자인지 신규 가입자인지 확인
    const flCreate = result.data.msg !== undefined ? true : false;

    let abcAuth: AbcLoginResult = {
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: 0,
    };

    if (!flCreate) {
      // 기 가입자 토큰 처리
      if (result.data.data !== null) {
        const resData = AbcLoginResponse.parse(result.data);
        abcAuth = {
          accessToken: resData.access_token,
          refreshToken: resData.refresh_token,
          tokenType: resData.token_type,
          expiresIn: resData.expire_in,
        };
      } else {
        // TODO : What ?
        console.log('===== ABC Wallet ... SNS Login ... Failed !! =====');
      }

      // 새 토큰 저장
      await dispatch(setAbcAuth(abcAuth));
      // window.localStorage.setItem('abcAuth', JSON.stringify(abcAuth));
      secureLocalStorage.setItem('abcAuth', JSON.stringify(abcAuth));

      // 기 가입자 지갑 복구
      const { user, wallets } = await accountRestApi.getWalletsAndUserByAbcUid(abcAuth);

      await accountController.recoverShare(
        { password: '!owdin001', user, wallets, keepDB: false },
        dispatch
      );

      const res = await userRegister({ abc_address: user.accounts[0].ethAddress });
      console.log(res);
      if (res.status === 200) {
        // 성공. 리다이렉트..
        alert('이미 가입되어 있습니다. 로그인 처리합니다.');
        location.replace('/');
      } else {
        setMemberCheck(false);
      }
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const res = await getSession();
      console.log('session res::::', res);
      if (res.data?.providerAuthInfo) {
        console.log('=====> ', res.data?.providerAuthInfo);
        const id_token = res.data?.providerAuthInfo?.provider_token;
        const service = res.data?.providerAuthInfo?.provider;
        const data = JSON.parse(res.data?.providerAuthInfo?.provider_data);
        console.log(service, id_token, data.email);
        setIdToken(id_token);
        setService(service);
        setEmail(data.email);
        dispatch(setProvider({ id_token, service }));

        // TODO : ABC Wallet 기가입자 인지 확인
        setMemberCheck(true);
        await tryRecoverABC(id_token, service);
      }
    };
    fetchSession();
  }, []);

  return (
    <Page title="Register">
      <RootStyle>
        <Container
          maxWidth={'xs'}
          sx={{
            my: 5,
            backgroundColor: '#fff',
            color: '#000',
            borderRadius: '40px',
          }}
        >
          {memberCheck ? (
            <Box
              sx={{
                minHeight: '300px',
                marginY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '2rem',
              }}
            >
              <CircularProgress />
              <Typography>ABC Wallet 가입여부 확인 중...</Typography>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  border: '1px solid white',
                  borderRadius: '15px',
                  p: 2,
                }}
              >
                <Box>
                  <h1>Register</h1>
                </Box>
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled={qrCode !== ''}
                        checked={isCheckAll}
                        onClick={handleCheckAll}
                      />
                    }
                    label="전체 약관에 동의합니다."
                  />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', paddingLeft: '15px' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled={qrCode !== ''}
                        checked={isCheck.check1}
                        onClick={() => handleCheckItem('check1')}
                      />
                    }
                    label="[필수] 14세 이상 사용자입니다."
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled={qrCode !== ''}
                        checked={isCheck.check2}
                        onClick={() => handleCheckItem('check2')}
                      />
                    }
                    label={
                      <p>
                        [필수]{' '}
                        <a
                          href="https://api.id.myabcwallet.com/query/terms?language=1&service=16"
                          target="_blank"
                          style={{ color: '#000' }}
                        >
                          이용약관
                        </a>
                        에 동의합니다.
                      </p>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled={qrCode !== ''}
                        checked={isCheck.check3}
                        onClick={() => handleCheckItem('check3')}
                      />
                    }
                    label={
                      <p>
                        [필수]{' '}
                        <a
                          href="https://api.id.myabcwallet.com/query/privacy?language=1&service=16"
                          target="_blank"
                          style={{ color: '#000' }}
                        >
                          개인정보 수집 및 이용
                        </a>
                        에 동의합니다.
                      </p>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled={qrCode !== ''}
                        checked={isCheck.check4}
                        onClick={() => handleCheckItem('check4')}
                      />
                    }
                    label={
                      <p>
                        [필수]{' '}
                        <a
                          href="https://api.id.myabcwallet.com/query/third-party?language=1&service=16"
                          target="_blank"
                          style={{ color: '#000' }}
                        >
                          개인정보 제3자 제공
                        </a>
                        에 동의합니다.
                      </p>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled={qrCode !== ''}
                        checked={isCheck.check5}
                        onClick={() => handleCheckItem('check5')}
                      />
                    }
                    label={
                      <p>
                        [선택]{' '}
                        <a
                          href="https://api.id.myabcwallet.com/query/marketing?language=1&service=16"
                          target="_blank"
                          style={{ color: '#000' }}
                        >
                          마케팅 활용 및 광고성 정보 수신
                        </a>
                        에 동의합니다.
                      </p>
                    }
                  />
                </Box>
                <Box sx={{ mt: '14px' }}>
                  <Button
                    onClick={handleClickRegister}
                    fullWidth
                    disabled={
                      !isCheck.check1 ||
                      !isCheck.check2 ||
                      !isCheck.check3 ||
                      !isCheck.check4 ||
                      qrCode !== ''
                    }
                    variant={'outlined'}
                  >
                    가입
                  </Button>
                </Box>
              </Box>
              {qrCode && (
                <Box sx={{ border: '1px solid white', borderRadius: '15px', p: 2, my: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <img className="QRCode" src={qrCode} alt="qrapp" />
                    {/*<Box>{qrSecret}</Box>*/}
                  </Box>
                  <Typography sx={{ fontSize: '12px', color: '#999999' }}>
                    Verification Code
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Input
                      fullWidth={true}
                      id="outlined-basic"
                      value={otpToken}
                      onChange={handleAbcTokenChange}
                      sx={{ color: '#000' }}
                    />
                    <Button
                      variant="outlined"
                      size="medium"
                      sx={{
                        // width: '100% !important',
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
                  {resetCode && <Box>{resetCode}</Box>}
                </Box>
              )}
            </>
          )}
        </Container>
      </RootStyle>
    </Page>
  );
}

Register.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
