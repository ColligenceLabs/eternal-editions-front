import * as Yup from 'yup';
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import {
  Stack,
  Typography,
  inputBaseClasses,
  Select,
  FormControlLabel,
  Checkbox,
  buttonBaseClasses,
  InputAdornment,
  TextField,
  CircularProgress,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { Label, Section } from '../my-tickets/StyledComponents';
import { yupResolver } from '@hookform/resolvers/yup';
import { styled } from '@mui/material/styles';
import palette from 'src/theme/palette';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import RoundedButton from '../common/RoundedButton';
import CheckboxFillIcon from 'src/assets/icons/checkboxFill';
import CheckboxIcon from 'src/assets/icons/checkbox';
import CheckboxIndeterminateFillIcon from 'src/assets/icons/checkboxIndeterminateFill';
import CheckIcon from 'src/assets/icons/check';
import CheckFillIcon from 'src/assets/icons/checkFill';
import { Input } from '@mui/material';
import {
  abcJoin,
  abcLogin,
  getCertifications,
  getSession,
  getUser,
  removeUser,
  userRegister,
} from 'src/services/services';
import { accountRestApi, controllers } from 'src/abc/background/init';
import { AbcLoginResult, AbcSnsAddUserDto } from 'src/abc/main/abc/interface';
import { AbcLoginResponse } from 'src/abc/schema/account';
import secureLocalStorage from 'react-secure-storage';
import { useDispatch } from 'react-redux';
import { setAbcAuth } from 'src/store/slices/abcAuth';
import { RoundedSelectOption, MenuProps } from '../common/Select';
import countryList from 'react-select-country-list';
import { SUCCESS } from 'src/config';
import { useRouter } from 'next/router';
import CSnackbar from 'src/components/common/CSnackbar';
import env from 'src/env';
import { delUser } from 'src/store/slices/user';
import { initWebUser, setWebUser } from 'src/store/slices/webUser';

const StyledInput = styled(Input)(({}) => ({
  [`.${inputBaseClasses.input}::placeholder`]: {
    color: '#BBBBBB',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  [`.${inputBaseClasses.input}::placeholder`]: {
    color: '#BBBBBB',
  },
  '& input': {
    color: theme.palette.common.black,
  },
}));

type GoogleAccountData = {
  email: string;
  birthDate: Date;
  phoneNumber: string;
  gender: string;
  name: string;
  country: string;
  verificationCode: string;
  agreeEternal: boolean;
  agreeABC: boolean;
  eeTerms: boolean;
  eePrivate: boolean;
  eeThirdParty: boolean;
  eeMarketing: boolean;
  abcTerms: boolean;
  abcAge: boolean;
  abcPrivate: boolean;
  abcThirdParty: boolean;
  abcMarketing: boolean;
};

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const verifyCodeLength = 6;

const FormSchema = Yup.object().shape({
  email: Yup.string().email('That is not an email').required('Email is required'),
  birthDate: Yup.date().required('Birth date is required').typeError('Invalid date format'),
  name: Yup.string().required('Full name is required'),
  phoneNumber: Yup.string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .required('Phone number is required'),
  // verificationCode: Yup.string()
  //   .required('Verification Code  is required')
  //   .length(verifyCodeLength, 'Verification Code must be exactly 6 characters'),
});

type Term = {
  key: keyof GoogleAccountData;
  title: string;
  isRequired: boolean;
};

export const termsEternal: Term[] = [
  { title: '이용약관을 모두 확인하였으며, 이에 동의합니다.', isRequired: true, key: 'eeTerms' },
  {
    title: '개인정보처리방침을 모두 확인하였으며, 이에 동의합니다.',
    isRequired: true,
    key: 'eePrivate',
  },
  {
    title: '개인정보 제3자 제공 동의를 모두 확인하였으며, 이에 동의합니다.',
    isRequired: true,
    key: 'eeThirdParty',
  },
  { title: '마케팅 활용 및 광고성 정보 수신에 동의합니다.', isRequired: false, key: 'eeMarketing' },
];

export const termsABC: Term[] = [
  { key: 'abcAge', title: '14세 이상입니다.', isRequired: true },
  { key: 'abcTerms', title: '이용약관을 모두 확인하였으며, 이에 동의합니다.', isRequired: true },
  {
    key: 'abcPrivate',
    title: '개인정보 수집 및 이용을 모두 확인하였으며, 이에 동의합니다.',
    isRequired: true,
  },
  {
    key: 'abcThirdParty',
    title: '개인정보 제3자 제공 동의를 모두 확인하였으며, 이에 동의합니다.',
    isRequired: true,
  },
  {
    key: 'abcMarketing',
    title: '마케팅 활용 및 광고성 정보 수신에 동의합니다.',
    isRequired: false,
  },
];
const defaultValues = {
  birthDate: new Date('1/1/2000'),
  gender: 'male',
  country: 'KR',
  agreeEternal: false,
  agreeABC: false,
  eeTerms: false,
  eePrivate: false,
  eeThirdParty: false,
  eeMarketing: false,
  abcAge: false,
  abcTerms: false,
  abcPrivate: false,
  abcThirdParty: false,
  abcMarketing: false,
};
const GoogleFullSignUp = () => {
  const router = useRouter();
  const [accountData, setAccountData] = useState<Partial<GoogleAccountData>>({});
  const dispatch = useDispatch();
  const { abcController, accountController } = controllers;
  const [idToken, setIdToken] = useState('');
  const [service, setService] = useState('');
  const [wasClickedVerify, setWasClickedVerify] = useState<boolean>(false);
  const [showVerifyCode, setShowVerifyCode] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    type: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    getValues,
    handleSubmit,
    watch,
    reset,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<GoogleAccountData>({
    resolver: yupResolver(FormSchema),
    defaultValues: {
      ...defaultValues,
      ...accountData,
    },
  });

  const countryOptions = useMemo(() => countryList().getData(), []);

  const handleCloseSnackbar = () => {
    setOpenSnackbar({
      open: false,
      type: '',
      message: '',
    });
  };

  useEffect(() => {
    const fetchSession = async () => {
      const res = await getSession();

      if (res.data?.providerAuthInfo) {
        console.log('!! Session Info =', res.data?.providerAuthInfo);
        const info = JSON.parse(res.data?.providerAuthInfo.provider_data);
        console.log('!! Session provider_data = ', info);
        setIdToken(res.data?.providerAuthInfo.provider_token);
        setService(res.data?.providerAuthInfo.provider);
        reset({ ...defaultValues, email: info.email, name: info.name });
      }

      await fetchCertifications(imp_uid);
    };
    const fetchCertifications = async (impUid: any) => {
      const res = await getCertifications(impUid);

      if (res.data?.status === 1) {
        // todo 본인인증 정보를 입력란에 채워준다.
        // res.data values
        // data: {
        //         "birth": 246639600,
        //         "birthday": "1977-10-26",
        //         "certified": true,
        //         "certified_at": 1686296885,
        //         "foreigner": false,
        //         "foreigner_v2": null,
        //         "gender": null,
        //         "imp_uid": "imp_089849965949",
        //         "merchant_uid": "mid_1686296848907",
        //         "name": "김성진",
        //         "origin": "http://localhost:8888/identity/",
        //         "pg_provider": "inicis_unified",
        //         "pg_tid": "INISA_MIIiasTest202306091647300301631523",
        //         "phone": "01099900199",
        //         "unique_in_site": null,
        //         "unique_key": ""
        //     }
        console.log('!! 본인 인증 데이터 : ', res.data);
        // reset({
        //   birthDate: new Date(res.data.data.birthday),
        //   name: res.data.data.name,
        //   phoneNumber: res.data.data.phone,
        // });
        setValue('name', res.data.data.name);
        setValue('phoneNumber', res.data.data.phone);
        setValue('birthDate', new Date(res.data.data.birthday));
      } else {
        // todo 본인인증 정보 에러 처리.
        alert(res.data.message.message);
      }
    };
    const imp_uid = router.query['imp_uid'];
    const success = router.query['success'];
    if (success !== 'true' || !imp_uid) {
      // todo 본인 인증정보 없거나 실패인 경우 어떻게 처리할 지...메인화면으로 이동??
      if (success === 'false') alert('본인인증정보 없음.');
      router.push('/');
      return;
    } else {
      // 본인인증정보 조회함수 호출
      fetchSession();
    }
  }, []);

  const onSubmit = async (values: GoogleAccountData) => {
    console.log('submit', values);
    setIsLoading(true);
    // setForm(WALLET_FORM);

    // DB users 에 입략받은 추가 정보 저장

    // ABC 지갑 가입 여부 확인
    const isExist = await abcController.getUser({
      email: values.email,
      successIfUserExist: true,
    });
    console.log('!! addUser =', isExist);

    let abcWallet = '';
    let abcAuth: AbcLoginResult = {
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: 0,
    };

    if (isExist) {
      // 기존 ABC Wallet 사용자

      // ABC 로그인
      const result = await abcLogin({
        token: idToken,
        service,
        audience: 'https://mw.myabcwallet.com',
      });
      console.log('!! abcLogin result =', result);

      if (result.data.data !== null) {
        const resData = AbcLoginResponse.parse(result.data);
        abcAuth = {
          accessToken: resData.access_token,
          refreshToken: resData.refresh_token,
          tokenType: resData.token_type,
          expiresIn: resData.expire_in,
        };

        // 토큰 저장
        await dispatch(setAbcAuth(abcAuth));
        secureLocalStorage.setItem('abcAuth', JSON.stringify(abcAuth));

        // 지갑 복구
        const { user, wallets } = await accountRestApi.getWalletsAndUserByAbcUid(abcAuth);
        console.log('!! user =', user);

        await accountController.recoverShare(
          { password: '!owdin001', user, wallets, keepDB: false },
          dispatch
        );

        abcWallet = user.accounts[0].ethAddress;

        // ABC 기 기압자 또는 탈퇴 후 재 가입자 정보 업데이트
        await userRegister({
          abc_address: abcWallet,
          country: values.country,
          birthday: values.birthDate,
          gender: values.gender,
          phone: values.phoneNumber,
        });

        const userRes = await getUser();
        console.log('!! Register an old ABC wallet user ... done : ', userRes);
        if (userRes.status === 200 && userRes.data.status != 0)
          dispatch(setWebUser(userRes.data.user));
        else {
          dispatch(initWebUser());
          dispatch(delUser());
        }
      } else {
        console.log('!! ABC Wallet SNS login ... failed !!');
      }
    } else {
      // 신규 가입자 생성

      // ABC 로그인
      const result = await abcLogin({
        token: idToken,
        service,
        audience: 'https://mw.myabcwallet.com',
      });
      console.log('!! 신규 가입자 abcLogin = ', result);

      const sixCode = JSON.parse(result.data.msg).sixcode;
      console.log('!! sixcode =', sixCode, values.email);
      // console.log(
      //   '!! Agreement =',
      //   Number(getValues('abcAge')),
      //   Number(getValues('abcTerms')),
      //   Number(getValues('abcPrivate')),
      //   Number(getValues('abcTirdParty')),
      //   Number(getValues('abcMarketing'))
      // );

      const dto: AbcSnsAddUserDto = {
        username: values.email,
        code: sixCode,
        joinpath: 'https://colligence.io',
        overage: values.abcAge ? 1 : 0,
        agree: values.abcTerms ? 1 : 0,
        collect: values.abcPrivate ? 1 : 0,
        thirdparty: values.abcThirdParty ? 1 : 0,
        advertise: values.abcMarketing ? 1 : 0,
      };

      try {
        const newAccount = await abcJoin(dto);
        console.log('!! created account =', newAccount);
      } catch (e) {
        console.log('!! snsAddUser Error =', e);
      }

      // 신규 가입 후 ABC 로그인
      console.log('!! start to abc sns login !!');
      abcAuth = await abcController.snsLogin(idToken, service);
      console.log('!! abc sns login result =', abcAuth);

      // 토큰 저장
      await dispatch(setAbcAuth(abcAuth));
      secureLocalStorage.setItem('abcAuth', JSON.stringify(abcAuth));

      // MPC 지갑 생성
      await accountController.createMpcBaseAccount(
        {
          accountName: values.email,
          password: '!owdin001',
          email: values.email,
        },
        dispatch
      );

      // 생성된 MPC 지갑 정보 조회
      const { user, wallets } = await accountRestApi.getWalletsAndUserByAbcUid(abcAuth);
      console.log('!! user =', user);

      await accountController.recoverShare(
        { password: '!owdin001', user, wallets, keepDB: false },
        dispatch
      );

      abcWallet = user.accounts[0].ethAddress;

      // ABC 신규 기압자 DB 등록
      const rltDB = await userRegister({
        abc_address: abcWallet,
        country: values.country,
        birthday: values.birthDate,
        gender: values.gender,
        phone: values.phoneNumber,
      });

      if (rltDB.data.status === SUCCESS) {
        setOpenSnackbar({
          open: true,
          type: 'success',
          message: 'Success Register!',
        });
      } else {
        setOpenSnackbar({
          open: true,
          type: 'error',
          message: 'Failed Register!',
        });
      }

      const userRes = await getUser();
      console.log('!! Register a new ABC wallet user ... done : ', userRes);
      if (userRes.status === 200 && userRes.data.status != 0)
        dispatch(setWebUser(userRes.data.user));
      else {
        dispatch(initWebUser());
        dispatch(delUser());
      }
    }

    setIsLoading(false);
    await router.push('/');
  };
  const onChangeAgreeEternal = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setValue('agreeEternal', checked);
    termsEternal.forEach((term) => {
      setValue(term.key, checked);
    });
  };
  const onChangeAgreeABC = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setValue('agreeABC', checked);
    termsABC.forEach((term) => {
      setValue(term.key, checked);
    });
  };
  const onChangeDetailAgree = (
    value: boolean,
    key: keyof GoogleAccountData,
    keyTerm: keyof GoogleAccountData
  ) => {
    setValue(key, value);
    const listKeyTerm = (keyTerm === 'agreeABC' ? termsABC : termsEternal).map(
      (term) => term.key
    ) as (keyof GoogleAccountData)[];
    const multipleValues = getValues(listKeyTerm);

    if (!multipleValues.includes(false)) {
      setValue(keyTerm, true);
    } else {
      setValue(keyTerm, false);
    }
  };

  return (
    <Stack gap={2} component="form" onSubmit={handleSubmit(onSubmit)}>
      <Typography
        sx={{
          fontSize: { xs: '16px', md: '24px' },
          fontWeight: 'bold',
          lineHeight: { xs: '24px', md: '28px' },
          mb: 2,
        }}
      >
        Google Account
      </Typography>
      <Section>
        <Label as="label" sx={{ color: palette.dark.black.lighter }}>
          E-MAIL
        </Label>

        <Controller
          name="email"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <StyledTextField
              {...field}
              variant="standard"
              size={'small'}
              inputProps={{
                style: { color: palette.dark.common.black, fontSize: 14, lineHeight: 20 / 14 },
              }}
              fullWidth
              error={Boolean(error)}
              helperText={error?.message}
            />
          )}
        />
      </Section>
      <Section>
        <Label as="label" sx={{ color: palette.dark.black.lighter }}>
          Country
        </Label>

        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <Select {...field} variant="standard" sx={{ color: '#000' }} MenuProps={MenuProps}>
              {countryOptions.map(({ value, label }: { value: string; label: string }) => (
                <RoundedSelectOption value={value} key={value}>
                  {label}
                </RoundedSelectOption>
              ))}
            </Select>
          )}
        />
      </Section>
      <Section>
        <Label as="label" sx={{ color: palette.dark.black.lighter }}>
          FULL NAME
        </Label>

        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <StyledTextField
              {...field}
              placeholder="Please enter your fullname"
              variant="standard"
              size={'small'}
              inputProps={{
                style: { color: palette.dark.common.black, fontSize: 14, lineHeight: 20 / 14 },
              }}
              fullWidth
              disabled={true}
              error={Boolean(error)}
              helperText={error?.message}
            />
          )}
        />
      </Section>
      <Section>
        <Label as="label" sx={{ color: palette.dark.black.lighter }}>
          BIRTHDATE
        </Label>

        <Controller
          name="birthDate"
          control={control}
          render={({ field: { ref, onBlur, name, ...restField }, fieldState: { error } }) => (
            <DatePicker
              {...restField}
              inputRef={ref}
              inputFormat="dd/MM/yyyy"
              renderInput={(inputProps) => (
                <StyledTextField
                  variant="standard"
                  {...inputProps}
                  onBlur={onBlur}
                  name={name}
                  error={Boolean(error)}
                  helperText={error?.message}
                />
              )}
            />
          )}
          // render={({ field: { ...restField }, fieldState: { error } }) => (
          //   <LocalizationProvider dateAdapter={AdapterDayjs}>
          //     <DatePicker
          //       // onChange={()}
          //       renderInput={(params) => (
          //         <StyledTextField {...params} error={Boolean(error)} helperText={error?.message} />
          //       )}
          //       {...restField}
          //     />
          //   </LocalizationProvider>
          // )}
        />
      </Section>

      <Section>
        <Label as="label" sx={{ color: palette.dark.black.lighter }}>
          GENDER
        </Label>

        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Select {...field} variant="standard" sx={{ color: '#000' }} MenuProps={MenuProps}>
              <RoundedSelectOption key="female" value="female">
                Woman
              </RoundedSelectOption>
              <RoundedSelectOption key="male" value="male">
                Man
              </RoundedSelectOption>
            </Select>
          )}
        />
      </Section>
      <Section>
        <Label as="label" sx={{ color: palette.dark.black.lighter }}>
          PHONE NUMBER
        </Label>

        <Controller
          name="phoneNumber"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <StyledInput
                {...field}
                placeholder="Please enter your phone number"
                size={'small'}
                inputProps={{
                  style: { color: palette.dark.common.black, fontSize: 14, lineHeight: 20 / 14 },
                }}
                fullWidth
                disabled={true}
                error={Boolean(error)}
                // endAdornment={
                //   <InputAdornment position="end">
                //     <RoundedButton
                //       variant="inactive"
                //       disabled={!watch('phoneNumber')}
                //       onClick={() => setShowVerifyCode(true)}
                //       sx={{
                //         padding: '10px 16px',
                //         marginBottom: '24px',
                //         color: !!watch('phoneNumber')
                //           ? palette.dark.common.black
                //           : palette.dark.black.lighter,
                //         [`&.${buttonBaseClasses.root}`]: {
                //           fontSize: 12,
                //           lineHeight: 13 / 12,
                //         },
                //       }}
                //     >
                //       {'SEND CODE'}
                //     </RoundedButton>
                //   </InputAdornment>
                // }
              />
              {error?.message && (
                <Typography variant="caption" color={'error'}>
                  {error?.message}
                </Typography>
              )}
            </>
          )}
        />
      </Section>
      {showVerifyCode && (
        <Section>
          <Label as="label" sx={{ color: palette.dark.black.lighter }}>
            Verification Code
          </Label>
          <Controller
            name="verificationCode"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <StyledTextField
                {...field}
                placeholder="Please enter verification code"
                size={'small'}
                inputProps={{
                  style: { color: palette.dark.common.black, fontSize: 14, lineHeight: 20 / 14 },
                }}
                variant="standard"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <RoundedButton
                        variant="inactive"
                        disabled={
                          !getValues('verificationCode') ||
                          getValues('verificationCode').length < verifyCodeLength
                        }
                        onClick={() => {
                          console.log(getValues('verificationCode'));
                          if (getValues('verificationCode') !== '123123') {
                            setError('verificationCode', {
                              type: 'custom',
                              message: 'This code is not correct',
                            });
                          } else {
                            setWasClickedVerify(true);
                            clearErrors('verificationCode');
                          }
                        }}
                        sx={{
                          padding: '10px 16px',
                          marginBottom: '24px',
                          color: !!watch('phoneNumber')
                            ? palette.dark.common.black
                            : palette.dark.black.lighter,
                          [`&.${buttonBaseClasses.root}`]: {
                            fontSize: 12,
                            lineHeight: 13 / 12,
                          },
                        }}
                      >
                        {'VERIFY CODE'}
                      </RoundedButton>
                    </InputAdornment>
                  ),
                }}
                fullWidth
                error={Boolean(error)}
                helperText={error?.message}
              />
            )}
          />
        </Section>
      )}

      {/*<Typography variant={'caption'} sx={{ lineHeight: 16 / 12 }}>*/}
      {/*  Lost your code?{' '}*/}
      {/*  <Typography variant={'caption'} color={'#00BA03'} sx={{ cursor: 'pointer' }}>*/}
      {/*    Resend Code*/}
      {/*  </Typography>*/}
      {/*</Typography>*/}
      <Stack gap={0}>
        <Controller
          name="agreeEternal"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  onChange={onChangeAgreeEternal}
                  checked={field.value}
                  icon={<CheckboxIcon />}
                  checkedIcon={<CheckboxFillIcon />}
                  indeterminateIcon={<CheckboxIndeterminateFillIcon />}
                />
              }
              label="Eternal Editions의 모든 약관에 동의합니다."
            />
          )}
        />

        {termsEternal.map(({ title, isRequired, key }) => (
          <Controller
            name={key}
            control={control}
            key={key}
            render={({ field }) => (
              <FormControlLabel
                sx={{ alignItems: 'start' }}
                control={
                  <Checkbox
                    {...field}
                    onChange={(e) => {
                      onChangeDetailAgree(e.target.checked, key, 'agreeEternal');
                    }}
                    checked={!!field.value}
                    sx={{ padding: '4px', px: '8px' }}
                    icon={<CheckIcon />}
                    checkedIcon={<CheckFillIcon />}
                    indeterminateIcon={<CheckboxIndeterminateFillIcon />}
                  />
                }
                label={
                  <span>
                    {isRequired && <span style={{ color: 'red' }}>* </span>}
                    {title}
                  </span>
                }
              />
            )}
          />
        ))}
      </Stack>
      <Stack gap={0}>
        <Controller
          name="agreeABC"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  // onChange={(e) => field.onChange(e.target.checked)}
                  onChange={onChangeAgreeABC}
                  checked={field.value}
                  icon={<CheckboxIcon />}
                  checkedIcon={<CheckboxFillIcon />}
                  indeterminateIcon={<CheckboxIndeterminateFillIcon />}
                />
              }
              label="ABC WALLET의 모든 약관에 동의합니다."
            />
          )}
        />

        {termsABC.map(({ title, isRequired, key }, index) => (
          <Controller
            name={key}
            control={control}
            key={key}
            render={({ field }) => (
              <FormControlLabel
                sx={{ alignItems: 'start' }}
                control={
                  <Checkbox
                    {...field}
                    onChange={(e) => {
                      onChangeDetailAgree(e.target.checked, key, 'agreeABC');
                    }}
                    checked={!!field.value}
                    sx={{ padding: '4px', px: '8px' }}
                    icon={<CheckIcon />}
                    checkedIcon={<CheckFillIcon />}
                    indeterminateIcon={<CheckboxIndeterminateFillIcon />}
                  />
                }
                label={
                  <span>
                    {isRequired && <span style={{ color: 'red' }}>* </span>}
                    {title}
                  </span>
                }
              />
            )}
          />
        ))}
      </Stack>

      <RoundedButton
        type="submit"
        disabled={
          !watch('eeTerms') ||
          !watch('eePrivate') ||
          !watch('eeThirdParty') ||
          !watch('abcAge') ||
          !watch('abcTerms') ||
          !watch('abcPrivate') ||
          !watch('abcThirdParty') ||
          Object.keys(errors).length > 0 // ||
          // !wasClickedVerify
        }
      >
        {isLoading ? <CircularProgress size={15} color="secondary" /> : 'Continue'}
      </RoundedButton>

      <CSnackbar
        open={openSnackbar.open}
        type={openSnackbar.type}
        message={openSnackbar.message}
        handleClose={handleCloseSnackbar}
      />
    </Stack>
  );
};

export default GoogleFullSignUp;
