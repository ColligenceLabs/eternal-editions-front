import { styled } from '@mui/material/styles';
import { Stack, TextField, Typography, inputBaseClasses } from '@mui/material';
import { SUCCESS } from '../../config';
import { useWeb3React } from '@web3-react/core';
import { eternalLogin } from '../../services/services';
import { Base64 } from 'js-base64';
import Router from 'next/router';
import { Label, Section } from '../my-tickets/StyledComponents';
import palette from 'src/theme/palette';
import RoundedButton from '../common/RoundedButton';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

// ----------------------------------------------------------------------

const FormSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('That is not an email'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password should be of minimum 6 characters length'),
});

type FormValuesProps = {
  email: string;
  password: string;
};

interface Props {
  onClose: () => void;
}

export default function EmailSignUpForm({ onClose }: Props) {
  const context = useWeb3React();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormValuesProps>({
    mode: 'onTouched',
    resolver: yupResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async ({ email, password }: FormValuesProps) => {
    const res = await eternalLogin({ email, password });

    if (res.data.status === SUCCESS) {
      console.log('로그인 성공');
      window.localStorage.setItem('loginBy', 'password');
      Router.push({
        pathname: '/register',
        query: { eternal: Base64.encode(password) },
      });
    } else {
      alert('로그인에 실패했습니다.');
    }
    onClose();
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} gap={3} width="min(400px, 100%)">
      <Header>Login with E-mail</Header>

      <Section>
        <Label as="label" sx={{ color: palette.dark.black.lighter }}>
          E-mail
        </Label>

        <Controller
          name="email"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <StyledTextField
              {...field}
              variant="standard"
              placeholder="이메일을 입력해 주세요."
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
          Password
        </Label>

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <StyledTextField
              {...field}
              type="password"
              variant="standard"
              fullWidth
              size={'small'}
              inputProps={{
                style: {
                  color: palette.dark.common.black,
                  fontSize: 14,
                  lineHeight: 20 / 14,
                },
              }}
              sx={{
                [`.${inputBaseClasses.input}::placeholder`]: {
                  color: '#BBBBBB',
                },
              }}
              placeholder="비밀번호를 입력해 주세요."
              autoComplete="off"
              error={Boolean(error)}
              helperText={error?.message}
            />
          )}
        />
      </Section>

      <RoundedButton disabled={!isValid}>Login</RoundedButton>
    </Stack>
  );
}

// ----------------------------------------------------------------------

const Header = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: 24 / 16,
  color: theme.palette.common.black,

  [theme.breakpoints.up('md')]: {
    fontSize: '24px',
    lineHeight: 28 / 24,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  [`.${inputBaseClasses.input}::placeholder`]: {
    color: '#BBBBBB',
  },
}));
