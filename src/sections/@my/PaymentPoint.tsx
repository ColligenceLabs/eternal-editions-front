import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// icons
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Divider, Stack, TextField, Typography } from '@mui/material';
import EECard from '../../components/EECard';
import { useTheme } from '@mui/material/styles';
import { PayPalButtons } from '@paypal/react-paypal-js';
import React, { ChangeEvent, useState } from 'react';
// components

// ----------------------------------------------------------------------

const FormSchema = Yup.object().shape({
  krw: Yup.number().required('KRW is required').default(0),
  edc: Yup.number().required('EDC is required').default(0),
});

type FormValuesProps = {
  krw: number;
  edc: number;
};

export default function PaymentPoint() {
  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(0);

  const handleChangePrice = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPrice(parseInt(value));
    setAmount(parseInt(value));
  };

  const handleChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPrice(parseInt(value));
    setAmount(parseInt(value));
  };
  const theme = useTheme();
  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValuesProps>({
    mode: 'onTouched',
    resolver: yupResolver(FormSchema),
    defaultValues: {
      krw: 0,
      edc: 0,
    },
  });

  const onSubmit = async (data: FormValuesProps) => {
    console.log(JSON.stringify(data, null, 2), 'submit');
    reset();
  };

  return (
    <EECard bgColor="common.white" color="common.black">
      <Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack sx={{ mt: 2, mb: 2 }} spacing={1}>
            <Stack>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Controller
                    name="krw"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="결제 금액"
                        value={price}
                        onChange={handleChangePrice}
                        error={Boolean(error)}
                        helperText={error?.message}
                        inputProps={{ style: { color: theme.palette.grey[900], width: '100%' } }}
                      />
                    )}
                  />
                </Box>

                <Typography>KRW</Typography>
              </Box>
            </Stack>
            <Stack>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Controller
                    name="edc"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="포인트 구매 수량"
                        value={amount}
                        onChange={handleChangeAmount}
                        error={Boolean(error)}
                        helperText={error?.message}
                        inputProps={{ style: { color: theme.palette.grey[900], width: '100%' } }}
                      />
                    )}
                  />
                </Box>

                <Typography>EDC</Typography>
              </Box>
            </Stack>

            <Divider sx={{ md: 3, pt: 3 }} />

            <PayPalButtons fundingSource={'paypal'} />

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              결제하기
            </LoadingButton>
          </Stack>
        </form>
      </Stack>
    </EECard>
  );
}
