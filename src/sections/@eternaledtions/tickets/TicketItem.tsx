import { Box, Stack, Grid, Typography, useTheme } from '@mui/material';
import { m } from 'framer-motion';
import { Image, TextMaxLine, varHover, varTranHover } from 'src/components';
import React, { ReactElement, useEffect, useState } from 'react';
import axios from 'axios';
import { useResponsive } from 'src/hooks';
import RoundedButton from 'src/components/common/RoundedButton';
import HyperlinkButton from 'src/components/ticket/HyperlinkButton';
import Badge from 'src/components/ticket/Badge';
import ModalCustom from 'src/components/common/ModalCustom';
import Link from 'next/link';
import SaveTicketContent from './SaveTicketContent';
import { MyTicketTypes } from 'src/@types/my/myTicket';
import useCountdown from 'src/hooks/useCountdown';

type PropertiesType = {
  type: string;
  name: string;
};
export default function TicketItem({ ticket }: any) {
  const theme = useTheme();
  const isXs = useResponsive('down', 'sm');
  const isMobile = useResponsive('down', 'md');
  const [maticPrice, setMaticPrice] = useState(0);
  const [klayPrice, setKlayPrice] = useState(0);
  const [open, setOpen] = useState<boolean>(false);
  const [ticketInfo, setTicketInfo] = useState<MyTicketTypes | null>(null);
  const { days, hours, minutes, seconds } = useCountdown(
    new Date(ticket.sellbook?.endDate ? ticket.sellbook?.endDate : null)
  );
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
      const { properties } = ticket.mysteryboxItem;
      let day = '';
      let location = '';
      let duration = '';
      let team = '';
      if (properties) {
        properties.map((property: PropertiesType) =>
          property.type === 'team'
            ? (team = property.name)
            : property.type === 'day'
            ? (day = property.name)
            : property.type === 'duration'
            ? (duration = property.name)
            : property.type === 'location'
            ? (location = property.name)
            : null
        );
      }
      setTicketInfo({
        ...ticket,
        day,
        team,
        duration,
        location,
      });
    }
  }, [ticket]);

  return (
    <>
      {ticketInfo ? (
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
            alignItems={isMobile ? 'initial' : 'flex-start'}
            justifyContent={'space-between'}
            // 반응형
            direction={isMobile ? 'column' : 'row'}
          >
            <Box sx={{ position: 'relative', flex: 1 }}>
              <Box sx={{ width: { md: 'calc(100%)' }, mr: { xs: 0, md: '3rem' } }}>
                <Image
                  src={ticketInfo.mysteryboxItem.itemImage}
                  alt={ticketInfo.mysteryboxItem.name}
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
                <TextMaxLine variant="body2">{`#${ticketInfo.tokenId}`}</TextMaxLine>
                <TextMaxLine variant="h3">{ticketInfo.mysteryboxItem.name}</TextMaxLine>
                <TextMaxLine variant="body2">{ticketInfo.duration}</TextMaxLine>
                <TextMaxLine variant="body2">{ticketInfo.location}</TextMaxLine>
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
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              <Stack flexDirection="row" justifyContent="space-between">
                <Stack gap="12px">
                  <LineItem label="Day" value={ticketInfo.day} />
                  <LineItem label="Team" value={ticketInfo.team} />
                  {ticketInfo.status !== 'MARKET' && <LineItem label="QTY" value={'1'} />}
                  {ticketInfo.status === 'MARKET' && ticketInfo.sellbook && (
                    <>
                      <LineItem
                        label="CURRENT PRICE"
                        value={
                          ticketInfo.usePoint
                            ? `${ticketInfo.sellbook?.price} EDCP (~$${
                                ticketInfo.sellbook?.price / 10
                              })`
                            : `${ticketInfo.sellbook?.price} USDC (~$${ticketInfo.sellbook?.price})`
                        }
                      />
                      <LineItem
                        label="AUCTION ENDS IN"
                        value={`${days}:${hours}:${minutes}:${seconds}`}
                      />
                    </>
                  )}
                </Stack>
                {ticketInfo.status === 'TICKET' && (
                  <HyperlinkButton
                    href={''}
                    styles={{
                      backgroundColor: '#222222',
                      [theme.breakpoints.down('md')]: {
                        position: 'absolute',
                        top: '36px',
                        right: '36px',
                      },
                    }}
                  />
                )}
                {ticketInfo.status === 'MARKET' && <Badge label="For sale" />}
              </Stack>
              <Box sx={{ flexGrow: 1 }} />
              {ticketInfo.status === 'TICKET' && (
                <Stack
                  sx={{ mt: isMobile ? '24px' : 0 }}
                  direction={isMobile ? 'column' : 'row'}
                  spacing={isMobile ? '2px' : '10px'}
                >
                  <RoundedButton
                    variant="withImage"
                    size={isMobile ? 'small' : 'large'}
                    fullWidth
                    onClick={() => setOpen(true)}
                  >
                    TO ENTER
                  </RoundedButton>
                  <Link
                    href={{
                      pathname: `/my/tickets/${ticketInfo.id}/`,
                    }}
                    passHref
                  >
                    <RoundedButton variant="default" size={isMobile ? 'small' : 'large'} fullWidth>
                      SELL
                    </RoundedButton>
                  </Link>
                </Stack>
              )}
              {ticketInfo.status === 'MARKET' && (
                <Stack sx={{ mt: 1 }} direction="row" spacing={2} justifyContent={'flex-end'}>
                  <RoundedButton
                    sx={{ flexBasis: '50%' }}
                    variant="withImage"
                    size={isMobile ? 'small' : 'large'}
                    fullWidth
                  >
                    SALE INFO
                  </RoundedButton>
                </Stack>
              )}
            </Stack>
          </Stack>
          <ModalCustom open={open} onClose={() => setOpen(false)}>
            <SaveTicketContent ticketInfo={ticketInfo} onClose={() => setOpen(false)} />
          </ModalCustom>
        </Grid>
      ) : null}
    </>
  );
}

type LineItemProps = {
  icon?: ReactElement;
  label: string;
  value: any;
  mock?: boolean;
};

function LineItem({ mock, label, value }: LineItemProps) {
  const isMobile = useResponsive('down', 'md');
  return (
    <Stack direction={'column'} gap="2px">
      <Typography
        sx={{
          fontSize: '12px',
          marginRight: isMobile ? '10px' : '0px',
          color: 'rgba(255, 255, 255, 0.6)',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          color: mock ? 'red' : 'common.white',
          fontSize: isMobile ? '12px' : '14px',
          lineHeight: 20 / 14,
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}
