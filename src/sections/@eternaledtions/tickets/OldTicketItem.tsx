// @mui
import { Box, Button, Grid, Stack, Typography, useTheme } from '@mui/material';
import { m } from 'framer-motion';
import { Image, TextIconLabel, TextMaxLine, varHover, varTranHover } from 'src/components';
import React, { ReactElement, useState } from 'react';
import { fDate } from '../../../utils/formatTime';
import QRCode from 'react-qr-code';
import HyperlinkButton from 'src/components/ticket/HyperlinkButton';
import Badge from 'src/components/ticket/Badge';
import RoundedButton from 'src/components/common/RoundedButton';
import Link from 'next/link';
import ModalCustom from 'src/components/common/ModalCustom';
import SaveTicketContent from 'src/sections/@eternaledtions/tickets/SaveTicketContent';
import { useResponsive } from 'src/hooks';
import SaveOldTicketContent from 'src/sections/@eternaledtions/tickets/SaveOldTicketContent';

// ----------------------------------------------------------------------

type Props = {
  ticket?: {
    id: number;
    name: string;
    thumbnail: string;
    qrcode: string;
    createdAt: Date;
    updatedAt: Date;
    status: string;
    code: string;
    location: string;
    team: string;
    day: string;
  };
};

export default function OldTicketItem({ ticket }: Props) {
  const theme = useTheme();
  console.log(ticket);
  const [open, setOpen] = useState<boolean>(false);
  const isXs = useResponsive('down', 'sm');
  const isMobile = useResponsive('down', 'md');
  const checkTicketId = (id: number) => {
    if (id >= 5758 && id <= 7787) return '2023';
    else return '2022';
  };

  return (
    <>
      {ticket ? (
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
                  src={ticket.thumbnail}
                  alt={ticket.name}
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
                <TextMaxLine variant="body2" sx={{ color: 'red' }}>{`#1`}</TextMaxLine>

                <TextMaxLine variant="h3">{ticket.name}</TextMaxLine>
                <TextMaxLine variant="body2" sx={{ color: 'red' }}>
                  {'November 11 - 13, 2022'}
                </TextMaxLine>
                <TextMaxLine variant="body2" sx={{ color: 'red' }}>
                  {ticket.location}
                </TextMaxLine>
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
                  <LineItem
                    label="Day"
                    mock
                    value={fDate(new Date(ticket.day), 'EEEE (MMMM dd, yyyy)')}
                  />
                  <LineItem label="Team" mock value={'red'} />
                  {ticket.status.toUpperCase() !== 'MARKET' && <LineItem label="QTY" value={'1'} />}
                  {ticket.status === 'MARKET' && (
                    <>
                      <LineItem mock label="CURRENT PRICE" value={'1,200 EDCP (~$1,200)'} />
                      <LineItem mock label="AUCTION ENDS IN" value={'01:12:32:11'} />
                    </>
                  )}
                </Stack>
                {ticket.status.toUpperCase() === 'TICKET' && (
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
                {ticket.status.toUpperCase() === 'MARKET' && <Badge label="For sale" />}
              </Stack>
              <Box sx={{ flexGrow: 1 }} />
              {ticket.status.toUpperCase() === 'TICKET' && (
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
                      pathname: `/my/tickets/${ticket.id}/`,
                      // query: {
                      //   // ticketInfo: JSON.stringify(ticketInfo),
                      //   event: ticketInfo.mysteryboxInfo.id,
                      //   ticket: ticketInfo.mysteryboxItem.id,
                      // },
                    }}
                    passHref
                  >
                    <RoundedButton variant="default" size={isMobile ? 'small' : 'large'} fullWidth>
                      SELL
                    </RoundedButton>
                  </Link>
                </Stack>
              )}
              {ticket.status.toUpperCase() === 'MARKET' && (
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
            <SaveOldTicketContent ticketInfo={ticket} onClose={() => setOpen(false)} />
          </ModalCustom>
        </Grid>
      ) : null}
    </>
  );
}

type LineItemProps = {
  label: string;
  value: any;
  mock?: boolean;
};

function LineItem({ label, value, mock }: LineItemProps) {
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
