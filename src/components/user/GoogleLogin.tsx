import * as Yup from 'yup';
import React, { useState } from 'react';
import { Stack, Button, Typography, TextField, inputBaseClasses } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { Label, Section } from '../my-tickets/StyledComponents';
import { yupResolver } from '@hookform/resolvers/yup';
import { styled } from '@mui/material/styles';
import palette from 'src/theme/palette';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import NativeSelect from '@mui/material/NativeSelect';
import RoundedButton from '../common/RoundedButton';

type FormValuesProps = {
  email: string;
  birthDate: Date;
  phoneNumber: string;
  gender: string;
};

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const FormSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('That is not an email'),
  birthDate: Yup.date().required('Birth date is required'),
  phoneNumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
});

const GoogleLogin = () => {
  //   const [isContinue, setIsContinue] = useState<boolean>(false);
  const [reqDate, setreqDate] = useState(new Date());
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormValuesProps>({
    mode: 'onTouched',
    resolver: yupResolver(FormSchema),
    defaultValues: {
      email: '',
      birthDate: new Date('12/25/2020'),
      phoneNumber: '',
      gender: 'female',
    },
  });

  const onSubmit = ({ email, birthDate, phoneNumber, gender }: FormValuesProps) => {
    console.log('submit', email, birthDate, phoneNumber, gender);
  };

  return (
    <Stack gap={3} component="form" onSubmit={handleSubmit(onSubmit)}>
      <Typography
        sx={{
          fontSize: { xs: '16px', md: '24px' },
          fontWeight: 'bold',
          lineHeight: { xs: '24px', md: '28px' },
        }}
      >
        Google Account
      </Typography>
      <Stack gap={1.5}>
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
      </Stack>
      <Stack gap={1.5}>
        <Section>
          <Label as="label" sx={{ color: palette.dark.black.lighter }}>
            BIRTHDATE
          </Label>

          <Controller
            name="birthDate"
            control={control}
            render={({ field: { onChange, ...restField } }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  onChange={(event: any) => {
                    onChange(event);
                    setreqDate(event);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                  {...restField}
                />
              </LocalizationProvider>
            )}
          />
        </Section>
      </Stack>
      <Stack gap={1.5}>
        <Section>
          <Label as="label" sx={{ color: palette.dark.black.lighter }}>
            PHONE NUMBER
          </Label>

          <Controller
            name="phoneNumber"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <StyledTextField
                {...field}
                variant="standard"
                size={'small'}
                type="string"
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
      </Stack>
      <Stack gap={1.5}>
        <Section>
          <Label as="label" sx={{ color: palette.dark.black.lighter }}>
            GENDER
          </Label>

          <Controller
            name="gender"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <NativeSelect
                defaultValue="male"
                sx={{ color: palette.dark.common.black }}
                {...field}
              >
                <option
                  value="male"
                  style={{ color: palette.dark.common.black, backgroundColor: 'white' }}
                >
                  Male
                </option>
                <option
                  value="female"
                  style={{ color: palette.dark.common.black, backgroundColor: 'white' }}
                >
                  Female
                </option>
              </NativeSelect>
            )}
          />
        </Section>
      </Stack>
      <RoundedButton type="submit" disabled={!isValid}>
        Continue
      </RoundedButton>
    </Stack>
  );
};

export default GoogleLogin;

const StyledTextField = styled(TextField)(({ theme }) => ({
  [`.${inputBaseClasses.input}::placeholder`]: {
    color: '#BBBBBB',
  },
}));
