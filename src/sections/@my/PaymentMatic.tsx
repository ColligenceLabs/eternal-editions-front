import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// icons
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Divider, Stack, TextField, Typography } from '@mui/material';
import useWallets from '../../hooks/useWallets';
import EECard from 'src/components/EECard';
// components

// ----------------------------------------------------------------------

const FormSchema = Yup.object().shape({
  usd: Yup.number().required('USD is required').default(0),
  matic: Yup.number().required('MATIC is required').default(0),
});

type FormValuesProps = {
  usd: number;
  matic: number;
};

export default function PaymentMatic() {
  const { account } = useWallets();

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValuesProps>({
    mode: 'onTouched',
    resolver: yupResolver(FormSchema),
    defaultValues: {
      usd: 0,
      matic: 0,
    },
  });

  const onSubmit = async (data: FormValuesProps) => {
    console.log(JSON.stringify(data, null, 2), 'submit');
    reset();
  };

  return (
    <EECard
      sx={{
        borderRadius: '24px',
        backgroundColor: 'common.white',
        color: 'common.black',
        p: 3,
        mb: 3,
        backdropFilter: 'blur(50px)',
        WebkitBackdropFilter: 'blur(50px)',
      }}
    >
      <Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack sx={{ mt: 2, mb: 2 }} spacing={1}>
            <Stack sx={{ mb: 3 }}>
              <Typography>{account}</Typography>
            </Stack>

            <Stack>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Controller
                    name="usd"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="결제 금액"
                        error={Boolean(error)}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Box>

                <Typography>USD</Typography>
              </Box>
            </Stack>
            <Stack>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Controller
                    name="matic"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="MATIC 구매 수량"
                        error={Boolean(error)}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Box>

                <Typography>MATIC</Typography>
              </Box>
            </Stack>

            <Divider sx={{ md: 3, pt: 3 }} />

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Simplex 결제
            </LoadingButton>
          </Stack>
        </form>
      </Stack>
    </EECard>
  );
}
