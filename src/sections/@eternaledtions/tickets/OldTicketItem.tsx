// @mui
import { Box, Button, Stack, Typography } from '@mui/material';
import { m } from 'framer-motion';
import { Image, TextIconLabel, TextMaxLine, varHover, varTranHover } from '../../../components';
import React, { ReactElement } from 'react';
import { fDate } from '../../../utils/formatTime';
import QRCode from 'react-qr-code';

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
  };
};

export default function OldTicketItem({ ticket }: Props) {
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
          <LineItem icon={<></>} label="Location" value={'-'} />
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
          {/*<Stack*/}
          {/*  direction="row"*/}
          {/*  spacing={1}*/}
          {/*  alignItems="center"*/}
          {/*  sx={{ opacity: 0.72, typography: 'caption' }}*/}
          {/*>*/}
          {/*  <EEAvatar src={ticketInfo.companyImage!} sx={{ mr: 0, width: 24, height: 24 }} />*/}

          {/*  <Typography>{ticketInfo.company}</Typography>*/}
          {/*</Stack>*/}

          <TextMaxLine variant="h3" sx={{ width: '100%' }}>
            {ticket.name.replaceAll('"', '')}
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
