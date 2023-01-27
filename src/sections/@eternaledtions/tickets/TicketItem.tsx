// next
// @mui
import { Box, Button, Stack, Typography } from '@mui/material';
// routes
// utils
// @types
// components
import { MYTicketProps } from '../../../@types/ticket/ticket';
import EECard from '../../../components/EECard';
import { m } from 'framer-motion';
import { Image, TextIconLabel, TextMaxLine, varHover, varTranHover } from '../../../components';
import React, { ReactElement, useEffect, useState } from 'react';
import EEAvatar from '../../../components/EEAvatar';
import { fDate } from '../../../utils/formatTime';
import axios from 'axios';

// ----------------------------------------------------------------------

type Props = {
  ticket?: MYTicketProps;
};

export default function TicketItem({ ticket }: any) {
  const [maticPrice, setMaticPrice] = useState(0);
  const [klayPrice, setKlayPrice] = useState(0);
  const [ticketInfo, setTicketInfo] = useState({
    company: '',
    companyImage: null,
    createdAt: null,
    itemTitle: '',
    itemImage: '',
    price: 0,
    location: '',
    ticketNumber: '',
  });

  const getCoinPrice = () => {
    const url = 'https://bcn-api.talken.io/coinmarketcap/cmcQuotes?cmcIds=4256,3890';
    try {
      if (klayPrice === 0 || maticPrice === 0) {
        axios(url).then((response) => {
          const klayUsd = response.data.data[4256].quote.USD.price;
          const maticUsd = response.data.data[3890].quote.USD.price;
          setKlayPrice(parseFloat(klayUsd));
          setMaticPrice(parseFloat(maticUsd));
        });
      }
    } catch (error: any) {
      console.log(new Error(error));
    }
  };

  useEffect(() => {
    getCoinPrice();
  }, []);

  useEffect(() => {
    if (ticket) {
      const location =
        ticket.properties &&
        ticket.properties.find((item: any) => (item.type.toLowerCase() === 'location' ? item : ''));
      setTicketInfo({
        company: ticket.companyname.en,
        companyImage: ticket.companyimage,
        createdAt: ticket.createdAt,
        itemTitle: ticket.title.en,
        itemImage: ticket.itemImage,
        price: ticket.price,
        location: location?.name ? location.name : '',
        ticketNumber: '',
      });
    }
  }, [ticket]);

  return (
    <Stack
      component={m.div}
      whileHover="hover"
      variants={varHover(1)}
      transition={varTranHover()}
      sx={{ borderRadius: 2, overflow: 'hidden', position: 'relative', maxHeight: '380px' }}
    >
      <Stack
        justifyContent="space-between"
        sx={{
          p: 3,
          borderRadius: 2,
          height: 1,
          zIndex: 1000,
          right: 0,
          width: {
            sm: '50%',
          },
          position: 'absolute',
          color: 'common.black',
          backgroundColor: 'common.white',
        }}
      >
        <Stack>
          <LineItem
            icon={<></>}
            label="Reserve Price"
            value={`$${((ticketInfo?.price ?? 0) * maticPrice).toFixed(4)} (Ξ ${
              ticketInfo?.price
            })`}
          />
          <LineItem icon={<></>} label="Location" value={ticketInfo.location} />
          <LineItem icon={<></>} label="Number of tickets" value={ticketInfo.ticketNumber} />

          <Stack sx={{ mt: 3 }} justifyContent="center" alignItems="center">
            <img src={'/assets/example/qr.png'} style={{ maxWidth: '120px' }} />
          </Stack>

          <Stack sx={{ mt: 4 }}>
            <Button size="large" variant="contained" fullWidth={true}>
              TO ENTER
            </Button>
          </Stack>
        </Stack>
      </Stack>

      <Box
        component={'div'}
        sx={{
          width: {
            sm: '55%',
          },
        }}
      >
        <Stack spacing={1} sx={{ position: 'absolute', zIndex: 999, left: 20, top: 20 }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ opacity: 0.72, typography: 'caption' }}
          >
            <EEAvatar src={ticketInfo.companyImage!} sx={{ mr: 0, width: 24, height: 24 }} />

            <Typography>{ticketInfo.company}</Typography>
          </Stack>

          <TextMaxLine variant="h3" sx={{ width: '80%' }}>
            {ticketInfo.itemTitle}
          </TextMaxLine>
          <Typography
            variant="body1"
            sx={{
              mb: 1,
              mt: { xs: 1, sm: 0.5 },
              color: 'common.white',
            }}
          >
            {ticketInfo.createdAt && fDate(ticketInfo.createdAt)}
          </Typography>
        </Stack>

        <Image src={ticketInfo.itemImage} alt={ticketInfo.itemTitle} ratio="6/4" />
      </Box>
    </Stack>
  );
}

type LineItemProps = {
  icon: ReactElement;
  label: string;
  value: any;
};

function LineItem({ icon, label, value }: LineItemProps) {
  return (
    <TextIconLabel
      icon={icon}
      value={
        <>
          <Typography sx={{ fontSize: '14px' }}>{label}</Typography>
          <Typography
            variant="subtitle2"
            sx={{
              color: 'common.black',
              flexGrow: 1,
              textAlign: 'right',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            {value}
          </Typography>
        </>
      }
      sx={{
        color: 'common.black',
        '& svg': { mr: 1, width: 24, height: 24 },
        borderBottom: '1px solid #bfbfbf',
        mb: 1,
      }}
    />
  );
}
