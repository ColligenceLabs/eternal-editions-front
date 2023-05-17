import * as Yup from 'yup';
import React, { useState } from 'react';
import {
  Stack,
  Button,
  Typography,
  TextField,
  inputBaseClasses,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { Label, Section } from '../my-tickets/StyledComponents';
import { yupResolver } from '@hookform/resolvers/yup';
import { styled } from '@mui/material/styles';
import palette from 'src/theme/palette';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import RoundedButton from '../common/RoundedButton';
import CheckboxFillIcon from 'src/assets/icons/checkboxFill';
import CheckboxIcon from 'src/assets/icons/checkbox';
import CheckboxIndeterminateFillIcon from 'src/assets/icons/checkboxIndeterminateFill';
import CheckIcon from 'src/assets/icons/check';
import CheckFillIcon from 'src/assets/icons/checkFill';
import { WALLET_FORM } from './GoogleFlow';

type FormValuesProps = {
  email: string;
  birthDate: Date;
  phoneNumber: string;
  gender: string;
  name: string;
  country: string;
  agree: boolean;
};

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const FormSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('That is not an email'),
  birthDate: Yup.date().required('Birth date is required'),
  phoneNumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
});

const terms = [
  { title: 'Agree Terms and Conditions', isRequired: true },
  { title: 'Agree Privacy Policy', isRequired: true },
  { title: 'Receive SMS and E-mails for promotions', isRequired: false },
];
const GoogleFullSignUp = ({ setForm }) => {
  //   const [isContinue, setIsContinue] = useState<boolean>(false);
  const [reqDate, setreqDate] = useState(new Date());
  const {
    control,
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormValuesProps>({
    resolver: yupResolver(FormSchema),
    defaultValues: {
      email: 'the@vn.vn',
      birthDate: new Date('12/25/2020'),
      gender: 'female',
    },
  });

  const onSubmit = (values: FormValuesProps) => {
    const { email, birthDate, phoneNumber, gender } = values;
    console.log('submit', values);
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
        Google Account Full
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
            <Select {...field} sx={{ color: '#000' }}>
              <MenuItem value={'female'}>Ten</MenuItem>
              <MenuItem value={'male'}>Twenty</MenuItem>
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
          render={({ field: { onChange, ...restField } }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                renderInput={(params) => <StyledTextField {...params} />}
                {...restField}
              />
            </LocalizationProvider>
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
      <Section>
        <Label as="label" sx={{ color: palette.dark.black.lighter }}>
          GENDER
        </Label>

        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Select {...field} sx={{ color: '#000' }}>
              <MenuItem value={'female'}>Ten</MenuItem>
              <MenuItem value={'male'}>Twenty</MenuItem>
            </Select>
          )}
        />
      </Section>
      <Section>
        <Controller
          name="agree"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked
                  icon={<CheckboxIcon />}
                  checkedIcon={<CheckboxFillIcon />}
                  indeterminateIcon={<CheckboxIndeterminateFillIcon />}
                />
              }
              label="Agree to all"
            />
          )}
        />

        {terms.map(({ title, isRequired }, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
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
      </Section>
      <RoundedButton
        type="submit"
        //  disabled={!isValid}
        onClick={() => setForm(WALLET_FORM)}
      >
        Continue
      </RoundedButton>
    </Stack>
  );
};

export default GoogleFullSignUp;

const StyledTextField = styled(TextField)(({ theme }) => ({
  [`.${inputBaseClasses.input}::placeholder`]: {
    color: '#BBBBBB',
  },
}));
