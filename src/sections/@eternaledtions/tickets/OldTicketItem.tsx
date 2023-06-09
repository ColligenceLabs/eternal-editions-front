// @mui
import { Box, Button, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { m } from 'framer-motion';
import { Image, TextIconLabel, TextMaxLine, varHover, varTranHover } from 'src/components';
import React, { ReactElement, useEffect, useState } from 'react';
import { fDate } from '../../../utils/formatTime';
import QRCode from 'react-qr-code';
import DialogAnimate from '../../../components/animate/DialogAnimate';

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
  };
};

export default function OldTicketItem({ ticket }: Props) {
  const [qrOpen, setQrOpen] = useState(false);
  const [qrTimestamp, setQrTimestamp] = useState(0);
  console.log(ticket);
  const checkTicketId = (id: number) => {
    if (id >= 5758 && id <= 7787) return '2023';
    else return '2022';
  };

  useEffect(() => {
    console.log(qrOpen);
    if (qrOpen) {
      console.log('start timestmap');
      const now = new Date();
      setQrTimestamp(now.setMinutes(now.getMinutes() + 5));
    } else {
      console.log('reset timestamp');
      setQrTimestamp(0);
    }
  }, [qrOpen]);

  useEffect(() => {
    console.log(new Date(qrTimestamp));
  }, [qrTimestamp]);

  return ticket ? (
    <Stack
      component={m.div}
      whileHover="hover"
      variants={varHover(1)}
      transition={varTranHover()}
      sx={{ borderRadius: 2, overflow: 'hidden', position: 'relative' }}
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
          <LineItem icon={<></>} label="Reserve Price" value={'-'} />
          {/* <LineItem icon={<></>} label="Location" value={'-'} /> */}
          <LineItem icon={<></>} label="Number of tickets" value={1} />
          <LineItem
            icon={<></>}
            label="Used"
            value={ticket.status.toLowerCase() === 'used' ? 'Used' : '-'}
          />

          <Stack sx={{ mt: 3 }} justifyContent="center" alignItems="center">
            {/*<img src={'/assets/example/qr.png'} style={{ maxWidth: '120px' }} />*/}
            <QRCode value={ticket.qrcode} size={120} />
          </Stack>

          <Stack sx={{ mt: 4 }}>
            <Button
              size="large"
              variant="contained"
              fullWidth={true}
              onClick={() => setQrOpen(true)}
            >
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
          <TextMaxLine variant="h3" sx={{ width: '100%' }}>
            {checkTicketId(ticket.id)} {ticket.name.replaceAll('"', '')}
          </TextMaxLine>
          <Typography
            variant="body1"
            sx={{
              mb: 1,
              mt: { xs: 1, sm: 0.5 },
              color: 'common.white',
            }}
          >
            {ticket.createdAt && fDate(ticket.createdAt)}
          </Typography>
        </Stack>

        <Image src={ticket.thumbnail} alt={ticket.name} ratio="6/4" />
      </Box>
      {qrOpen && (
        <DialogAnimate
          fullWidth
          maxWidth="xs"
          open={qrOpen}
          onClose={() => setQrOpen(false)}
          sx={{ bgcolor: '#fff' }}
        >
          <DialogTitle>QR Code</DialogTitle>
          <DialogContent sx={{ textAlign: 'center' }}>
            <QRCode
              // value={`https://entrace2023.eternaleditions.io/entrace-confirm?contractAddress=${ticketInfo.boxContractAddress}&tokenId=${ticketInfo.tokenId}`}
              value={`https://entrance.eternaleditions.io/admin-e-ticket?type={2}&code=${ticket.code}&expireTime=${qrTimestamp}`}
              // size={isMobile ? 50 : 120}
            />
            <Typography
              sx={{ color: '#000', fontSize: '12px' }}
            >{`https://entrance.eternaleditions.io/admin-e-ticket?type={2}&code=${ticket.code}&expireTime=${qrTimestamp}`}</Typography>
          </DialogContent>
        </DialogAnimate>
      )}
    </Stack>
  ) : null;
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
