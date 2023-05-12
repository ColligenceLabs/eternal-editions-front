// @mui
import { Box, Stack, Grid, Typography } from '@mui/material';
import { m } from 'framer-motion';
import { Image, TextMaxLine, varHover, varTranHover } from 'src/components';
import React, { ReactElement, useEffect, useState } from 'react';
import axios from 'axios';
import { useResponsive } from 'src/hooks';
import RoundedButton from 'src/components/common/RoundedButton';

export default function TicketItem({ ticket }: any) {
  const isXs = useResponsive('down', 'sm');
  const isMobile = useResponsive('down', 'md');
  const [maticPrice, setMaticPrice] = useState(0);
  const [klayPrice, setKlayPrice] = useState(0);
  const [ticketInfo, setTicketInfo] = useState({
    // company: '',
    // companyImage: null,
    createdAt: null,
    itemTitle: '',
    itemImage: '',
    price: 0,
    location: '',
    ticketNumber: '',
    boxContractAddress: '',
    no: '',
    tokenId: null,
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
        ticket.mysteryboxItem.properties &&
        ticket.mysteryboxItem.properties.find((item: any) =>
          item.type.toLowerCase() === 'location' ? item : ''
        );
      console.log('first', ticket);
      setTicketInfo({
        // company: ticket.companyname.en,
        // companyImage: ticket.companyimage,
        createdAt: ticket.createdAt,
        itemTitle: ticket.mysteryboxItem.name,
        itemImage: ticket.mysteryboxItem.itemImage,
        price: ticket.mysteryboxItem.price,
        location: location?.name ? location.name : '',
        ticketNumber: '1',
        boxContractAddress: ticket.mysteryboxInfo.boxContractAddress,
        no: ticket.no,
        tokenId: ticket.tokenId,
      });
    }
  }, [ticket]);

  return (
    <Grid
      item
      component={m.div}
      whileHover="hover"
      variants={varHover(1)}
      transition={varTranHover()}
      xs={12}
    >
      <Stack
        component={'div'}
        sx={{
          borderRadius: '40px',
          overflow: 'hidden',
          position: 'relative',
          height: 1,
          padding: '1.5rem',
        }}
        alignContent="center"
        justifyContent={'space-between'}
        // 반응형
        direction={isMobile ? 'column' : 'row'}
      >
        <Box sx={{ width: { md: 'calc(50% + 3rem)' }, mr: { xs: 0, md: '3rem' } }}>
          <Image
            src={ticketInfo.itemImage}
            alt={ticketInfo.itemTitle}
            ratio={isXs ? '16/9' : isMobile ? '21/9' : '16/9'}
            sx={{ borderRadius: 2 }}
          />
        </Box>

        <Stack
          spacing={1}
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: '1rem',
            bgcolor: 'rgba(0,0,0,.3)',
            px: isMobile ? 1 : 3,
            py: isMobile ? 2 : 2,
            borderRadius: '40px',
          }}
        >
          <Stack
            spacing={1}
            direction="column"
            justifyContent="flex-end"
            alignItems="flex-start"
            sx={{ typography: 'caption', m: 3, height: '100%' }}
          >
            <TextMaxLine variant="body2">{'#123'}</TextMaxLine>

            <TextMaxLine variant="h3">{ticketInfo.itemTitle}</TextMaxLine>
            <TextMaxLine variant="body2">{'November 11 - 13, 2022'}</TextMaxLine>
            <TextMaxLine variant="body2">{ticketInfo.boxContractAddress}</TextMaxLine>
          </Stack>
        </Stack>
        <Stack
          justifyContent="space-between"
          sx={{
            overflow: 'hidden',
            mt: isMobile ? -2 : 0,
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            flexGrow: 1,

            position: 'relative',
            px: isMobile ? 1 : 3,
            py: isMobile ? 2 : 4,
            zIndex: 1000,
            right: 0,
          }}
        >
          <Stack sx={{ height: 1 }}>
            <LineItem label="Reserve Price" value={`Friday (November 11, 2022)`} />
            <LineItem label="Team" value={`Team Yellow`} />
            <LineItem label="QTY" value={1} />

            <Box sx={{ flexGrow: 1 }} />

            <Stack sx={{ mt: isMobile ? 2 : 4 }} direction="row" spacing={2}>
              <RoundedButton variant="withImage" size={isMobile ? 'small' : 'large'} fullWidth>
                TO ENTER
              </RoundedButton>
              <RoundedButton
                variant="withImage"
                size={isMobile ? 'small' : 'large'}
                fullWidth
                disabled
              >
                SELL
              </RoundedButton>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Grid>
  );
}

type LineItemProps = {
  icon?: ReactElement;
  label: string;
  value: any;
};

function LineItem({ label, value }: LineItemProps) {
  const isMobile = useResponsive('down', 'md');
  return (
    <Stack direction={'column'}>
      <Typography
        sx={{
          fontSize: isMobile ? '12px' : '14px',
          marginRight: isMobile ? '10px' : '0px',
          color: 'rgba(255, 255, 255, 0.6)',
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="subtitle2"
        sx={{
          color: 'common.white',
          fontSize: isMobile ? '12px' : '16px',
          fontWeight: 'bold',
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}
