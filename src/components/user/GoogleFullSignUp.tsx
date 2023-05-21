import * as Yup from 'yup';
import React, { useState } from 'react';
import {
  Stack,
  Typography,
  inputBaseClasses,
  Select,
  FormControlLabel,
  Checkbox,
  buttonBaseClasses,
  InputAdornment,
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
import { GoogleAccountData, WALLET_FORM } from './GoogleFlow';
import { Input } from '@mui/material';
import { StyledMenuItem, StyledTextField } from './GoogleLogin';
import { makeStyles } from '@material-ui/core/styles';

interface Props {
  setForm: React.Dispatch<React.SetStateAction<string>>;
  accountData: Partial<GoogleAccountData>;
}
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const FormSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('That is not an email'),
  birthDate: Yup.date().required('Birth date is required').typeError('Invalid date format'),
  name: Yup.string().required('Full name is required'),
  phoneNumber: Yup.string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .required('Phone number is required'),
  verificationCode: Yup.string()
    .required('Verification Code  is required')
    .length(6, 'Verification Code must be exactly 6 characters'),
});

export const terms = [
  { title: 'Agree Terms and Conditions', isRequired: true },
  { title: 'Agree Privacy Policy', isRequired: true },
  { title: 'Receive SMS and E-mails for promotions', isRequired: false },
];

const useStyles = makeStyles((theme) => ({
  menuPaper: {
    backgroundColor: 'white',
  },
}));

const countries = ['Korea', 'China', 'United States', 'Russian'];
const GoogleFullSignUp = ({ setForm, accountData }: Props) => {
  const [showVerifyCode, setShowVerifyCode] = useState<boolean>(false);
  const classes = useStyles();
  const { control, getValues, handleSubmit, watch } = useForm<GoogleAccountData>({
    resolver: yupResolver(FormSchema),
    defaultValues: {
      ...accountData,
      agree: false,
      country: 'Korea',
    },
  });

  const onSubmit = (values: GoogleAccountData) => {
    console.log('submit', values);
    setForm(WALLET_FORM);
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
            <Select
              {...field}
              variant="standard"
              sx={{ color: '#000' }}
              MenuProps={{
                classes: {
                  paper: classes.menuPaper,
                },
              }}
            >
              {countries.map((country) => (
                <StyledMenuItem value={country} key={country}>
                  {country}
                </StyledMenuItem>
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
            <Select
              {...field}
              variant="standard"
              sx={{ color: '#000' }}
              MenuProps={{
                classes: {
                  paper: classes.menuPaper,
                },
              }}
            >
              <StyledMenuItem value={'female'}>Woman</StyledMenuItem>
              <StyledMenuItem value={'male'}>Man</StyledMenuItem>
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
              <StyledTextField
                {...field}
                placeholder="Please enter verification code"
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
      )}

      <Typography variant={'caption'} sx={{ lineHeight: 16 / 12 }}>
        Lost your code?{' '}
        <Typography variant={'caption'} color={'#00BA03'} sx={{ cursor: 'pointer' }}>
          Resend Code
        </Typography>
      </Typography>
      <Stack gap={0}>
        <Controller
          name="agree"
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
              label="Agree to all"
            />
          )}
        />

        {terms.map(({ title, isRequired }, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={watch('agree')}
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

      <RoundedButton type="submit" disabled={!watch('agree') || !watch('verificationCode')}>
        Continue
      </RoundedButton>
    </Stack>
  );
};

export default GoogleFullSignUp;

const StyledInput = styled(Input)(({}) => ({
  [`.${inputBaseClasses.input}::placeholder`]: {
    color: '#BBBBBB',
  },
}));
