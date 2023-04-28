import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, Path } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import CheckIcon from 'src/assets/icons/check';
import CheckFillIcon from 'src/assets/icons/checkFill';
import CheckboxIcon from 'src/assets/icons/checkbox';
import CheckboxFillIcon from 'src/assets/icons/checkboxFill';
import CheckboxIndeterminateFillIcon from 'src/assets/icons/checkboxIndeterminateFill';
import {
  abcAddUser,
  abcLogin,
  getSession,
  resetPassword,
  updateAbcAddress,
  userRegister,
} from 'src/services/services';
import { Image } from 'src/components';
import Layout from 'src/layouts';
import { Page, Iconify } from 'src/components';
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  Stack,
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
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from 'src/config';

import secureLocalStorage from 'react-secure-storage';

// TODO : dkeys WASM Go Initialize...
import 'src/abc/sandbox/index';
import { controllers, accountRestApi, services } from 'src/abc/background/init';
import { AbcAddUserDto, AbcLoginResult, AbcSnsAddUserDto } from 'src/abc/main/abc/interface';
import { setAbcAuth } from 'src/store/slices/abcAuth';
import { setTwoFa } from 'src/store/slices/twoFa';
import { setProvider } from 'src/store/slices/webUser';
import { AbcLoginResponse } from 'src/abc/schema/account';
import { useRouter } from 'next/router';

const RootStyle = styled('div')(({ theme }) => ({
  paddingBottom: HEADER_MOBILE_HEIGHT,
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
    paddingBottom: HEADER_DESKTOP_HEIGHT,
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
  maxWidth: 400,
  width: 'calc(100% - 2rem)',
  bgcolor: 'common.white',
  color: 'common.black',
  boxShadow: 24,
  py: 4,
  px: 2.5,
  borderRadius: '24px',
};

const FormSchema = Yup.object().shape({
  eeTerms: Yup.bool().required(),
  eePrivate: Yup.bool().required(),
  eeTirdParty: Yup.bool().required(),
  eeMarketing: Yup.bool(),

  abcAge: Yup.bool().required(),
  abcTerms: Yup.bool().required(),
  abcPrivate: Yup.bool().required(),
  abcTirdParty: Yup.bool().required(),
  abcMarketing: Yup.bool(),
});

export default function Register(effect: React.EffectCallback, deps?: React.DependencyList) {
  const router = useRouter();

  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const twoFa = useSelector((state: any) => state.twoFa);
  const { abcController, accountController } = controllers;
  const { abcService } = services;

  const {
    reset,
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    mode: 'onTouched',
    resolver: yupResolver(FormSchema),
    defaultValues: {
      eeTerms: false,
      eePrivate: false,
      eeTirdParty: false,
      eeMarketing: false,

      abcAge: false,
      abcTerms: false,
      abcPrivate: false,
      abcTirdParty: false,
      abcMarketing: false,
    },
  });

  const getCheckboxStatus = (keys: Paths): string | null => {
    const booleans = keys.map((v) => watch(v));
    if (booleans.every((v) => v)) return 'checked';
    else if (booleans.some((v) => v)) return 'indeterminate';
    else return null;
  };

  const [idToken, setIdToken] = useState('');
  const [service, setService] = useState('');
  const [email, setEmail] = useState('');
  const [picture, setPicture] = useState('');
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
    // optToken : 입력 받은 OTP 값을 입력 받은 후 아래 코드 실행
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
        alert('가입이 완료되었습니다.');
        location.replace('/');
      }
    }
  };

  const terms = [
    {
      title: 'Eternal Editions의 모든 약관에 동의합니다.',
      children: [
        {
          key: 'eeTerms',
          require: true,
          name: '이용약관',
          href: '#',
          append: '을 모두 확인하였으며, 이에 동의합니다.',
        },
        {
          key: 'eePrivate',
          require: true,
          name: '개인정보처리방침',
          href: '#',
          append: '을 모두 확인하였으며, 이에 동의합니다.',
        },
        {
          key: 'eeTirdParty',
          require: true,
          name: '개인정보 제3자 제공 동의',
          href: '#',
          append: '를 모두 확인하였으며, 이에 동의합니다.',
        },
        {
          key: 'eeMarketing',
          require: false,
          name: '마케팅 활용 및 광고성 정보 수신',
          href: '#',
          append: '에 동의합니다.',
        },
      ],
    },
    {
      title: 'ABC WALLET의 모든 약관에 동의합니다.',
      children: [
        {
          key: 'abcAge',
          require: true,
          append: '14세 이상 사용자입니다.',
        },
        {
          key: 'abcTerms',
          require: true,
          name: '이용약관',
          href: 'https://api.id.myabcwallet.com/query/terms?language=1&service=16',
          append: '을 모두 확인하였으며, 이에 동의합니다.',
        },
        {
          key: 'abcPrivate',
          require: true,
          name: '개인정보 수집 및 이용',
          href: 'https://api.id.myabcwallet.com/query/privacy?language=1&service=16',
          append: '을 모두 확인하였으며, 이에 동의합니다.',
        },
        {
          key: 'abcTirdParty',
          require: true,
          name: '개인정보 제3자 제공 동의',
          href: 'https://api.id.myabcwallet.com/query/third-party?language=1&service=16',
          append: '를 모두 확인하였으며, 이에 동의합니다.',
        },
        {
          key: 'abcMarketing',
          require: false,
          name: '마케팅 활용 및 광고성 정보 수신',
          href: 'https://api.id.myabcwallet.com/query/marketing?language=1&service=16',
          append: '에 동의합니다.',
        },
      ],
    },
  ];
  const handleClickRegister = async () => {
    // ABC Wallet 로그인
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
      // 신규 가입자 생성
      const sixCode = JSON.parse(result.data.msg).sixcode;
      console.log('!! sixcode =', sixCode);
      const dto: AbcSnsAddUserDto = {
        username: email,
        code: sixCode,
        joinpath: 'https://colligence.io',
        overage: Number(getValues('abcAge')),
        agree: Number(getValues('abcTerms')),
        collect: Number(getValues('abcPrivate')),
        thirdparty: Number(getValues('abcTirdParty')),
        advertise: Number(getValues('abcMarketing')),
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
      setQrOnly(true);
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
        overage: Number(getValues('abcAge')),
        agree: Number(getValues('abcTerms')),
        collect: Number(getValues('abcPrivate')),
        thirdparty: Number(getValues('abcTirdParty')),
        advertise: Number(getValues('abcMarketing')),
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
        if (flCreate) console.log('신규 가입 진행.');
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
          console.log('이미 가입되어 있습니다. 로그인 처리합니다.');
          location.replace('/');
        }
      } else {
        // New SNS User
        console.log('!! ABC Address =', user.accounts[0].ethAddress);

        // ABC 기가입자로 DB에 사용자 정보가 없어서 신규로 생성
        try {
          const res = await userRegister({ abc_address: user.accounts[0].ethAddress });
          console.log(':::: 여기', res);

          if (user.twoFactorEnabled) {
            // 성공. 리다이렉트..
            console.log('이미 가입되어 있습니다. 로그인 처리합니다.');
            location.replace('/');
          } else {
            throw new Error('user.twoFactorEnabled is false');
          }
        } catch (error) {
          setMemberCheck(false);
          // TODO : OTP 미등록 상태 처리
          const { qrcode, secret } = await accountController.generateTwoFactor({
            reset: false,
          });
          console.log('!! OTP =', qrcode, secret);
          setQrCode(qrcode);
          setQrSecret(secret);
          setQrOnly(true);
        }
      }
    } else if (!loginFail) {
      setMemberCheck(false);
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const res = await getSession();
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
        setPicture(data.picture);
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

  const onSubmit = async (data: FormValuesProps) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    alert(JSON.stringify(data, null, 2));
    reset();
  };

  return (
    <Page title="Register">
      <RootStyle>
        <Container sx={{ display: 'flex', py: 5, justifyContent: 'center' }}>
          <Box
            sx={{
              minHeight: '300px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: memberCheck ? 'center' : null,
              backgroundColor: '#fff',
              color: '#000',
              borderRadius: '40px',
              maxWidth: 550,
              p: 3,
              width: '100%',
            }}
          >
            {memberCheck ? (
              <>
                <CircularProgress />
                <Typography>ABC Wallet 가입여부 확인 중...</Typography>
              </>
            ) : (
              <>
                {!qrOnly && (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h4">LOG IN / SIGN UP</Typography>
                    </Box>

                    <Stack
                      direction="row"
                      sx={{ ml: -3 }}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Stack sx={{ width: 32, mr: 0.5 }}>
                        <Image src={picture} sx={{ borderRadius: 50 }} ratio="1/1" />
                      </Stack>
                      <Typography variant="h6" sx={{ mb: 0.5 }}>
                        {email}
                      </Typography>
                    </Stack>

                    {terms.map(({ title, children }, index) => (
                      <Box key={index} sx={{ mt: 2, pt: 2, borderTop: '1px solid common.divider' }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              disabled={qrCode !== ''}
                              checked={
                                getCheckboxStatus(children.map(({ key }) => key)) === 'checked'
                              }
                              indeterminate={
                                getCheckboxStatus(children.map(({ key }) => key)) ===
                                'indeterminate'
                              }
                              icon={<CheckboxIcon />}
                              checkedIcon={<CheckboxFillIcon />}
                              indeterminateIcon={<CheckboxIndeterminateFillIcon />}
                            />
                          }
                          onChange={(event) => {
                            const value = event?.nativeEvent?.target?.checked;
                            children.forEach(({ key }) => {
                              setValue(key, value);
                            });
                          }}
                          label={title}
                        />
                        {/* children */}
                        {children?.length && (
                          <Box sx={{ paddingLeft: '15px' }}>
                            {children.map(
                              ({
                                require,
                                name,
                                href,
                                append,
                                key,
                              }: {
                                key: Path;
                                require?: boolean;
                                name?: string;
                                href?: string;
                                append?: string;
                              }) => (
                                <Controller
                                  key={key}
                                  name={key}
                                  control={control}
                                  render={({ field, fieldState: { error } }) => (
                                    <FormControlLabel
                                      key={key}
                                      control={
                                        <Checkbox
                                          {...field}
                                          checked={field.value}
                                          disabled={qrCode !== ''}
                                          icon={<CheckIcon />}
                                          checkedIcon={<CheckFillIcon />}
                                        />
                                      }
                                      label={
                                        <p>
                                          [{require ? '필수' : '선택'}]{' '}
                                          <a
                                            href={href}
                                            target="_blank"
                                            style={{ color: '#000' }}
                                            rel="noreferrer"
                                          >
                                            {name}
                                          </a>
                                          {append}
                                        </p>
                                      }
                                    />
                                  )}
                                />
                              )
                            )}
                          </Box>
                        )}
                      </Box>
                    ))}

                    {oldUser && (
                      <Box sx={{ marginY: '20px' }}>
                        {/*<Typography>Email Check Code</Typography>*/}
                        <TextField
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
                          // todo disabled 조건
                          getCheckboxStatus(
                            terms.flatMap((term) =>
                              term.children.filter(({ require }) => require).map(({ key }) => key)
                            )
                          ) !== 'checked' || qrCode !== ''
                        }
                        variant="vivid"
                      >
                        다음
                      </Button>
                    </Box>
                  </form>
                )}
                {qrCode && (
                  <Box
                    sx={{
                      p: 1,
                      my: 2,
                    }}
                  >
                    <Typography variant="h4" sx={{ mb: 2 }}>
                      Creating a Wallet
                    </Typography>
                    <Typography>
                      After scanning the QR code below in Google Authenticator, Please enter 6
                      digits of the authentication number
                    </Typography>
                    <Box sx={{ textAlign: 'center', my: 3 }}>
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
                    </Box>
                    <Button
                      sx={{ mt: 3 }}
                      size="large"
                      fullWidth
                      variant="vivid"
                      onClick={handleAbcConfirmClick}
                    >
                      COMPLETE
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Box>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={resetPass}
            // onClose={handleResetPassClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
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
                    New Password
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
