import { Box, Stack, Grid, Typography, useTheme, Chip, IconButton } from '@mui/material';
import { m } from 'framer-motion';
import { Image, TextMaxLine, varHover, varTranHover } from 'src/components';
import React, { ReactElement, useEffect, useState } from 'react';
import { useResponsive } from 'src/hooks';
import RoundedButton from 'src/components/common/RoundedButton';
import Badge from 'src/components/ticket/Badge';
import ModalCustom from 'src/components/common/ModalCustom';
import Link from 'next/link';
import SaveTicketContent from './SaveTicketContent';
import { MyTicketTypes } from 'src/@types/my/myTicket';
import useCountdown from 'src/hooks/useCountdown';
import { fDate } from 'src/utils/formatTime';
import TransferItem from 'src/components/user/TransferItem';
import CSnackbar from 'src/components/common/CSnackbar';

type PropertiesType = {
  type: string;
  name: string;
};
export default function TicketItem({ ticket }: any) {
  const theme = useTheme();
  const isXs = useResponsive('down', 'sm');
  const isMobile = useResponsive('down', 'md');
  const [open, setOpen] = useState<boolean>(false);
  const [openTransferItem, setOpenTransferItem] = useState<boolean>(false);
  const [ticketInfo, setTicketInfo] = useState<MyTicketTypes | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    type: '',
    message: '',
  });
  const { days, hours, minutes, seconds } = useCountdown(
    new Date(ticket.sellbook?.endDate ? ticket.sellbook?.endDate : null),
    ticket?.status
  );

  const handleCloseSnackbar = () => {
    setOpenSnackbar({
      open: false,
      type: '',
      message: '',
    });
  };

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
              <Stack
                sx={{
                  pt: 1,
                  height: 1,
                  zIndex: 9,
                  left: 25,
                  position: 'absolute',
                }}
              >
                {ticket.mysteryboxInfo?.projectItems &&
                  ticket.mysteryboxInfo?.projectItems[0].title && (
                    <Chip
                      label={ticket.mysteryboxInfo.projectItems[0].title}
                      variant="outlined"
                      color="primary"
                      sx={{
                        fontWeight: theme.typography.fontWeightBold,
                      }}
                    />
                  )}
              </Stack>
              <Stack
                sx={{
                  pt: 1,
                  height: 1,
                  zIndex: 9,
                  right: 25,
                  position: 'absolute',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 1,
                }}
              >
                {ticketInfo.mysteryboxInfo.categoriesStr &&
                ticketInfo.mysteryboxInfo.categoriesStr.split(',').length > 0
                  ? ticketInfo.mysteryboxInfo.categoriesStr
                      .split(',')
                      .map((category: string, index: number) => (
                        <Chip
                          key={index}
                          label={category.toUpperCase()}
                          variant="outlined"
                          sx={{
                            fontWeight: theme.typography.fontWeightBold,
                            color: theme.palette.common.white,
                          }}
                        />
                      ))
                  : null}
              </Stack>
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
                  height: '100%',
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  px: isMobile ? 2 : 3,
                  py: isMobile ? 2 : 3,
                }}
              >
                <TextMaxLine variant="body2">{ticketInfo.mysteryboxInfo?.title?.en}</TextMaxLine>
                <TextMaxLine variant="h3">{ticketInfo.mysteryboxItem.name}</TextMaxLine>
              </Stack>
            </Box>

            <Stack
              sx={{
                flex: 1,
                mt: isMobile ? 2 : 0,
                px: isMobile ? 1 : 2,
                zIndex: 1000,
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              <Stack flexDirection="row" justifyContent="space-between">
                <Stack gap="12px">
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
                  {ticketInfo.status === 'USED' && (
                    <LineItem
                      label="DATE OF USE"
                      value={fDate(
                        ticketInfo.useDate ? ticketInfo.useDate : new Date(),
                        'EEEE (MMMM dd, yyyy)'
                      )}
                    />
                  )}
                </Stack>
                {ticketInfo.status === 'MARKET' && <Badge label="For sale" />}
                {ticketInfo.status === 'USED' && <Badge label="Used Up" disabled={true} />}
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
                  <IconButton
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#222222',
                      width: '56px',
                      height: '56px',
                      fontSize: 0,
                      [theme.breakpoints.down('md')]: {
                        display: 'none',
                      },
                    }}
                    onClick={() => setOpenTransferItem(true)}
                  >
                    <Image
                      src="/assets/icons/icon-gift.svg"
                      alt="gift-icon"
                      width={24}
                      height={24}
                    />
                  </IconButton>
                </Stack>
              )}

              {ticketInfo.status === 'MARKET' && (
                <Stack sx={{ mt: 1 }} direction="row" spacing={2}>
                  <Link
                    href={{
                      pathname: `/my/tickets/${ticketInfo.id}/`,
                    }}
                    passHref
                  >
                    <RoundedButton
                      variant="withImage"
                      size={isMobile ? 'small' : 'large'}
                      fullWidth
                    >
                      SALE INFO
                    </RoundedButton>
                  </Link>
                </Stack>
              )}
            </Stack>
          </Stack>
          <ModalCustom open={open} onClose={() => setOpen(false)}>
            <SaveTicketContent ticketInfo={ticketInfo} onClose={() => setOpen(false)} />
          </ModalCustom>
          <ModalCustom open={openTransferItem} onClose={() => setOpenTransferItem(false)}>
            <TransferItem
              item={ticketInfo}
              onClose={() => setOpenTransferItem(false)}
              setOpenSnackbar={setOpenSnackbar}
            />
          </ModalCustom>
        </Grid>
      ) : null}
      <CSnackbar
        open={openSnackbar.open}
        type={openSnackbar.type}
        message={openSnackbar.message}
        handleClose={handleCloseSnackbar}
      />
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
