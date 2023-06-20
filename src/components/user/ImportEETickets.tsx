import React, { useEffect, useState } from 'react';
import { Label, Section } from 'src/components/my-tickets/StyledComponents';
import palette from 'src/theme/palette';
import { Controller, useForm } from 'react-hook-form';
import { Box, Divider, inputBaseClasses, Stack, TextField, Typography } from '@mui/material';
import RoundedButton from 'src/components/common/RoundedButton';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { styled } from '@mui/material/styles';
import {
  cancelMigrateTicket,
  eeLogin,
  getEEMyTicket,
  importEETicket,
  migrateTicket,
} from 'src/services/services';
import { useSelector } from 'react-redux';
import { SUCCESS } from 'src/config';
import { useRouter } from 'next/router';
import Link from 'next/link';

type EETicketTypes = {
  id: number;
  image: string;
  code: string;
  status: string;
  price: number;
  location1: string;
  location2: string;
  location3: string;
  usedTime: Date | null;
  used: boolean;
  onSale: boolean;
  onGift: boolean;
  idShow: number;
  showName: string;
  showLocation: string;
  ticketInfoName: string;
  ticketName: string;
  nftContractAddress: string;
  nftTokenID: any;
  nftBuyerWalletAddress: string;
  migrate: {
    migrateId: any;
    migrateTime: Date;
    migrate: boolean;
  };
  showStartTime: Date;
  txHistory: boolean;
  nft333: boolean;
  earlyBird2023: boolean;
};

const Header = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '32px',
  lineHeight: '36px',
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

const FormSchema = Yup.object().shape({
  email: Yup.string().email().required('Email is required'),
  password: Yup.string().required('Password is required'),
});

type Account = {
  email: string;
  password: string;
};

const ImportEETickets = () => {
  const router = useRouter();
  const webUser = useSelector((state: any) => state.webUser);
  const [isLogin, setIsLogin] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [myEETickets, setMyEETickets] = useState<EETicketTypes[]>([]);
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<Account>({
    mode: 'onTouched',
    resolver: yupResolver(FormSchema),
  });

  const onSubmit = async (values: Account) => {
    try {
      const res = await eeLogin({
        email: 'develop@eternaleditions.io',
        password: 'EEmm1010!',
      });
      console.log(res);
      if (res.status === 200) {
        localStorage.setItem('eeAccessToken', res.data.access_token);
        setIsLogin(true);
      } else {
        console.log('asdf');
      }
    } catch (e) {
      console.log(e);
      setLoginError(true);
    }
  };

  const handleClickImport = async (ticket: EETicketTypes) => {
    console.log(ticket.code, ticket.id);
    const res = await migrateTicket(ticket.code, ticket.id);
    if (res.status === 200) {
      console.log(res);
      const data = {
        uid: webUser.user.uid,
        ticketInfo: res.data,
      };
      const importRes = await importEETicket(data);
      console.log(importRes);

      if (importRes.data.status !== SUCCESS) {
        const cancelRes = await cancelMigrateTicket(ticket.code, ticket.id);
        console.log(cancelRes);
      } else {
        console.log('insert failed');
      }
      setRefetch(true);
    } else {
      console.log('migrate failed');
    }
  };

  const fetchEEMyTicket = async () => {
    const res = await getEEMyTicket();
    if (res.status === 200) {
      setMyEETickets(res.data[0]);
    }
  };
  useEffect(() => {
    if (isLogin) {
      setRefetch(false);
      fetchEEMyTicket();
    }
  }, [isLogin, refetch]);

  return (
    <Stack gap={2} component="form" onSubmit={handleSubmit(onSubmit)} p={'10px'}>
      <Header>{isLogin ? 'Ticket List' : 'Login'}</Header>
      {!isLogin ? (
        <>
          <SectionText>
            To retrieve the existing information registered on ETERNAL EDITIONS MARKET, please log
            in with your existing account.
          </SectionText>
          <Section>
            <Label as="label" sx={{ color: palette.dark.black.lighter }}>
              eMAIL (ee market)
            </Label>

            <Controller
              name="email"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <StyledTextField
                  {...field}
                  autoComplete="off"
                  placeholder="Please enter your email"
                  variant="standard"
                  size={'small'}
                  inputProps={{
                    style: { color: palette.dark.common.black, fontSize: 14, lineHeight: 20 / 14 },
                    autoComplete: 'off',
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
              password
            </Label>

            <Controller
              name="password"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <StyledTextField
                  {...field}
                  autoComplete="off"
                  type="password"
                  placeholder="Please enter password"
                  variant="standard"
                  size={'small'}
                  inputProps={{
                    style: { color: palette.dark.common.black, fontSize: 14, lineHeight: 20 / 14 },
                    autoComplete: 'off',
                  }}
                  fullWidth
                  error={Boolean(error)}
                  helperText={error?.message}
                />
              )}
            />
          </Section>
          {loginError && (
            <Stack
              mt={2}
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{
                md: 2,
              }}
              justifyContent="space-between"
            >
              <SectionText sx={{ color: 'red' }}>Email and password do not match.</SectionText>

              <SectionText
                sx={{ cursor: 'pointer' }}
                onClick={() =>
                  window.open(
                    'https://market.eternaleditions.io/account/login?rp=%2Fmypage%3Flang%3Dko-KR&lang=ko-KR'
                  )
                }
              >
                Check ID/Password
              </SectionText>
            </Stack>
          )}
          <Stack
            mt={2}
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{
              md: 2,
            }}
            justifyContent="space-between"
          >
            <RoundedButton fullWidth type="submit" disabled={!isValid}>
              Verify
            </RoundedButton>
          </Stack>
        </>
      ) : (
        <>
          <SectionText>
            Please select the ticket(s) to be transferred from the existing account to the new
            account.
          </SectionText>
          {myEETickets.map((ticket: EETicketTypes) => (
            <Box key={ticket.id}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography sx={{ fontSize: '12px', color: '#999999', lineHeight: '16.52px' }}>
                    {`NO ${ticket.code}`}
                  </Typography>
                  <Typography sx={{ fontSize: '14px' }}>{ticket.showName}</Typography>
                  <Typography sx={{ fontSize: '12px' }}>
                    {`${ticket.ticketName} - ${ticket.location1}`}
                  </Typography>
                </Box>
                {ticket.id ? (
                  <RoundedButton
                    sx={{ padding: '10px 16px' }}
                    size="small"
                    onClick={() => handleClickImport(ticket)}
                  >
                    Import
                  </RoundedButton>
                ) : (
                  <RoundedButton sx={{ padding: '10px 16px' }} size="small" variant="inactive">
                    DONE
                  </RoundedButton>
                )}
              </Box>
              <Divider />
            </Box>
          ))}
        </>
      )}
    </Stack>
  );
};

export default ImportEETickets;
