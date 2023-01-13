import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { abcLogin, getSession, userRegister } from '../src/services/services';
import Layout from '../src/layouts';
import SupportPage from './support';
import { Page } from '../src/components';
import { Box, Button, Checkbox, FormControlLabel, Input } from '@mui/material';
import { styled } from '@mui/material/styles';
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from '../src/config';

// TODO : dkeys WASM Go Initialize...
import '../src/abc/sandbox/index';
import { controllers, accountRestApi } from '../src/abc/background/init';
import { AbcLoginResult, AbcSnsAddUserDto } from '../src/abc/main/abc/interface';
import { setAbcAuth } from '../src/store/slices/abcAuth';
import { setTwoFa } from '../src/store/slices/twoFa';

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));
export default function Register(effect: React.EffectCallback, deps?: React.DependencyList) {
  const dispatch = useDispatch();
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

  const handleAbcTokenChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { value } = event.target;
    setOtpToken(value);
    // console.log(value);
  };

  const handleAbcConfirmClick = async () => {
    console.log('click confirm.');

    // // optToken : 입력 받은 OTP 값을 입력 받은 후 아래 코드 실행
    const twofaResetCode = await accountController.verifyTwoFactorGen({ token: otpToken });
    dispatch(setTwoFa({ secret: qrSecret, reset: twofaResetCode }));
    setResetCode(twofaResetCode);
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
    const result = await abcLogin({
      token: idToken,
      service,
      audience: 'https://mw.myabcwallet.com',
    });
    console.log('=== abcLogin ===>', result.data.msg);
    const flCreate = result.data.msg !== undefined ? true : false;

    let abcAuth: AbcLoginResult;
    if (flCreate) {
      const sixCode = JSON.parse(result.data.msg).sixcode;
      console.log('=== sixcode ===>', sixCode);
      const dto: AbcSnsAddUserDto = {
        username: email,
        code: sixCode,
        overage: isCheck.check1 ? 1 : 0,
        agree: isCheck.check2 ? 1 : 0,
        collect: isCheck.check3 ? 1 : 0,
        advertise: isCheck.check4 ? 1 : 0,
        thirdparty: isCheck.check5 ? 1 : 0,
      };
      const newAccount = await abcController.snsAddUser(dto);
      console.log('== created account =>', newAccount);
    }

    console.log('=== start to sns login =====');
    abcAuth = await abcController.snsLogin(idToken, service);
    console.log('==========> ', abcAuth);

    await dispatch(setAbcAuth(abcAuth));
    window.localStorage.setItem('abcAuth', JSON.stringify(abcAuth));

    if (flCreate) {
      await accountController.createMpcBaseAccount({
        accountName: email,
        password: '!owdin001',
        email: email,
      });

      const { qrcode, secret } = await accountController.generateTwoFactor({ reset: false });
      console.log('!!!!!!!!!!!', qrcode, secret);
      setQrCode(qrcode);
      setQrSecret(secret);

      // TODO 준호 : 화먄에 qrCode 및 qrSecret 표시 후 otp 값을 입력 받아야 함.
      // console.log('=== qrCode ===>', qrCode);
      // <img className="QRCode" src={qrCode} alt="qrapp" />
    } else {
      // Recover wallet
      const { user, wallets } = await accountRestApi.getWalletsAndUserByAbcUid(abcAuth);
      console.log('====== user =====>', user);

      await accountController.recoverShare(
        { password: '!owdin001', user, wallets, undefined },
        dispatch
      );
    }

    // // TODO : ABC Wallet 가입 성공하면... 우리 쪽 가입 실행
    // const res = await userRegister();
    // console.log(res);
    // if (res.status === 200) {
    //   // 성공. 리다이렉트..
    //   alert('가입이 완료되었습니다. 다시 로그인 해주세요.');
    //   location.replace('/');
    // }
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
      }
    };
    fetchSession();
  }, []);

  return (
    <Page title="Register">
      <RootStyle>
        <Box sx={{ border: '1px solid white', borderRadius: '15px', p: 2 }}>
          <Box>
            <h1>Register</h1>
          </Box>
          <Box>
            <FormControlLabel
              control={<Checkbox checked={isCheckAll} onClick={handleCheckAll} />}
              label="전체동의"
            />
          </Box>
          <Box>
            <FormControlLabel
              control={
                <Checkbox checked={isCheck.check1} onClick={() => handleCheckItem('check1')} />
              }
              label="약관1"
            />
            <FormControlLabel
              control={
                <Checkbox checked={isCheck.check2} onClick={() => handleCheckItem('check2')} />
              }
              label="약관2"
            />
            <FormControlLabel
              control={
                <Checkbox checked={isCheck.check3} onClick={() => handleCheckItem('check3')} />
              }
              label="약관3"
            />
            <FormControlLabel
              control={
                <Checkbox checked={isCheck.check4} onClick={() => handleCheckItem('check4')} />
              }
              label="약관4"
            />
            <FormControlLabel
              control={
                <Checkbox checked={isCheck.check5} onClick={() => handleCheckItem('check5')} />
              }
              label="약관5"
            />
          </Box>
          <Box>
            <Button
              onClick={handleClickRegister}
              disabled={!isCheck.check1 || !isCheck.check2 || !isCheck.check3 || !isCheck.check4}
              variant={'outlined'}
            >
              가입
            </Button>
          </Box>
        </Box>
        {qrCode && (
          <Box sx={{ border: '1px solid white', borderRadius: '15px', p: 2, my: 2 }}>
            <Box>
              <img className="QRCode" src={qrCode} alt="qrapp" />
              <Box>{qrSecret}</Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Input
                sx={{ color: 'white' }}
                // fullWidth={true}
                id="outlined-basic"
                value={otpToken}
                onChange={handleAbcTokenChange}
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
      </RootStyle>
    </Page>
  );
}

Register.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
