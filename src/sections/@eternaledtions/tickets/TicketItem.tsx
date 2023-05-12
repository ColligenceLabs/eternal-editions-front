// @mui
import { Box, Stack, Grid, Typography } from '@mui/material';
import { m } from 'framer-motion';
import { Image, TextMaxLine, varHover, varTranHover } from 'src/components';
import React, { ReactElement, useEffect, useState } from 'react';
import axios from 'axios';
import { useResponsive } from 'src/hooks';
import RoundedButton from 'src/components/common/RoundedButton';
import HyperlinkButton from 'src/components/ticket/HyperlinkButton';
import Badge from 'src/components/ticket/Badge';

export default function TicketItem({ ticket }: any) {
  const isXs = useResponsive('down', 'sm');
  const isMobile = useResponsive('down', 'md');
  const [maticPrice, setMaticPrice] = useState(0);
  const [klayPrice, setKlayPrice] = useState(0);
  const [ticketInfo, setTicketInfo] = useState<any>({
    // company: '',
    // companyImage: null,
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
      setTicketInfo({
        // company: ticket.companyname.en,
        // companyImage: ticket.companyimage,
        ...ticket,
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
          bgcolor: 'rgba(0,0,0,.3)',
        }}
        alignContent="center"
        justifyContent={'space-between'}
        // 반응형
        direction={isMobile ? 'column' : 'row'}
      >
        <Box sx={{ position: 'relative', flex: 1 }}>
          <Box sx={{ width: { md: 'calc(100%)' }, mr: { xs: 0, md: '3rem' } }}>
            <Image
              src={ticketInfo.itemImage}
              alt={ticketInfo.itemTitle}
              ratio={isXs ? '3/4' : '16/9'}
              sx={{ borderRadius: 2, height: '100%' }}
            />
          </Box>

          <Stack
            spacing={1}
            direction="column"
            justifyContent="flex-end"
            alignItems="flex-start"
            sx={{
              typography: 'caption',
              // m: 3,
              height: '100%',
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              // bottom: 0,
              // backgroundColor: 'green',
              px: isMobile ? 2 : 3,
              py: isMobile ? 2 : 3,
            }}
          >
            <TextMaxLine variant="body2">{ticketInfo.no}</TextMaxLine>

            <TextMaxLine variant="h3">{ticketInfo.itemTitle}</TextMaxLine>
            <TextMaxLine variant="body2">{ticketInfo.duration}</TextMaxLine>
            <TextMaxLine variant="body2">{ticketInfo.boxContractAddress}</TextMaxLine>
          </Stack>
          {/* </Stack> */}
        </Box>

        <Stack
          sx={{
            flex: 1,
            // overflow: 'hidden',
            mt: isMobile ? 2 : 0,
            px: isMobile ? 1 : 2,
            zIndex: 1000,
          }}
        >
          <Stack flexDirection="row" justifyContent="space-between">
            <Stack gap="5px">
              <LineItem label="Day" value={ticketInfo.createAt} />
              <LineItem label="Team" value={ticketInfo.team} />
              <LineItem label="QTY" value={ticketInfo.qty} />
              {ticketInfo.status === 'for-sale' && <LineItem label="QTY" value={ticketInfo.qty} />}
            </Stack>
            {ticketInfo.status === 'selling' && (
              <HyperlinkButton href={''} styles={{ backgroundColor: '#222222' }} />
            )}
            {ticketInfo.status === 'for-sale' && <Badge label="For sale" />}
          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          {ticketInfo.status === 'selling' && (
            <Stack sx={{ mt: 1 }} direction={isMobile ? 'column' : 'row'} spacing={2}>
              <RoundedButton variant="withImage" size={isMobile ? 'small' : 'large'} fullWidth>
                TO ENTER
              </RoundedButton>
              <RoundedButton variant="default" size={isMobile ? 'small' : 'large'} fullWidth>
                SELL
              </RoundedButton>
            </Stack>
          )}
          {ticketInfo.status === 'for-sale' && (
            <Stack sx={{ mt: 1 }} direction="row" spacing={2} justifyContent={'flex-end'}>
              <RoundedButton variant="withImage" size={isMobile ? 'small' : 'large'} fullWidth>
                SALE INFO
              </RoundedButton>
            </Stack>
          )}
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
          fontSize: isMobile ? '12px' : '12px',
          marginRight: isMobile ? '10px' : '0px',
          color: 'rgba(255, 255, 255, 0.6)',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="subtitle2"
        sx={{
          color: 'common.white',
          fontSize: isMobile ? '12px' : '14px',
          fontWeight: 'bold',
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}
