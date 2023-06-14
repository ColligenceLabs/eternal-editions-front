import React, { SetStateAction, useMemo, useState } from 'react';
import {
  buttonBaseClasses,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Input,
  InputAdornment,
  inputBaseClasses,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Label, Section } from 'src/components/my-tickets/StyledComponents';
import palette from 'src/theme/palette';
import { Controller, useForm } from 'react-hook-form';
import { MenuProps, RoundedSelectOption } from 'src/components/common/Select';
import RoundedButton from 'src/components/common/RoundedButton';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { styled } from '@mui/material/styles';

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

const SectionHeader = styled(Typography)(({ theme }) => ({
  color: palette.dark.black.lighter,
  fontSize: '12px',
  fontWeight: 400,
  textTransform: 'uppercase',
}));

const SectionText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  lineHeight: 20 / 14,
}));

type TransferData = {
  token: string;
  amount: string;
  address: string;
  twofacode: string;
};

type TransferProps = {
  token: string;
  onClose: SetStateAction<any>;
};

const FormSchema = Yup.object().shape({
  token: Yup.string().required('Crypto is required'),
  amount: Yup.string().required('Amount is required'),
  address: Yup.string().required('Address is required'),
  twofacode: Yup.string(),
});

const StepStatus = {
  step1: 'info',
  step2: 'identity',
  step3: 'complete',
};

const Transfer: React.FC<TransferProps> = ({ token, onClose }) => {
  const defaultValues: TransferData = {
    token: token,
    amount: '',
    address: '',
    twofacode: '',
  };

  const [transferData, setTransferData] = useState<TransferData>(defaultValues);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(StepStatus.step1);

  const tokens = [
    {
      value: 'matic',
      label: 'MATIC',
      icon: '',
    },
    {
      value: 'usdc',
      label: 'USDC',
      icon: '',
    },
  ];

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
  } = useForm<TransferData>({
    resolver: yupResolver(FormSchema),
    defaultValues: {
      ...defaultValues,
      ...transferData,
    },
  });

  const onSubmit = async (value: TransferData) => {
    console.log(value);
    console.log(step);
    if (step === StepStatus.step1) {
      setTransferData(value);
      setStep(StepStatus.step2);
    } else if (step === StepStatus.step2) {
      console.log(value.twofacode);
      setStep(StepStatus.step3);
    } else {
      console.log(step);
      onClose();
    }
  };
  return (
    <Stack gap={2} component="form" onSubmit={handleSubmit(onSubmit)}>
      {step === StepStatus.step1 && (
        <>
          <Typography
            sx={{
              fontSize: { xs: '16px', md: '24px' },
              fontWeight: 'bold',
              lineHeight: { xs: '24px', md: '28px' },
              mb: 2,
            }}
          >
            Transfer
          </Typography>
          <Section>
            <Label as="label" sx={{ color: palette.dark.black.lighter }}>
              CHOOSE TOKEN
            </Label>

            <Controller
              name="token"
              control={control}
              render={({ field }) => (
                <Select {...field} variant="standard" sx={{ color: '#000' }} MenuProps={MenuProps}>
                  {tokens.map(({ value, label }: { value: string; label: string }) => (
                    <RoundedSelectOption value={value} key={value}>
                      {label}
                    </RoundedSelectOption>
                  ))}
                </Select>
              )}
            />
          </Section>
          <Section>
            <Stack>
              <Label as="label" sx={{ color: palette.dark.black.lighter }}>
                AMOUNT
              </Label>

              <Controller
                name="amount"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <StyledTextField
                    {...field}
                    placeholder="Enter the amount to send"
                    variant="standard"
                    size={'small'}
                    inputProps={{
                      style: {
                        color: palette.dark.common.black,
                        fontSize: 14,
                        lineHeight: 20 / 14,
                      },
                    }}
                    fullWidth
                    error={Boolean(error)}
                    helperText={error?.message}
                  />
                )}
              />
            </Stack>
            <RoundedButton
              variant="inactive"
              onClick={() => console.log('Send all')}
              sx={{
                padding: '10px 16px',
                [`&.${buttonBaseClasses.root}`]: {
                  fontSize: 12,
                  lineHeight: 13 / 12,
                },
              }}
            >
              {'SEND ALL'}
            </RoundedButton>
          </Section>
          <Section>
            <Label as="label" sx={{ color: palette.dark.black.lighter }}>
              PHONE NUMBER
            </Label>

            <Controller
              name="address"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <StyledInput
                    {...field}
                    placeholder="Enter the wallet address"
                    size={'small'}
                    inputProps={{
                      style: {
                        color: palette.dark.common.black,
                        fontSize: 14,
                        lineHeight: 20 / 14,
                      },
                    }}
                    fullWidth
                    error={Boolean(error)}
                    endAdornment={
                      <InputAdornment position="end">
                        <RoundedButton
                          variant="inactive"
                          onClick={() => console.log('PASTE')}
                          sx={{
                            padding: '10px 16px',
                            marginBottom: '24px',
                            color: !!watch('address')
                              ? palette.dark.common.black
                              : palette.dark.black.lighter,
                            [`&.${buttonBaseClasses.root}`]: {
                              fontSize: 12,
                              lineHeight: 13 / 12,
                            },
                          }}
                        >
                          {'PASTE'}
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
          <RoundedButton type="submit">
            {isLoading ? <CircularProgress size={15} color="secondary" /> : 'Continue'}
          </RoundedButton>
        </>
      )}
      {step === StepStatus.step2 && (
        <>
          <Typography
            sx={{
              fontSize: { xs: '16px', md: '24px' },
              fontWeight: 'bold',
              lineHeight: { xs: '24px', md: '28px' },
              mb: 2,
            }}
          >
            Transfer
          </Typography>
          <Section>
            <Label as="label" sx={{ color: palette.dark.black.lighter }}>
              2FA(GOOGLE OTP) CODE
            </Label>

            <Controller
              name="twofacode"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <StyledInput
                    {...field}
                    placeholder="Please enter code number"
                    size={'small'}
                    inputProps={{
                      style: {
                        color: palette.dark.common.black,
                        fontSize: 14,
                        lineHeight: 20 / 14,
                      },
                    }}
                    fullWidth
                    error={Boolean(error)}
                    endAdornment={
                      <InputAdornment position="end">
                        <RoundedButton
                          variant="inactive"
                          disabled={!watch('twofacode')}
                          onClick={() => console.log('twofacode')}
                          sx={{
                            padding: '10px 16px',
                            marginBottom: '24px',
                            color: !!watch('twofacode')
                              ? palette.dark.common.black
                              : palette.dark.black.lighter,
                            [`&.${buttonBaseClasses.root}`]: {
                              fontSize: 12,
                              lineHeight: 13 / 12,
                            },
                          }}
                        >
                          {'PASTE'}
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
          <RoundedButton type="submit">
            {isLoading ? <CircularProgress size={15} color="secondary" /> : 'SEND'}
          </RoundedButton>
        </>
      )}
      {step === StepStatus.step3 && (
        <>
          <Typography
            sx={{
              fontSize: { xs: '16px', md: '24px' },
              fontWeight: 'bold',
              lineHeight: { xs: '24px', md: '28px' },
              mb: 2,
            }}
          >
            Transfer Successful
          </Typography>
          <Stack gap="12px">
            <SectionHeader>TOKEN</SectionHeader>
            <SectionText>{transferData.token}</SectionText>
          </Stack>
          <Stack gap="12px">
            <SectionHeader>AMOUNT</SectionHeader>
            <SectionText>{transferData.amount}</SectionText>
          </Stack>
          <Stack gap="12px">
            <SectionHeader>RECIPIENT WALLET ADDRESS</SectionHeader>
            <SectionText>{transferData.address}</SectionText>
          </Stack>
          <Stack gap="12px">
            <SectionHeader>TXID</SectionHeader>
            <SectionText>0x1293124....1232132</SectionText>
          </Stack>
          <RoundedButton type="submit">
            {isLoading ? <CircularProgress size={15} color="secondary" /> : 'CONFIRM'}
          </RoundedButton>
        </>
      )}
    </Stack>
  );
};

export default Transfer;