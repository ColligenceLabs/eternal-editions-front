import { styled } from '@mui/material/styles';
import {
  Stack,
  Typography,
  inputBaseClasses,
  Input,
  InputAdornment,
  buttonBaseClasses,
} from '@mui/material';
import { Label, Section } from '../my-tickets/StyledComponents';
import palette from 'src/theme/palette';
import RoundedButton from '../common/RoundedButton';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import QRCode from 'react-qr-code';

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

  const onSubmit = async ({ verificationCode }: FormValuesProps) => {
    onClose();
  };

  const onChange = () => {};

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} gap={3} width="min(400px, 100%)">
      <Header>Creating a Wallet</Header>

      <Stack gap={5}>
        <Typography fontSize={14} lineHeight={20 / 14}>
          After scanning the QR code below in Google Authenticator, Please enter 6 digits of the
          authentication number.
        </Typography>

        <Stack alignItems="center">
          <QRCode value={`https://entrace2023.eternaleditions.io/entrace-confirm`} size={160} />
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
                type="email"
                inputProps={{
                  style: { color: palette.dark.common.black, fontSize: 14, lineHeight: 20 / 14 },
                }}
                fullWidth
                error={Boolean(error)}
                endAdornment={
                  <InputAdornment position="end">
                    <RoundedButton
                      variant="inactive"
                      sx={{
                        padding: '10px 16px',
                        marginBottom: '24px',
                        color: isValid ? palette.dark.common.black : palette.dark.black.lighter,
                        [`&.${buttonBaseClasses.root}`]: {
                          fontSize: 12,
                          lineHeight: 13 / 12,
                        },
                      }}
                    >
                      {getValues('verificationCode') ? 'Confirm' : 'SEND CODE'}
                    </RoundedButton>
                  </InputAdornment>
                }
              />
            )}
          />
        </Section>
      </Stack>

      <RoundedButton disabled={!isValid}>Complete</RoundedButton>
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
