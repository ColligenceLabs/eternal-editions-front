// @mui
import { Box, Button, Stack, Grid, Typography } from '@mui/material';
import { m } from 'framer-motion';
import {
  Image,
  TextIconLabel,
  TextMaxLine,
  varHover,
  varTranHover,
  EEAvatar,
} from 'src/components';
import React, { ReactElement, useEffect, useState } from 'react';
import { fDate } from 'src/utils/formatTime';
import axios from 'axios';
import QRCode from 'react-qr-code';
// import { isMobile } from 'react-device-detect';
import { useResponsive } from 'src/hooks';

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
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
          height: 1,
        }}
        alignContent="center"
        justifyContent={'space-between'}
        // 반응형
        direction={isMobile ? 'column' : 'row'}
      >
        <Box sx={{ width: { xs: '100%', md: 'calc(50% + 3rem)' }, mr: { xs: 0, md: '-3rem' } }}>
          <Image
            src={ticketInfo.itemImage}
            alt={ticketInfo.itemTitle}
            ratio={isXs ? '16/9' : isMobile ? '21/9' : '16/9'}
          />
        </Box>

        <Stack
          spacing={1}
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,.3)',
            px: isMobile ? 1 : 3,
            py: isMobile ? 2 : 2,
          }}
        >
          <Box sx={{ p: 1, width: '100%', pr: { md: 'calc(50% + 1rem)' } }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ opacity: 0.72, typography: 'caption', mb: 1 }}
            >
              <EEAvatar
                // account={'0x8B7B2b4F7A391b6f14A81221AE0920a9735B67Fc'}
                image={ticket.mysteryboxInfo?.featured?.image}
                nickname={ticket.mysteryboxInfo?.featured?.name.en || '-'}
                sx={{ mr: 0, width: 24, height: 24 }}
              />

              <Typography>{ticket.mysteryboxInfo?.featured?.name.en}</Typography>
            </Stack>
            <TextMaxLine variant="h3">{ticketInfo.itemTitle}</TextMaxLine>
          </Box>
          {/* <Typography
            variant="body1"
            sx={{
              mb: 1,
              mt: { xs: 1, sm: 0.5 },
              color: 'common.white',
            }}
          >
            {ticketInfo.createdAt && fDate(ticketInfo.createdAt)}
          </Typography> */}
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
            color: 'common.black',
            backgroundColor: 'common.white',
          }}
        >
          <Stack sx={{ height: 1 }}>
            <LineItem
              label="Reserve Price"
              value={`$${((ticketInfo?.price ?? 0) * maticPrice).toFixed(4)} (Ξ ${
                ticketInfo?.price
              })`}
            />
            {/* <LineItem label="Location" value={ticketInfo.location} /> */}
            <LineItem
              label="Used"
              value={ticket?.status?.toLowerCase() === 'used' ? 'Used' : '-'}
            />
            {/* <LineItem label="Number of tickets" value={ticketInfo.ticketNumber} /> */}

            {/* <img src={'/assets/example/qr.png'} style={{ maxWidth: '120px' }} /> */}
            {/* 팝업 변경 예정 */}
            {/* <Stack sx={{ mt: isMobile ? 2 : 3 }} justifyContent="center" alignItems="center">
              <QRCode
                value={`https://entrace2023.eternaleditions.io/entrace-confirm?contractAddress=${ticketInfo.boxContractAddress}&tokenId=${ticketInfo.tokenId}`}
                size={isMobile ? 50 : 120}
              />
            </Stack> */}
            <Box sx={{ flexGrow: 1 }} />

            <Stack sx={{ mt: isMobile ? 2 : 4 }}>
              <Button size={isMobile ? 'small' : 'large'} variant="vivid" fullWidth={true} disabled>
                TO ENTER
              </Button>
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

function LineItem({ icon, label, value }: LineItemProps) {
  const isXs = useResponsive('down', 'sm');
  const isMobile = useResponsive('down', 'md');
  return (
    <TextIconLabel
      icon={icon}
      value={
        <>
          <Typography
            sx={{ fontSize: isMobile ? '12px' : '14px', marginRight: isMobile ? '10px' : '0px' }}
          >
            {label}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              color: 'common.black',
              flexGrow: 1,
              textAlign: 'right',
              fontSize: isMobile ? '12px' : '16px',
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
