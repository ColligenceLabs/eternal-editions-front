import React, { SetStateAction, useEffect, useState } from 'react';
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
import { erc20Transfer, ethTransfer, nftTransferFrom } from 'src/utils/transactions';
import useAccount from 'src/hooks/useAccount';
import { SUCCESS } from 'src/config';
import { MyTicketTypes } from 'src/@types/my/myTicket';
import HyperlinkButton from '../ticket/HyperlinkButton';
import { collectionAbi } from 'src/config/abi/Collection';

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
  item: string;
  address: string;
  twofacode: string;
};

type TransferItemProps = {
  item: MyTicketTypes;
  onClose: SetStateAction<any>;
};

const FormSchema = Yup.object().shape({
  item: Yup.string().required('Amount is required'),
  address: Yup.string().required('Address is required'),
  twofacode: Yup.string(),
});

const StepStatus = {
  step1: 'info',
  step2: 'identity',
  step3: 'complete',
};

const TransferItem: React.FC<TransferItemProps> = ({ item, onClose }) => {
  const defaultValues: TransferData = {
    item: item.mysteryboxItem.name,
    address: '',
    twofacode: '',
  };

  const { library, chainId } = useActiveWeb3React();
  const { account } = useAccount();
  const webUser = useSelector((state: any) => state.webUser);
  const abcUser = useSelector((state: any) => state.user);

  const [transferData, setTransferData] = useState<TransferData>(defaultValues);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(StepStatus.step1);
  const [isAbc, setIsAbc] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    type: '',
    message: '',
  });

  const { control, handleSubmit, watch, setValue } = useForm<TransferData>({
    resolver: yupResolver(FormSchema),
    defaultValues: {
      ...defaultValues,
      ...transferData,
    },
  });

  const handlePaste = (key: 'address' | 'token' | 'item' | 'twofacode') => {
    navigator.clipboard.readText().then((text) => {
      setValue(key, text);
    });
  };

  useEffect(() => {
    if (account === webUser.user.abc_address) {
      setIsAbc(true);
      console.log('!! isAbc ? ', true);
    } else {
      setIsAbc(false);
      console.log('!! isAbc ? ', false);
    }
  }, [account, webUser]);

  const onSubmit = async (value: TransferData) => {
    const loginBy = window.localStorage.getItem('loginBy') ?? 'sns';

    if (step === StepStatus.step1) {
      setTransferData(value);
      if (loginBy === 'sns') setStep(StepStatus.step2);
    } else if (step === StepStatus.step2) {
      console.log('---------->', value.address, value.twofacode);
      setIsLoading(true);
      const contract = ticketInfo.mysteryboxInfo.boxContractAddress;
      const tokenId = ticketInfo.tokenId;
      const quote = ticketInfo?.quote;
      let quoteToken: string;
      if (quote === 'matic' || quote === 'wmatic') {
        // TODO : Quote 가 MATIC 이 아닌 경우는 어떻하지 ?
        quoteToken = quote === 'matic' ? contracts.matic[chainId] : contracts.wmatic[chainId];
      }

      // TODO : 버튼 로딩 시작
      if (isAbc) {
        const method = 'transferFrom';
        const txArgs = [account, value.address, tokenId];

        try {
          const result = await abcSendTx(
            value.twofacode,
            contract,
            collectionAbi,
            method,
            txArgs,
            abcUser
          );

          if (parseInt(result.status.toString(), 16) === SUCCESS) {
            setOpenSnackbar({
              open: true,
              type: 'success',
              message: `Success Transfer.`,
            });
            // TODO : DB drops 테이블에서 삭제 ?
          } else {
            setOpenSnackbar({
              open: true,
              type: 'error',
              message: `Field Transfer.`,
            });
          }
        } catch (e: any) {}
      } else {
        // Metamask
        const result = await nftTransferFrom(
          contract,
          value.address,
          tokenId.toString(),
          account!,
          library,
          false
        );
        console.log(result);
        if (result === SUCCESS) {
          setOpenSnackbar({
            open: true,
            type: 'success',
            message: `Success Transfer.`,
          });
          setStep(StepStatus.step3);
          // TODO : DB drops 테이블에서 삭제 ?
        } else {
          setOpenSnackbar({
            open: true,
            type: 'error',
            message: `Field Transfer.`,
          });
        }
      }
      // TODO : 버튼 로딩 끝
      setIsLoading(false);
      onClose();
    } else {
      console.log(step);
      onClose();
    }
  };
  return (
    <Stack gap={2} component="form" onSubmit={handleSubmit(onSubmit)} pt={1}>
      {step === StepStatus.step1 && (
        <>
          <Typography
            sx={{
              fontSize: '32px',
              fontWeight: 'bold',
              lineHeight: '36px',
            }}
          >
            Transfer Item
          </Typography>

          <Section>
            <Stack>
              <Label as="label" sx={{ color: palette.dark.black.lighter }}>
                chOOSE Item
              </Label>

              <Controller
                name="item"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <StyledTextField
                    {...field}
                    placeholder="Enter the item to send"
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
                    placeholder="Please enter the code"
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
            <SectionHeader>ITEM</SectionHeader>
            <SectionText sx={{ fontWeight: 700 }}>{transferData.item}</SectionText>
          </Stack>
          <Stack gap="12px">
            <SectionHeader>RECIPIENT WALLET ADDRESS</SectionHeader>
            <SectionText>{transferData.address}</SectionText>
          </Stack>
          <Stack gap="12px">
            <SectionHeader>TXID</SectionHeader>
            <Stack flexDirection={'row'} gap={1} alignItems={'center'}>
              <SectionText>0x1293124....1232132</SectionText>
              <HyperlinkButton />
            </Stack>
          </Stack>
          <RoundedButton type="submit">
            {isLoading ? <CircularProgress size={15} color="secondary" /> : 'CONFIRM'}
          </RoundedButton>
        </>
      )}
    </Stack>
  );
};

export default TransferItem;