import React, { SetStateAction, useState } from 'react';
import {
  buttonBaseClasses,
  CircularProgress,
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
import { ethers } from 'ethers';
import { abcSendMatic, abcSendTx } from 'src/utils/abcTransactions';
import tokenAbi from 'src/config/abi/ERC20Token.json';
import contracts from 'src/config/constants/contracts';
import useActiveWeb3React from 'src/hooks/useActiveWeb3React';
import { useSelector } from 'react-redux';
import { erc20Transfer, ethTransfer } from 'src/utils/transactions';
import useAccount from 'src/hooks/useAccount';
import { SUCCESS } from 'src/config';
import Image from '../Image';

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
  amount: number;
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

const Transfer: React.FC<TransferProps> = ({ token, amount: totalBalance, onClose }) => {
  const defaultValues: TransferData = {
    token: token,
    amount: '',
    address: '',
    twofacode: '',
  };

  const { library, chainId } = useActiveWeb3React();
  const { account } = useAccount();
  const abcUser = useSelector((state: any) => state.user);
  const [transferData, setTransferData] = useState<TransferData>(defaultValues);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(StepStatus.step1);

  console.log(totalBalance);
  const tokens = [
    {
      value: 'matic',
      label: 'MATIC',
      icon: '/assets/img/matic-token-icon.png',
    },
    {
      value: 'usdc',
      label: 'USDC',
      icon: '/assets/img/usdc-token-icon.png',
    },
  ];

  const { control, handleSubmit, watch, setValue } = useForm<TransferData>({
    resolver: yupResolver(FormSchema),
    defaultValues: {
      ...defaultValues,
      ...transferData,
    },
  });

  const handlePaste = (key: 'address' | 'token' | 'amount' | 'twofacode') => {
    navigator.clipboard.readText().then((text) => {
      setValue(key, text);
    });
  };

  const onSubmit = async (value: TransferData) => {
    const loginBy = window.localStorage.getItem('loginBy') ?? 'sns';

    if (step === StepStatus.step1) {
      setTransferData(value);
      if (loginBy === 'sns') setStep(StepStatus.step2);
      else {
        // Metamask
        setIsLoading(true);
        let result: any;
        if (value.token === 'usdc') {
          result = await erc20Transfer(
            contracts.usdc[chainId],
            value.address,
            ethers.utils.parseUnits(value.amount, 6).toString(),
            account!,
            library,
            false
          );
        } else {
          result = await ethTransfer(
            value.address,
            ethers.utils.parseEther(value.amount).toString(),
            account!,
            library,
            false
          );
        }
        console.log('== tx result ==', result);
        setIsLoading(false);
        if (result === SUCCESS) setStep(StepStatus.step3);
        else {
          // TODO : 화면에 에러 표시
          console.log('!! transfer failed...');
        }
      }
    } else if (step === StepStatus.step2) {
      console.log(value.twofacode);
      let result: any;
      setIsLoading(true);
      if (loginBy === 'sns') {
        if (value.token === 'usdc') {
          const to = contracts.usdc[chainId]; // USDC Smart Contract
          const method = 'transfer';
          const txArgs = [
            value.address, // Recipient
            ethers.utils.parseUnits(value.amount, 6), // Amount, USDC decimal = 6
          ];
          result = await abcSendTx(value.twofacode, to, tokenAbi, method, txArgs, abcUser);
          console.log('== tx result ==', result.status); // 0x1 : 성공
        } else {
          result = await abcSendMatic(
            value.twofacode,
            value.address,
            abcUser,
            ethers.utils.parseEther(value.amount).toString()
          );
          console.log('== tx result ==', result.status);
        }
      }
      setIsLoading(false);
      if (result?.status === '0x1') setStep(StepStatus.step3);
      else {
        // TODO : 화면에 에러 표시
        console.log('!! transfer failed...');
      }
    } else {
      console.log(step);
      onClose();
    }
  };
  return (
    <Stack gap={3} component="form" onSubmit={handleSubmit(onSubmit)} pt={1}>
      {step === StepStatus.step1 && (
        <>
          <Typography
            sx={{
              fontSize: '32px',
              fontWeight: 'bold',
              lineHeight: '36px',
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
                  {tokens.map(
                    ({ value, label, icon }: { value: string; label: string; icon: string }) => (
                      <RoundedSelectOption value={value} key={value}>
                        <Stack gap={1} flexDirection={'row'} alignItems={'center'}>
                          <Image
                            alt="edcp-logo"
                            src={icon}
                            sx={{ width: '24px', height: '24px' }}
                          />
                          {label}
                        </Stack>
                      </RoundedSelectOption>
                    )
                  )}
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
            <div>
              <RoundedButton
                variant="inactive"
                onClick={() =>
                  setValue(
                    'amount',
                    token === 'usdc' ? totalBalance.toString() : (totalBalance - 0.01).toString()
                  )
                }
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
            </div>
          </Section>
          <Section>
            <Label as="label" sx={{ color: palette.dark.black.lighter }}>
              Recipient wallet address
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
                          onClick={() => handlePaste('address')}
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
            {isLoading ? <CircularProgress size={15} color="secondary" /> : 'Next'}
          </RoundedButton>
        </>
      )}
      {step === StepStatus.step2 && (
        <>
          <Typography
            sx={{
              fontSize: '32px',
              fontWeight: 'bold',
              lineHeight: '36px',
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
                          onClick={() => handlePaste('twofacode')}
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
          <RoundedButton type="submit" variant={!!watch('twofacode') ? 'default' : 'withImage'}>
            {isLoading ? <CircularProgress size={15} color="secondary" /> : 'SEND'}
          </RoundedButton>
        </>
      )}
      {step === StepStatus.step3 && (
        <>
          <Typography
            sx={{
              fontSize: '32px',
              fontWeight: 'bold',
              lineHeight: '36px',
            }}
          >
            Transfer Successful
          </Typography>

          <Stack gap="12px">
            <SectionHeader>TOKEN</SectionHeader>
            <SectionText>
              <Stack gap={1} flexDirection={'row'} alignItems={'center'}>
                <Image
                  alt="token"
                  src={
                    transferData.token === 'matic'
                      ? '/assets/img/matic-token-icon.png'
                      : '/assets/img/usdc-token-icon.png'
                  }
                  sx={{ width: '24px', height: '24px' }}
                />
                {transferData.token}
              </Stack>
            </SectionText>
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
