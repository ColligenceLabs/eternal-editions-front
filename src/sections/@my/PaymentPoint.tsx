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
import React, { ChangeEvent, useEffect, useState } from 'react';
// components
import { getUser, savePoint } from '../../services/services';
import { SUCCESS } from '../../config';
import { setWebUser } from '../../store/slices/webUser';
import { useDispatch } from 'react-redux';

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
  const dispatch = useDispatch();
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [enablePaypal, setEnablePaypal] = useState(true);

  useEffect(() => {
    if (price !== '') setEnablePaypal(false);
    else setEnablePaypal(true);
  }, [price]);

  // creates a paypal order
  const createOrder = (data: any, actions: any) => {
    // todo 세션체크를 한번 해야하나?
    console.log(price);
    const purchaseData = {
      purchase_units: [
        {
          amount: {
            value: parseFloat(price),
          },
        },
      ],
      // remove the applicaiton_context object if you need your users to add a shipping address
      application_context: {
        shipping_preference: 'NO_SHIPPING',
      },
    };
    console.log('=====', purchaseData);
    return actions.order.create(purchaseData).then(async (orderID: any) => {
      // setOrderID(orderID);
      console.log('order complete.', orderID);
      return orderID;
    });
  };

  // handles when a payment is confirmed for paypal
  const onApprove = (data: any, actions: any) => {
    return actions.order
      .capture()
      .then(async (details: any) => {
        const { payer } = details;
        console.log('details', details, payer);
        const result = await savePoint({
          order_id: details.id,
          point: parseFloat(price),
          type: 'BUY',
        });
        if (result.data.status === SUCCESS) {
          const userRes = await getUser();
          if (userRes.status === 200 && userRes.data.status != 0)
            dispatch(setWebUser(userRes.data.user));
        }
        // setBillingDetails(payer);
        // setSucceeded(true);
      })
      .catch((err: any) => console.log('Something went wrong.', err));
  };

  const handleChangePrice = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value) {
      setPrice(value);
      setAmount(value);
    } else {
      setPrice('');
      setAmount('');
    }
  };

  const handleChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value) {
      setPrice(value);
      setAmount(value);
    } else {
      setPrice('');
      setAmount('');
    }
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

            <PayPalButtons
              fundingSource={'paypal'}
              createOrder={createOrder}
              onApprove={onApprove}
              forceReRender={[price]}
              disabled={enablePaypal}
            />

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
              onClick={() => {
                window.location.href = '/kspay';
              }}
            >
              결제하기
            </LoadingButton>
          </Stack>
        </form>
      </Stack>
    </EECard>
  );
}
