import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  abcAddUser,
  abcLogin,
  getSession,
  resetPassword,
  updateAbcAddress,
  userRegister,
} from '../src/services/services';
import Layout from '../src/layouts';
import { Page } from '../src/components';
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  Fade,
  FormControlLabel,
  Input,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { Base64 } from 'js-base64';
import { styled } from '@mui/material/styles';
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from '../src/config';

import secureLocalStorage from 'react-secure-storage';

// TODO : dkeys WASM Go Initialize...
import '../src/abc/sandbox/index';
import { controllers, accountRestApi, services } from '../src/abc/background/init';
import { AbcAddUserDto, AbcLoginResult, AbcSnsAddUserDto } from '../src/abc/main/abc/interface';
import { setAbcAuth } from '../src/store/slices/abcAuth';
import { setTwoFa } from '../src/store/slices/twoFa';
import { setProvider } from '../src/store/slices/webUser';
import { AbcLoginResponse } from '../src/abc/schema/account';
import { useRouter } from 'next/router';
import { emitter } from 'next/client';
import { Deblur } from '@mui/icons-material';
import queryString from 'query-string';

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

export const NumberInput = styled(TextField)(() => ({
  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
    display: 'none',
  },
  '& input[type=number]': {
    MozAppearance: 'textfield',
  },
}));

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

export default function Register(effect: React.EffectCallback, deps?: React.DependencyList) {
  const router = useRouter();

  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const twoFa = useSelector((state: any) => state.twoFa);
  const { abcController, accountController } = controllers;
  const { abcService } = services;
  const [isCheck, setIsCheck] = useState({
    check1: false,
    check2: false,
    check3: false,
    check4: false,
    check5: false,
    check6: false,
    check7: false,
    check8: false,
    check9: false,
  });
  const [isCheckAbcAll, setIsCheckAbcAll] = useState(
    isCheck.check1 && isCheck.check2 && isCheck.check3 && isCheck.check4
  );
  const [isCheckEternalAll, setIsCheckEternalAll] = useState(
    isCheck.check6 && isCheck.check7 && isCheck.check8
  );
  const [idToken, setIdToken] = useState('');
  const [service, setService] = useState('');
  const [email, setEmail] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [qrSecret, setQrSecret] = useState('');
  const [memberCheck, setMemberCheck] = useState(true);
  const [qrOnly, setQrOnly] = useState(false);
  const [oldUser, setOldUser] = useState(false);
  const [password, setPassword] = useState(
    router.query.eternal ? Base64.decode(router.query.eternal as string) : undefined
  );
  const [emailCheckCode, setEmailCheckCode] = useState('');
  const [resetPass, setResetPass] = useState(false);
  const [rpEmailCheckCode, setRpEmailCheckCode] = useState('');
  const [rpPassword, setRpPassword] = useState('');
  const [rpConfirmPassword, setRpConfirmPassword] = useState('');
  // console.log(router);

  const handleChangeRpConfirmPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setRpConfirmPassword(event.target.value);
  };
  const handleChangeRpEmailCheckCode = (event: ChangeEvent<HTMLInputElement>) => {
    setRpEmailCheckCode(event.target.value);
  };

  const handleChangeRpPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setRpPassword(event.target.value);
  };

  const handleClickResetPassword = async () => {
    console.log('click reset password');
    console.log(email);
    console.log(rpEmailCheckCode);
    console.log(rpPassword);
    console.log(rpConfirmPassword);

    const result = await resetPassword({
      username: email,
      password: rpPassword,
      code: rpEmailCheckCode,
    });

    // const result = await abcController.initPassword({
    //   username: email,
    //   password: rpPassword,
    //   code: rpEmailCheckCode,
    // });

    console.log('!! Reset Password :', result);
    if (result?.status === 200) {
      alert('암호가 설정 되었습니다. 다시 로그인하세요.');
      location.replace('/');
    }
  };

  const handleResetPassClose = () => {
    setResetPass(false);
    location.replace('/');
  };

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

    // TODO : ABC Wallet 가입 성공하면... 우리 쪽 가입 실행
    if (twofaResetCode !== null && twofaResetCode !== '') {
      let res;
      if (oldUser) {
        res = await updateAbcAddress(user.accounts[0].ethAddress);
      } else {
        res = await userRegister({ abc_address: user.accounts[0].ethAddress });
      }
      console.log(res);
      if (res.status === 200) {
        // 성공. 리다이렉트..
        alert('가입이 완료되었습니다. 다시 로그인 해주세요.');
        location.replace('/');
      }
    }
  };

  const handleCheckItem = (
    check:
      | 'check1'
      | 'check2'
      | 'check3'
      | 'check4'
      | 'check5'
      | 'check6'
      | 'check7'
      | 'check8'
      | 'check9'
  ) => {
    const newCheck = { ...isCheck, [check]: !isCheck[check] };
    setIsCheck(newCheck);
  };
  // const isCheckAll = isCheck.check1 && isCheck.check2 && isCheck.check3;
  const handleCheckAbcAll = () => {
    setIsCheckAbcAll((cur) => !cur);
    setIsCheck({
      ...isCheck,
      check1: !isCheckAbcAll,
      check2: !isCheckAbcAll,
      check3: !isCheckAbcAll,
      check4: !isCheckAbcAll,
      check5: !isCheckAbcAll,
    });
  };

  const handleCheckEternalAll = () => {
    setIsCheckEternalAll((cur) => !cur);
    setIsCheck({
      ...isCheck,
      check6: !isCheckEternalAll,
      check7: !isCheckEternalAll,
      check8: !isCheckEternalAll,
      check9: !isCheckEternalAll,
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
    console.log('!! SNS user abc login =', result.data.msg);
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
      console.log('!! sixcode =', sixCode);
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
      console.log('!! created account =', newAccount);

      // 신규 가입 후 ABC 로그인
      console.log('!! start to abc sns login !!');
      abcAuth = await abcController.snsLogin(idToken, service);
      console.log('!! abc sns login result =', abcAuth);
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
      console.log('!! OPT =', qrcode, secret);
      setQrCode(qrcode);
      setQrSecret(secret);
    } else {
      // 기 가입자 지갑 복구
      const { user, wallets } = await accountRestApi.getWalletsAndUserByAbcUid(abcAuth);
      console.log('!! user =', user);

      await accountController.recoverShare(
        { password: '!owdin001', user, wallets, keepDB: false },
        dispatch
      );
    }
  };

  const handleChangeEmailCheckCode = (event: ChangeEvent<HTMLInputElement>) => {
    setEmailCheckCode(event.target.value);
  };

  const handleCRegisterOldUser = async () => {
    // Check Email Check Code
    const isEmailChecked = await abcController.verifyEmailAuthCode({
      email: email,
      code: emailCheckCode,
    });

    console.log('!! Email Check Result = ', isEmailChecked);

    if (!isEmailChecked) {
      alert('Email Check Code가 틀립니다. Email을 다시 확인하세요.');
    } else {
      // // ABC Wallet 로그인
      // const result = await abcController.login({
      //   grant_type: 'password',
      //   username: email,
      //   // @ts-ignore
      //   password: password,
      //   audience: 'https://mw.myabcwallet.com',
      // });
      //
      // // 기 가입자인지 신규 가입자인지 확인
      // console.log('!! old user abc login result =', result);
      // let flCreate = false;
      // if ('code' in result) {
      //   flCreate = result?.code !== undefined && result?.code === 601;
      // }

      let abcAuth: AbcLoginResult = {
        accessToken: '',
        refreshToken: '',
        tokenType: '',
        expiresIn: 0,
      };

      // if (flCreate) {
      // 신규 가립자 생성
      console.log('!! emailCheckCode =', emailCheckCode);
      const dto: AbcAddUserDto = {
        username: email,
        // @ts-ignore
        password: password,
        code: emailCheckCode,
        serviceid: 'https://mw.myabcwallet.com',
        overage: isCheck.check1 ? 1 : 0,
        agree: isCheck.check2 ? 1 : 0,
        collect: isCheck.check3 ? 1 : 0,
        advertise: isCheck.check4 ? 1 : 0,
        thirdparty: isCheck.check5 ? 1 : 0,
      };
      console.log('!! user info =', dto);
      // TODO : 브라우저에서 요청 시에는 CORS 발생
      // const newAccount = await abcController.addUser(dto);
      const newAccount = await abcAddUser(dto);
      console.log('!! created account =', newAccount);

      const isExist = await abcController.getUser({
        email: email,
        successIfUserExist: true,
      });
      console.log('!! addUser =', isExist);

      if (isExist) {
        // 신규 가입 후 ABC 로그인
        console.log('!! start to id/pass login !!');
        abcAuth = await abcController.login({
          grant_type: 'password',
          username: email,
          // @ts-ignore
          password: password,
          audience: 'https://mw.myabcwallet.com',
        });
        console.log('!! id/pass login result =', abcAuth);
        // } else {
        //   // 기 가입자 토큰 처리
        //   if (!flCreate && result !== null) {
        //     abcAuth = result;
        //   } else {
        //     // TODO : What ?
        //     console.log('===== ABC Wallet ... ID/PASS Login ... Failed !! =====');
        //   }
        // }

        if ('code' in abcAuth) {
          alert('로그인에 실패 했습니다.');
        } else {
          // 새 토큰 저장
          await dispatch(setAbcAuth(abcAuth));
          // window.localStorage.setItem('abcAuth', JSON.stringify(abcAuth));
          secureLocalStorage.setItem('abcAuth', JSON.stringify(abcAuth));

          // 신규 가입자 지갑 생성
          // if (flCreate) {
          await accountController.createMpcBaseAccount(
            {
              accountName: email,
              password: '!owdin001',
              email: email,
            },
            dispatch
          );
          console.log('===== createMpcBaseAccount ... done =====');
          // }

          // if (flCreate || twoFa.reset.length === 0) {
          // 신규 가입자 OTP 등록
          const { qrcode, secret } = await accountController.generateTwoFactor({ reset: false });
          console.log('!! OTP =', qrcode, secret);
          setQrCode(qrcode);
          setQrSecret(secret);
          // } else {
          //   // 기 가입자 지갑 복구
          //   const { user, wallets } = await accountRestApi.getWalletsAndUserByAbcUid(abcAuth);
          //   console.log('!! user =', user);
          //
          //   await accountController.recoverShare(
          //     { password: '!owdin001', user, wallets, keepDB: false },
          //     dispatch
          //   );
          // }
        }
      }
    }
  };

  // ABC Wallet 기가입자 중 users 테이블어 등록되지 않은 경우
  // Case 1 : 다른 서비스에서 ABC Wallet 기 가입자가  우리 서비스에 로그인 시 처리
  const tryRecoverABC = async (
    token: string | undefined,
    serv: string | undefined,
    loginEmail: string | undefined,
    flag: boolean // true = old user, false = sns user
  ) => {
    let result = null;
    let flCreate = false;
    let loginFail = false;

    let abcAuth: AbcLoginResult = {
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: 0,
    };

    console.log('!! oldUser ? ', flag);
    // ABC Wallet 로그임
    if (flag) {
      console.log('!! login info =', loginEmail, password);

      const isExist = await abcController.getUser({
        email: loginEmail!,
        successIfUserExist: true,
      });
      console.log('!! getUser =', isExist);

      if (isExist) {
        result = await abcController.login({
          grant_type: 'password',
          username: loginEmail!,
          // @ts-ignore
          password,
          audience: 'https://mw.myabcwallet.com',
        });
        // 기 가입자인지 신규 가입자인지 확인
        console.log('!! tryRecoverABC login result =', result);
        if ('code' in result) {
          flCreate = result?.code !== undefined && result?.code === 601;
          if (result?.code === 602) loginFail = true;
        }

        // 기 가입자 토큰 처리
        if (!flCreate && result !== null && !loginFail) {
          abcAuth = result;
        } else {
          // TODO : What ?
          if (loginFail) {
            // alert(
            //   '로그인에 실패했습니다. uaername과 password를 다시 확인하세요. 구글 또는 페이스북으로 이미 가입하신 사용자는 지갑암호 설정이 필요합니다. 지갑암호 설정 메뉴를 확인하세요.',
            // );
            console.log('!! send check code to ', loginEmail);
            // Send Email Check Code
            result = await abcController.sendEmailAuthCode({
              email: loginEmail!,
              template: 'initpassword',
            });
            alert('Email Check Code를 입력하신 Email로 발송했습니다.');
            setResetPass(true);
          }
          // console.log('===== ABC Wallet ... Login ... Failed !! =====');
          // location.replace('/');
        }
      } else {
        flCreate = true;

        console.log('!! send check code to ', loginEmail);
        // Send Email Check Code
        result = await abcController.sendEmailAuthCode({
          email: loginEmail!,
        });
        alert('Email Check Code를 입력하신 Email로 발송했습니다.');
      }
    } else {
      const isExist = await abcController.getUser({
        email: email,
        successIfUserExist: true,
      });
      console.log('!! getUser =', isExist);

      result = await abcLogin({
        token: token,
        service: serv,
        audience: 'https://mw.myabcwallet.com',
      });
      // 기 가입자인지 신규 가입자인지 확인
      console.log('!! tryRecoverABC login result =', result.data);
      flCreate = result.data.msg !== undefined ? true : false;

      // 기 가입자 토큰 처리
      if (!flCreate && result.data.data !== null) {
        const resData = AbcLoginResponse.parse(result.data);
        abcAuth = {
          accessToken: resData.access_token,
          refreshToken: resData.refresh_token,
          tokenType: resData.token_type,
          expiresIn: resData.expire_in,
        };
      } else {
        // TODO : What ?
        if (flCreate) alert('신규 가입을 진행하겠습니다.');
        else alert('로그인에 실패했습니다. SNS 계정을 다시 확인하세요.');
        console.log('===== ABC Wallet ... SNS Login ... Failed !! =====');
      }
    }

    if (!flCreate && !loginFail) {
      console.log('=== abcAuth ===', abcAuth);
      // 새 토큰 저장
      await dispatch(setAbcAuth(abcAuth));
      // window.localStorage.setItem('abcAuth', JSON.stringify(abcAuth));
      secureLocalStorage.setItem('abcAuth', JSON.stringify(abcAuth));

      // 기 가입자 지갑 복구
      const { user, wallets } = await accountRestApi.getWalletsAndUserByAbcUid(abcAuth);
      console.log('!! getWalletsAndUserByAbcUid =', user, wallets);

      await accountController.recoverShare(
        { password: '!owdin001', user, wallets, keepDB: false },
        dispatch
      );

      if (flag) {
        // OLD User
        if (!user.twoFactorEnabled) {
          setMemberCheck(false);
          // TODO : OTP 미등록 상태 처리
          const { qrcode, secret } = await accountController.generateTwoFactor({ reset: false });
          console.log('!! OTP =', qrcode, secret);
          setQrCode(qrcode);
          setQrSecret(secret);
          setQrOnly(true);
        } else {
          // 성공. 리다이렉트..
          alert('이미 가입되어 있습니다. 로그인 처리합니다.');
          location.replace('/');
        }
      } else {
        // New SNS User
        console.log('!! ABC Address =', user.accounts[0].ethAddress);

        // ABC 기가입자로 DB에 사용자 정보가 없어서 신규로 생성
        const res = await userRegister({ abc_address: user.accounts[0].ethAddress });
        console.log(res);
        if (res.status === 200) {
          if (!user.twoFactorEnabled) {
            setMemberCheck(false);
            // TODO : OTP 미등록 상태 처리
            const { qrcode, secret } = await accountController.generateTwoFactor({ reset: false });
            console.log('!! OTP =', qrcode, secret);
            setQrCode(qrcode);
            setQrSecret(secret);
            setQrOnly(true);
          } else {
            // 성공. 리다이렉트..
            alert('이미 가입되어 있습니다. 로그인 처리합니다.');
            location.replace('/');
          }
        } else {
          setMemberCheck(false);
        }
      }
    } else if (!loginFail) {
      setMemberCheck(false);
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const res = await getSession();
      console.log('session res::::', res);
      let id_token: string;
      let service: string;
      let loginEmail: string;
      let flag: boolean;

      if (res.data?.providerAuthInfo) {
        console.log('!! Session Info =', res.data?.providerAuthInfo);
        id_token = res.data?.providerAuthInfo?.provider_token;
        service = res.data?.providerAuthInfo?.provider;
        const data = JSON.parse(res.data?.providerAuthInfo?.provider_data);
        console.log(service, id_token, data.email);
        setIdToken(id_token);
        setService(service);
        setEmail(data.email);
        dispatch(setProvider({ id_token, service }));
        flag = false; // SNS User
      } else {
        setOldUser(true);
        loginEmail = res.data?.dropsUser?.email;
        setEmail(loginEmail);
        flag = true; // ID Pass Old User
      }

      // TODO : ABC Wallet 기가입자 인지 확인
      setMemberCheck(true);
      // @ts-ignore
      await tryRecoverABC(id_token, service, loginEmail, flag);
    };
    fetchSession();
  }, []);

  return (
    <Page title="Register">
      <RootStyle>
        <Container
          maxWidth={'sm'}
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
              {!qrOnly && (
                <Box
                  sx={{
                    border: '1px solid white',
                    borderRadius: '15px',
                    p: 2,
                  }}
                >
                  <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h1>회원가입</h1>
                  </Box>
                  <Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          disabled={qrCode !== ''}
                          checked={isCheckEternalAll}
                          onClick={handleCheckEternalAll}
                        />
                      }
                      label="Eternal Editions의 모든 약관에 동의합니다."
                    />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', paddingLeft: '15px' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          disabled={qrCode !== ''}
                          checked={isCheck.check6}
                          onClick={() => handleCheckItem('check6')}
                        />
                      }
                      label={
                        <p>
                          [필수]{' '}
                          <a href="" target="_blank" style={{ color: '#000' }}>
                            이용약관
                          </a>
                          을 모두 확인하였으며, 이에 동의합니다.
                        </p>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          disabled={qrCode !== ''}
                          checked={isCheck.check7}
                          onClick={() => handleCheckItem('check7')}
                        />
                      }
                      label={
                        <p>
                          [필수]{' '}
                          <a href="" target="_blank" style={{ color: '#000' }}>
                            개인정보처리방침
                          </a>
                          을 모두 확인하였으며, 이에 동의합니다.
                        </p>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          disabled={qrCode !== ''}
                          checked={isCheck.check8}
                          onClick={() => handleCheckItem('check8')}
                        />
                      }
                      label={
                        <p>
                          [필수]{' '}
                          <a href="" target="_blank" style={{ color: '#000' }}>
                            개인정보 제3자 제공 동의
                          </a>
                          를 모두 확인하였으며, 이에 동의합니다.
                        </p>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          disabled={qrCode !== ''}
                          checked={isCheck.check9}
                          onClick={() => handleCheckItem('check9')}
                        />
                      }
                      label={
                        <p>
                          [선택]{' '}
                          <a href="" target="_blank" style={{ color: '#000' }}>
                            마케팅 활용 및 광고성 정보 수신
                          </a>
                          에 동의합니다.
                        </p>
                      }
                    />
                  </Box>
                  <Divider sx={{ marginY: '10px' }} />
                  <Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          disabled={qrCode !== ''}
                          checked={isCheckAbcAll}
                          onClick={handleCheckAbcAll}
                        />
                      }
                      label="ABC WALLET의 모든 약관에 동의합니다."
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
                            rel="noreferrer"
                          >
                            이용약관을
                          </a>
                          모두 확인하였으며, 이에 동의합니다.
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
                            rel="noreferrer"
                          >
                            개인정보 수집 및 이용
                          </a>
                          을 모두 확인하였으며, 이에 동의합니다.
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
                            rel="noreferrer"
                          >
                            개인정보 제3자 제공 동의
                          </a>
                          를 모두 확인하였으며, 이에 동의합니다.
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
                            rel="noreferrer"
                          >
                            마케팅 활용 및 광고성 정보 수신
                          </a>
                          에 동의합니다.
                        </p>
                      }
                    />
                  </Box>
                  {oldUser && (
                    <Box sx={{ marginY: '20px' }}>
                      {/*<Typography>Email Check Code</Typography>*/}
                      <NumberInput
                        label="Email Check Code"
                        variant="outlined"
                        fullWidth
                        size={'small'}
                        inputProps={{ style: { color: '#999999' } }}
                        value={emailCheckCode}
                        onChange={handleChangeEmailCheckCode}
                      />
                    </Box>
                  )}
                  <Box sx={{ mt: '14px' }}>
                    <Button
                      onClick={oldUser ? handleCRegisterOldUser : handleClickRegister}
                      fullWidth
                      disabled={
                        !isCheck.check1 ||
                        !isCheck.check2 ||
                        !isCheck.check3 ||
                        !isCheck.check4 ||
                        !isCheck.check6 ||
                        !isCheck.check7 ||
                        !isCheck.check8 ||
                        qrCode !== ''
                      }
                      variant={'outlined'}
                    >
                      가입
                    </Button>
                  </Box>
                </Box>
              )}
              {qrCode && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '2rem',
                    border: '1px solid white',
                    borderRadius: '15px',
                    p: 2,
                    my: 2,
                  }}
                >
                  <Typography>Register 2FA Google OTP</Typography>
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
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={resetPass}
            // onClose={handleResetPassClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={resetPass}>
              <Box sx={modalStyle}>
                <Box sx={{ fontSize: '16px' }}>
                  {`암호가 변경되었거나 구글/페이스북으로 이미 가입하신 사용자는 지갑암호
                  (재)설정이 필요합니다.`}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    fontSize: '14px',
                    marginTop: '20px',
                  }}
                >
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    Email Check Code
                    <NumberInput
                      type="number"
                      variant="outlined"
                      autoComplete="off"
                      size={'small'}
                      inputProps={{ style: { color: '#999999' } }}
                      value={rpEmailCheckCode}
                      onChange={handleChangeRpEmailCheckCode}
                      // value={emailCheckCode}
                      // onChange={handleChangeEmailCheckCode}
                    />
                  </Box>
                  <Box sx={{ fontSize: '12px' }}>{`* ${email}로 발송된 확인 코드 사용`}</Box>
                  <Divider sx={{ marginY: '14px' }} />
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    Eternal Password
                    <TextField
                      type="password"
                      variant="outlined"
                      autoComplete="off"
                      size={'small'}
                      inputProps={{ style: { color: '#999999' } }}
                      value={rpPassword}
                      onChange={handleChangeRpPassword}
                    />
                  </Box>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    Password Confirm
                    <TextField
                      type="password"
                      variant="outlined"
                      autoComplete="off"
                      size={'small'}
                      inputProps={{ style: { color: '#999999' } }}
                      value={rpConfirmPassword}
                      onChange={handleChangeRpConfirmPassword}
                    />
                  </Box>
                  <Box
                    sx={{ fontSize: '12px' }}
                  >{`* 기존 이터널 로그인 비번과 빈드시 동일하게 설정하세요.`}</Box>
                  {rpPassword !== rpConfirmPassword && (
                    <Box
                      sx={{
                        fontSize: '12px',
                        color: 'red',
                        textAlign: 'center',
                      }}
                    >
                      패스워드가 일치하지 않습니다.
                    </Box>
                  )}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '10px',
                      gap: '1rem',
                    }}
                  >
                    <Button variant={'outlined'} fullWidth onClick={handleResetPassClose}>
                      Cancel
                    </Button>
                    <Button
                      variant={'outlined'}
                      fullWidth
                      disabled={rpEmailCheckCode === '' || rpPassword !== rpConfirmPassword}
                      onClick={handleClickResetPassword}
                    >
                      OK
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Fade>
          </Modal>
        </Container>
      </RootStyle>
    </Page>
  );
}

Register.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
