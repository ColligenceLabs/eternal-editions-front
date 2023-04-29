import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
// icons
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Input,
  InputAdornment,
  Popover,
  FormHelperText,
  InputLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import { Iconify } from 'src/components';
import EECard from 'src/components/EECard';
import { useTheme } from '@mui/material/styles';
import { PayPalButtons } from '@paypal/react-paypal-js';
import React, { ChangeEvent, useEffect, useState } from 'react';
// components
import { getExchange, getUser, savePoint } from '../../services/services';
import { SUCCESS } from '../../config';
import { setWebUser } from '../../store/slices/webUser';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import useAccount from '../../hooks/useAccount';
import { boolean } from 'zod';

// ----------------------------------------------------------------------

const FormSchema = Yup.object().shape({
  // krw: Yup.number().required('KRW is required').default(0),
  // edc: Yup.number().required('EDCP is required').default(0),
  amount: Yup.number()
    .required('KRW is required')
    .default(0)
    .max(60, 'The maximum rechargeable amount is 60 EDCP.')
    .min(1),
  price: Yup.number().required('EDCP is required').default(0),
});

type FormValuesProps = {
  // krw: number;
  // edc: number;
  price: number;
  amount: number;
};

export default function PaymentPoint() {
  const dispatch = useDispatch();
  const { account } = useAccount();
  const [exchange, setExchange] = useState(0);
  const [enablePaypal, setEnablePaypal] = useState(true);
  const [method, setMethod] = useState('credit');
  const theme = useTheme();
  const router = useRouter();

  const {
    reset,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValuesProps>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: yupResolver(FormSchema),
    defaultValues: {
      amount: 0,
      price: 0,
    },
  });

  useEffect(() => {
    if (watch('price') !== 0) setEnablePaypal(false);
    else setEnablePaypal(true);
  }, [watch('price')]);

  useEffect(() => {
    const getUSDExchange = async () => {
      setExchange(process.env.NODE_ENV === 'development' ? 100 : (await getExchange()).data);
    };
    if (exchange === 0) getUSDExchange();
  }, []);

  // creates a paypal order
  const createOrder = (data: any, actions: any) => {
    // todo 세션체크를 한번 해야하나?
    console.log(watch('price'));
    const purchaseData = {
      purchase_units: [
        {
          amount: {
            value: watch('price'),
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
  const onApprove = async (data: any, actions: any) => {
    try {
      const details = await actions.order.capture();
      // .then(async (details: any) => {
      console.log('details', details);
      const result = await savePoint({
        order_id: details.id,
        point: watch('price'),
        type: 'BUY',
      });
      if (result.data.status === SUCCESS) {
        const userRes = await getUser();

        if (userRes.status === 200 && userRes.data.status != 0) {
          await dispatch(setWebUser(userRes.data.user));
          router.push('/paypal_result');
        }
      }
      // setBillingDetails(payer);
      // setSucceeded(true);
      // })
    } catch (error) {
      console.log('Something went wrong.', error);
    }
  };

  // const handleChangePrice = (event: ChangeEvent<HTMLInputElement>) => {
  //   const { value } = event.target;
  //   if (value) {
  //     setValue('price', (value * 10 * exchange).toString());
  //     setValue('amount', value);
  //   } else {
  //     setValue('price', '');
  //     setValue('amount', '');
  //   }
  // };

  const handleChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const val = Math.min(60, +value);
    if (val < 0) return;
    if (val) {
      if (method == 'credit') {
        setValue('price', val * 10 * exchange);
      } else {
        setValue('price', val * 10);
      }

      setValue('amount', val);
    } else {
      setValue('price', 0);
      setValue('amount', 0);
    }
  };

  const onSubmit = async (data: FormValuesProps) => {
    console.log(JSON.stringify(data, null, 2), 'submit');
    reset();
  };

  useEffect(() => {
    if (method == 'credit') {
      setValue('price', watch('amount') * 10 * exchange);
    } else {
      setValue('price', watch('amount') * 10);
    }
  }, [method]);

  const [open, setOpen] = useState<HTMLElement | null>(null);
  return (
    <EECard>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={1}>
          <Box>
            <Typography sx={{ fontColor: '#999999', fontSize: '12px' }}>WALLET ADDRESS</Typography>
            <Typography sx={{ wordBreak: 'break-all' }}>{account}</Typography>
          </Box>
          <Stack spacing={2}>
            <Controller
              name="amount"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl variant="standard" fullWidth>
                  <InputLabel>
                    <Stack direction="row" alignItems="center">
                      PURCHASE QUANTITY
                      <Iconify
                        icon="mdi:information-outline"
                        fontSize={20}
                        sx={{ mx: 0.5 }}
                        onClick={(e: React.MouseEvent<HTMLElement>) => setOpen(e.currentTarget)}
                      />
                      <Popover
                        open={Boolean(open)}
                        onClose={() => setOpen(null)}
                        anchorEl={open}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        PaperProps={{
                          sx: {
                            px: 2,
                            py: 1,
                            mt: 1,
                            backgroundColor: 'white',
                            color: theme.palette.common.black,
                            borderRadius: 0,
                            border: `1px solid ${theme.palette.common.black}`,
                            boxShadow: 'none',
                          },
                        }}
                      >
                        <Typography variant="body3">
                          The maximum rechargeable amount is 60 EDCP.
                        </Typography>
                      </Popover>
                    </Stack>
                  </InputLabel>
                  <Input
                    {...{
                      ...field,
                      onChange: handleChangeAmount,
                      error: Boolean(error),
                      inputProps: { style: { color: 'black' }, max: 60 },
                      endAdornment: <InputAdornment position="end">EDCP</InputAdornment>,
                    }}
                    // eslint-disable-next-line react/jsx-no-duplicate-props
                  />
                  {error && <FormHelperText id="my-helper-text">{error?.message}</FormHelperText>}
                </FormControl>
              )}
            />
            <Controller
              name="price"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl variant="standard" fullWidth>
                  <InputLabel>PURCHASE AMOUNT</InputLabel>
                  <Input
                    {...field}
                    readOnly
                    inputProps={{ style: { color: 'black' } }}
                    endAdornment={
                      <InputAdornment position="end">
                        {method === 'credit' ? '₩' : '$'}
                      </InputAdornment>
                    }
                  />
                </FormControl>
              )}
            />
          </Stack>
          {/* <Stack direction="row" alignItems={'center'}>
              <Typography sx={{ fontColor: '#999999', fontSize: '12px' }}>
                PURCHASE QUANTITY
              </Typography>
            </Stack>
            <FormControl fullWidth variant="standard">
              <Input
                id="standard-adornment-amount"
                type="number"
                // placeholder="Please enter purchase quantity"

                value={amount}
                onChange={handleChangeAmount}
                endAdornment={<InputAdornment position="end">EDCP</InputAdornment>}
                inputProps={{
                  style: { color: theme.palette.grey[900], width: '100%' },
                  max: 60,
                  type: 'number',
                }}
              />
            </FormControl> */}
          {/* <Box>
            <Typography sx={{ fontColor: '#999999', fontSize: '12px' }}>PAYMENT AMOUNT</Typography>
            <FormControl fullWidth variant="standard">
              <Input
                id="standard-adornment-amount"
                value={price}
                // onChange={handleChangePrice}
                inputProps={{ style: { color: theme.palette.grey[900], width: '100%' } }}
                endAdornment={
                  <InputAdornment position="end">{method === 'credit' ? '₩' : '$'}</InputAdornment>
                }
              />
            </FormControl>
          </Box> */}
          <Box>
            <Typography sx={{ fontColor: '#999999', fontSize: '12px' }}>PAYMENT METHOD</Typography>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  checked={method === 'credit'}
                  onChange={() => setMethod('credit')}
                  value="credit"
                  control={<Radio />}
                  label="CREDIT CARD"
                />
                <FormControlLabel
                  checked={method === 'paypal'}
                  onChange={() => setMethod('paypal')}
                  value="paypal"
                  control={<Radio />}
                  label="PAYPAL"
                />
              </RadioGroup>
            </FormControl>
          </Box>
          {method === 'paypal' && (
            <PayPalButtons
              fundingSource={'paypal'}
              createOrder={createOrder}
              onApprove={onApprove}
              forceReRender={[watch('price')]}
              disabled={enablePaypal || !watch('amount')}
            />
          )}
          {method === 'credit' && (
            <Box sx={{ pb: 2 }}>
              <Link
                href={{
                  pathname: '/kspay',
                  query: { price: watch('price'), amount: watch('amount') },
                }}
              >
                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="vivid"
                  loading={isSubmitting}
                  disabled={!watch('amount')}
                >
                  결제하기
                </LoadingButton>
              </Link>
            </Box>
          )}
          <Divider />
          <Box sx={{ pt: 2 }}>
            <LoadingButton
              onClick={() => {
                window.location.href =
                  'https://docs.google.com/forms/d/e/1FAIpQLScJ3sUZBB19edQ01hzp3rOgdBgJIRpufqzAQFHfbgdyJKnnGQ/viewform';
              }}
              fullWidth
              size="large"
              type="button"
              variant="contained"
            >
              환불요청
            </LoadingButton>
          </Box>
        </Stack>

        {/*  <Divider sx={{ md: 3, pt: 3 }} />*/}

        {/*  <PayPalButtons*/}
        {/*    fundingSource={'paypal'}*/}
        {/*    createOrder={createOrder}*/}
        {/*    onApprove={onApprove}*/}
        {/*    forceReRender={[price]}*/}
        {/*    disabled={enablePaypal}*/}
        {/*  />*/}

        {/*  <Link href={{ pathname: '/kspay', query: { price } }}>*/}
        {/*    <LoadingButton*/}
        {/*      fullWidth*/}
        {/*      size="large"*/}
        {/*      type="submit"*/}
        {/*      variant="contained"*/}
        {/*      loading={isSubmitting}*/}
        {/*      // onClick={() => {*/}
        {/*      //   window.location.href = '/kspay';*/}
        {/*      // }}*/}
        {/*    >*/}
        {/*      결제하기*/}
        {/*    </LoadingButton>*/}
        {/*  </Link>*/}
        {/*</Stack>*/}
      </form>
    </EECard>
  );
}
