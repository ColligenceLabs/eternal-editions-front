import { styled } from '@mui/material/styles';
import {
  Stack,
  Typography,
  inputBaseClasses,
  Input,
  InputAdornment,
  buttonBaseClasses,
  Box,
} from '@mui/material';
import { Label, Section } from '../my-tickets/StyledComponents';
import palette from 'src/theme/palette';
import RoundedButton from '../common/RoundedButton';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import QRCode from 'react-qr-code';
import React, { useEffect, useState } from 'react';
import { getSession, updateAbcAddress, userRegister } from 'src/services/services';
import { useDispatch, useSelector } from 'react-redux';
import { accountRestApi, controllers } from 'src/abc/background/init';
import { ClipboardCopy } from 'src/utils/wallet';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { setTwoFa } from 'src/store/slices/twoFa';
import { setUser } from 'src/store/slices/user';
import { setWallet } from 'src/store/slices/wallet';
import secureLocalStorage from 'react-secure-storage';

// ----------------------------------------------------------------------

const FormSchema = Yup.object().shape({
  verificationCode: Yup.string().required('Email is required').length(6),
});

type FormValuesProps = {
  verificationCode: string;
};

interface Props {
  onClose: () => void;
}

export default function CreateWalletForm({ onClose }: Props) {
  const {
    control,
    handleSubmit,
    getValues,
    formState: { isValid },
  } = useForm<FormValuesProps>({
    mode: 'onTouched',
    resolver: yupResolver(FormSchema),
    defaultValues: {
      verificationCode: '',
    },
  });

  const { abcController, accountController } = controllers;
  const dispatch = useDispatch();

  const [qrCode, setQrCode] = useState('');
  const [qrSecret, setQrSecret] = useState('');
  const [resetCode, setResetCode] = useState('');

  useEffect(() => {
    const getQrCode = async () => {
      const { qrcode, secret } = await accountController.generateTwoFactor({ reset: false });
      console.log('!! OTP =', qrcode, secret);
      setQrCode(qrcode);
      setQrSecret(secret);
    };
    getQrCode();
  }, []);

  const onSubmit = async ({ verificationCode }: FormValuesProps) => {
    console.log('!! verificationCode = ', verificationCode);

    // optToken : 입력 받은 OTP 값을 입력 받은 후 아래 코드 실행
    const twofaResetCode = await accountController.verifyTwoFactorGen({ token: verificationCode });
    console.log('!! OTP 등록 = ', qrSecret, twofaResetCode);

    if (twofaResetCode) {
      dispatch(setTwoFa({ secret: qrSecret, reset: twofaResetCode }));
      setResetCode(twofaResetCode);

      const abcAuth = JSON.parse(secureLocalStorage.getItem('abcAuth') as string);
      const { user, wallets } = await accountRestApi.getWalletsAndUserByAbcUid(abcAuth);
      console.log('!! user =', user);

      await accountController.recoverShare(
        { password: '!owdin001', user, wallets, keepDB: false },
        dispatch
      );
      // await dispatch(setUser(user));
      // await dispatch(setWallet(wallets));

      alert('등록이 완료되었습니다.');
      onClose();
    } else {
      alert('인증 코드 오류입니다.');
    }
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} gap={3} width="min(400px, 100%)">
      <Header>Creating a Wallet</Header>

      <Stack gap={5}>
        <Typography fontSize={14} lineHeight={20 / 14}>
          After scanning the QR code below in Google Authenticator, Please enter 6 digits of the
          authentication number.
        </Typography>

        <Stack alignItems="center">
          {/*<QRCode value={qrCode} size={160} />*/}
          <img className="QRCode" src={qrCode} alt="qrapp" />
          <Stack direction="row" justifyContent="center" alignItems="center">
            <Typography noWrap={true} sx={{ fontSize: '10px' }}>
              {qrSecret}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '50%',
                backgroundColor: '#F5F5F5',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
              }}
              onClick={() => ClipboardCopy(qrSecret ?? '', '복사되었습니다.')}
            >
              <ContentCopyOutlinedIcon sx={{ fontSize: '14px', m: 0, p: 0 }} />
            </Box>
          </Stack>
        </Stack>

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
                placeholder="Please enter verification code."
                size={'small'}
                type="string"
                inputProps={{
                  style: { color: palette.dark.common.black, fontSize: 14, lineHeight: 20 / 14 },
                }}
                fullWidth
                error={Boolean(error)}
                // endAdornment={
                //   <InputAdornment position="end">
                //     <RoundedButton
                //       variant="inactive"
                //       sx={{
                //         padding: '10px 16px',
                //         marginBottom: '24px',
                //         color: isValid ? palette.dark.common.black : palette.dark.black.lighter,
                //         [`&.${buttonBaseClasses.root}`]: {
                //           fontSize: 12,
                //           lineHeight: 13 / 12,
                //         },
                //       }}
                //     >
                //       {getValues('verificationCode') ? 'Confirm' : 'SEND CODE'}
                //     </RoundedButton>
                //   </InputAdornment>
                // }
              />
            )}
          />
        </Section>
      </Stack>

      <RoundedButton disabled={!isValid} type="submit">
        Complete
      </RoundedButton>
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

const StyledInput = styled(Input)(({ theme }) => ({
  [`.${inputBaseClasses.input}::placeholder`]: {
    color: '#BBBBBB',
  },
}));
