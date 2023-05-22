import * as Yup from 'yup';
import React, { useEffect, useMemo, useState } from 'react';
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
import { makeStyles } from '@material-ui/core/styles';
import { abcJoin, abcLogin, getSession, userRegister } from 'src/services/services';
import { setProvider } from 'src/store/slices/webUser';
import { accountRestApi, controllers, services } from 'src/abc/background/init';
import { AbcLoginResult, AbcSnsAddUserDto } from 'src/abc/main/abc/interface';
import { AbcLoginResponse } from 'src/abc/schema/account';
import secureLocalStorage from 'react-secure-storage';
import { useDispatch } from 'react-redux';
import { setAbcAuth } from 'src/store/slices/abcAuth';
import { RoundedSelectOption, MenuProps } from '../common/Select';
import countryList from 'react-select-country-list';

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
  agree: boolean;
  verificationCode: string;
};

interface Props {
  setForm: React.Dispatch<React.SetStateAction<string>>;
  accountData: Partial<GoogleAccountData>;
}

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const verifyCodeLength = 6;

const FormSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('That is not an email'),
  birthDate: Yup.date().required('Birth date is required').typeError('Invalid date format'),
  name: Yup.string().required('Full name is required'),
  phoneNumber: Yup.string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .required('Phone number is required'),
  verificationCode: Yup.string()
    .required('Verification Code  is required')
    .length(verifyCodeLength, 'Verification Code must be exactly 6 characters'),
});

console.log(FormSchema);

export const termsEternal = [
  { title: '이용약관을 모두 확인하였으며, 이에 동의합니다.', isRequired: true },
  { title: '개인정보처리방침을 모두 확인하였으며, 이에 동의합니다.', isRequired: true },
  { title: '개인정보 제3자 제공 동의를 모두 확인하였으며, 이에 동의합니다.', isRequired: true },
  { title: '마케팅 활용 및 광고성 정보 수신에 동의합니다.', isRequired: false },
];

export const termsABC = [
  { title: '14세 이상입니다.', isRequired: true },
  { title: '이용약관을 모두 확인하였으며, 이에 동의합니다.', isRequired: true },
  { title: '개인정보 수집 및 이용을 모두 확인하였으며, 이에 동의합니다.', isRequired: true },
  { title: '개인정보 제3자 제공 동의를 모두 확인하였으며, 이에 동의합니다.', isRequired: true },
  { title: '마케팅 활용 및 광고성 정보 수신에 동의합니다.', isRequired: false },
];

const countries = ['Korea', 'China', 'United States', 'Russian'];

const GoogleFullSignUp = ({ setForm, accountData }: Props) => {
  const dispatch = useDispatch();
  const { abcController, accountController } = controllers;

  const [idToken, setIdToken] = useState('');
  const [service, setService] = useState('');

  const [showVerifyCode, setShowVerifyCode] = useState<boolean>(false);
  const { control, getValues, handleSubmit, watch, reset } = useForm<GoogleAccountData>({
    resolver: yupResolver(FormSchema),
    defaultValues: {
      ...accountData,
      agreeEternal: false,
      agreeABC: false,
      country: 'Korea',
    },
  });

  const countryOptions = useMemo(() => countryList().getData(), []);

  useEffect(() => {
    const fetchSession = async () => {
      const res = await getSession();

      if (res.data?.providerAuthInfo) {
        console.log('!! Session Info =', res.data?.providerAuthInfo);
        const info = JSON.parse(res.data?.providerAuthInfo.provider_data);
        console.log('!! Session provider_data = ', info);
        setIdToken(res.data?.providerAuthInfo.provider_token);
        setService(res.data?.providerAuthInfo.provider);
        reset({ email: info.email, name: info.name });
      }
    };
    fetchSession();
  }, []);

  const onSubmit = async (values: GoogleAccountData) => {
    console.log('submit', values);
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
        await secureLocalStorage.setItem('abcAuth', JSON.stringify(abcAuth));

        // 지갑 복구
        const { user, wallets } = await accountRestApi.getWalletsAndUserByAbcUid(abcAuth);
        console.log('!! user =', user);

        await accountController.recoverShare(
          { password: '!owdin001', user, wallets, keepDB: false },
          dispatch
        );

        abcWallet = user.accounts[0].ethAddress;
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
        overage: 1,
        agree: 1,
        collect: 1,
        thirdparty: 1,
        advertise: 1,
      };

      // try {
      //   const newAccount = await abcJoin(dto);
      //   console.log('!! created account =', newAccount);
      // } catch (e) {
      //   console.log('!! snsAddUser Error =', e);
      // }
      //
      // // 신규 가입 후 ABC 로그인
      // console.log('!! start to abc sns login !!');
      // abcAuth = await abcController.snsLogin(idToken, service);
      // console.log('!! abc sns login result =', abcAuth);
      //
      // // 토큰 저장
      // await dispatch(setAbcAuth(abcAuth));
      // await secureLocalStorage.setItem('abcAuth', JSON.stringify(abcAuth));
      //
      // // MPC 지갑 생성
      // await accountController.createMpcBaseAccount(
      //   {
      //     accountName: values.email,
      //     password: '!owdin001',
      //     email: values.email,
      //   },
      //   dispatch
      // );
      //
      // // 생성된 MPC 지갑 정보 조회
      // const { user, wallets } = await accountRestApi.getWalletsAndUserByAbcUid(abcAuth);
      // console.log('!! user =', user);
      //
      // await accountController.recoverShare(
      //   { password: '!owdin001', user, wallets, keepDB: false },
      //   dispatch
      // );
      //
      // abcWallet = user.accounts[0].ethAddress;
      console.log('!! Register a new ABC wallet user ... done !!');
    }

    // ABC 기 기압자 경우, 지갑 주소 저장
    // await userRegister({ abc_address: abcWallet });
  };

  console.log('onSubmit', getValues('agree'));

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
              type="email"
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
                error={Boolean(error)}
                endAdornment={
                  <InputAdornment position="end">
                    <RoundedButton
                      variant="inactive"
                      disabled={!watch('phoneNumber')}
                      onClick={() => setShowVerifyCode(true)}
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
                      {'SEND CODE'}
                    </RoundedButton>
                  </InputAdornment>
                }
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
              <StyledInput
                {...field}
                placeholder="Please enter verification code"
                size={'small'}
                inputProps={{
                  style: { color: palette.dark.common.black, fontSize: 14, lineHeight: 20 / 14 },
                }}
                fullWidth
                error={Boolean(error)}
                endAdornment={
                  <InputAdornment position="end">
                    <RoundedButton
                      variant="inactive"
                      disabled={getValues('verificationCode')?.length < verifyCodeLength}
                      onClick={() => {
                        console.log(getValues('verificationCode'));
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
                }
              />
            )}
          />
        </Section>
      )}

      <Typography variant={'caption'} sx={{ lineHeight: 16 / 12 }}>
        Lost your code?{' '}
        <Typography variant={'caption'} color={'#00BA03'} sx={{ cursor: 'pointer' }}>
          Resend Code
        </Typography>
      </Typography>
      <Stack gap={0}>
        <Controller
          name="agreeEternal"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => field.onChange(e.target.checked)}
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

        {termsEternal.map(({ title, isRequired }, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={watch('agreeEternal')}
                // checked={true}
                sx={{ padding: 0, px: '8px' }}
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
                  onChange={(e) => field.onChange(e.target.checked)}
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

        {termsABC.map(({ title, isRequired }, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={watch('agreeABC')}
                // checked={true}
                sx={{ padding: 0, px: '8px' }}
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
        ))}
      </Stack>

      <RoundedButton
        type="submit"
        disabled={!watch('agreeEternal') || !watch('agreeABC') || !watch('verificationCode')}
      >
        Continue
      </RoundedButton>
    </Stack>
  );
};

export default GoogleFullSignUp;
