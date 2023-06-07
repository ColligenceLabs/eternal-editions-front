import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { styled } from '@mui/material/styles';
import { Select, Stack, TextField, Typography, inputBaseClasses } from '@mui/material';
import { Label, Section } from '../my-tickets/StyledComponents';
import palette from 'src/theme/palette';
import { MenuProps, RoundedSelectOption } from '../common/Select';
import RoundedButton from '../common/RoundedButton';

const FormSchema = Yup.object().shape({
  accountHolder: Yup.string().required('Account holder is required'),
  bank: Yup.string().required('Bank is required'),
  accountNumber: Yup.string().required('Account number is required'),
});

type Account = {
  accountHolder: string;
  bank: string;
  accountNumber: string;
};
const bankOptions = [{ value: 'TCB', label: 'TCB' }];
const RegisterAccount = () => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<Account>({
    mode: 'onTouched',
    resolver: yupResolver(FormSchema),
  });
  const onSubmit = async (values: Account) => {
    console.log('values: ', values);
  };

  return (
    <Stack gap={2} component="form" onSubmit={handleSubmit(onSubmit)}>
      <Header>Register Account</Header>
      <SectionText>
        You can only enter an account number in your own name, and you cannot verify with an account
        registered by someone else. The account information you provide will be stored as your basic
        information.
      </SectionText>
      <Section>
        <Label as="label" sx={{ color: palette.dark.black.lighter }}>
          Account Holder
        </Label>

        <Controller
          name="accountHolder"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <StyledTextField
              {...field}
              placeholder="Please enter account holder"
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
          Bank
        </Label>

        <Controller
          name="bank"
          control={control}
          render={({ field }) => (
            <Select {...field} variant="standard" sx={{ color: '#000' }} MenuProps={MenuProps}>
              {bankOptions.map(({ value, label }: { value: string; label: string }) => (
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
          account number
        </Label>

        <Controller
          name="accountNumber"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <StyledTextField
              {...field}
              placeholder="Please enter account number"
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
      <Stack
        mt={2}
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="space-between"
      >
        <RoundedButton fullWidth type="submit" variant="inactive">
          cancel
        </RoundedButton>
        <RoundedButton fullWidth type="submit">
          Register
        </RoundedButton>
      </Stack>
    </Stack>
  );
};

export default RegisterAccount;
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
const SectionText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  lineHeight: 20 / 14,
}));
const StyledTextField = styled(TextField)(({ theme }) => ({
  [`.${inputBaseClasses.input}::placeholder`]: {
    color: '#BBBBBB',
  },
  '& input': {
    color: theme.palette.common.black,
  },
}));
