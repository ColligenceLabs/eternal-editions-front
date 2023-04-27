import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as React from 'react';
import { useState } from 'react';
// icons
// @mui
import { LoadingButton } from '@mui/lab';
import { Link, Stack, TextField, Typography } from '@mui/material';
// components
import EECard from 'src/components/EECard';
import { useTheme } from '@mui/material/styles';
import palette from '../../theme/palette';

// ----------------------------------------------------------------------

const FormSchema = Yup.object().shape({
  // fullName: Yup.string()
  //     .required('Full name is required')
  //     .min(6, 'Mininum 6 characters')
  //     .max(15, 'Maximum 15 characters'),
  email: Yup.string().required('Email is required').email('That is not an email'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password should be of minimum 6 characters length'),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password')], "Password's not match"),
});

type FormValuesProps = {
  // fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function AccountForm() {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const [showPassword, setShowPassword] = useState(false);

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValuesProps>({
    mode: 'onTouched',
    resolver: yupResolver(FormSchema),
    defaultValues: {
      // fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: FormValuesProps) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    alert(JSON.stringify(data, null, 2));
    reset();
  };

  return (
    <EECard bgColor="common.white" color="common.black">
      <Stack spacing={1}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2.5}>
            {/*<Controller*/}
            {/*    name="fullName"*/}
            {/*    control={control}*/}
            {/*    render={({field, fieldState: {error}}) => (*/}
            {/*        <TextField*/}
            {/*            {...field}*/}
            {/*            label="Full Name"*/}
            {/*            error={Boolean(error)}*/}
            {/*            helperText={error?.message}*/}
            {/*        />*/}
            {/*    )}*/}
            {/*/>*/}

            <Controller
              name="email"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email address"
                  error={Boolean(error)}
                  helperText={error?.message}
                />
              )}
            />

            {/*<Controller*/}
            {/*    name="password"*/}
            {/*    control={control}*/}
            {/*    render={({field, fieldState: {error}}) => (*/}
            {/*        <TextField*/}
            {/*            {...field}*/}
            {/*            fullWidth*/}
            {/*            label="Password"*/}
            {/*            type={showPassword ? 'text' : 'password'}*/}
            {/*            InputProps={{*/}
            {/*                endAdornment: (*/}
            {/*                    <InputAdornment position="end">*/}
            {/*                        <IconButton onClick={handleShowPassword} edge="end">*/}
            {/*                            <Iconify icon={showPassword ? viewIcon : viewOff}/>*/}
            {/*                        </IconButton>*/}
            {/*                    </InputAdornment>*/}
            {/*                ),*/}
            {/*            }}*/}
            {/*            error={Boolean(error)}*/}
            {/*            helperText={error?.message}*/}
            {/*        />*/}
            {/*    )}*/}
            {/*/>*/}

            {/*<Controller*/}
            {/*    name="confirmPassword"*/}
            {/*    control={control}*/}
            {/*    render={({field, fieldState: {error}}) => (*/}
            {/*        <TextField*/}
            {/*            {...field}*/}
            {/*            label="Confirm Password"*/}
            {/*            type={showPassword ? 'text' : 'password'}*/}
            {/*            InputProps={{*/}
            {/*                endAdornment: (*/}
            {/*                    <InputAdornment position="end">*/}
            {/*                        <IconButton onClick={handleShowPassword} edge="end">*/}
            {/*                            <Iconify icon={showPassword ? viewIcon : viewOff}/>*/}
            {/*                        </IconButton>*/}
            {/*                    </InputAdornment>*/}
            {/*                ),*/}
            {/*            }}*/}
            {/*            error={Boolean(error)}*/}
            {/*            helperText={error?.message}*/}
            {/*        />*/}
            {/*    )}*/}
            {/*/>*/}

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Update
            </LoadingButton>

            <Typography variant="caption" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
              I agree to
              <Link
                color={isLight ? palette.dark.text.primary : palette.light.text.primary}
                href="#"
              >
                {''} Terms of Service {''}
              </Link>
              and
              <Link
                color={isLight ? palette.dark.text.primary : palette.light.text.primary}
                href="#"
              >
                {''} Privacy Policy.
              </Link>
            </Typography>
          </Stack>
        </form>
      </Stack>
    </EECard>
  );
}
