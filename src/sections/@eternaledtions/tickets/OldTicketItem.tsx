import { Box, Grid, Stack, Typography, useTheme } from '@mui/material';
import { m } from 'framer-motion';
import { Image, TextMaxLine, varHover, varTranHover } from 'src/components';
import React, { useState } from 'react';
import RoundedButton from 'src/components/common/RoundedButton';
import ModalCustom from 'src/components/common/ModalCustom';
import { useResponsive } from 'src/hooks';
import SaveOldTicketContent from 'src/sections/@eternaledtions/tickets/SaveOldTicketContent';

// ----------------------------------------------------------------------

type Props = {
  ticket?: {
    id: number;
    qrcode: string;
    createdAt: Date;
    updatedAt: Date;
    status: string;
    ticketInfo: {
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
  };
};

export default function OldTicketItem({ ticket }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const isXs = useResponsive('down', 'sm');
  const isMobile = useResponsive('down', 'md');

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
            alignItems={isMobile ? 'initial' : 'end'}
            justifyContent={'space-between'}
            // 반응형
            direction={isMobile ? 'column' : 'row'}
          >
            <Box sx={{ position: 'relative', flex: 1 }}>
              <Box sx={{ width: { md: 'calc(100%)' }, mr: { xs: 0, md: '3rem' } }}>
                <Image
                  src={ticket.ticketInfo.image}
                  alt={ticket.ticketInfo.showName}
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
                <TextMaxLine variant="body2">{ticket.ticketInfo.showName}</TextMaxLine>
                <TextMaxLine variant="h3">{ticket.ticketInfo.ticketName}</TextMaxLine>
              </Stack>
            </Box>

            <Stack
              sx={{
                flex: 1,
                mt: isMobile ? 2 : 0,
                px: isMobile ? 1 : 2,
                zIndex: 1000,
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}
            >
              {ticket.status.toUpperCase() === 'TICKET' && (
                <Stack
                  sx={{
                    mt: isMobile ? '24px' : 0,
                    flexGrow: 1,
                  }}
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
