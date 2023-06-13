import { Box, Divider, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { Label, Section, Value } from 'src/components/my-tickets/StyledComponents';
import { useResponsive } from 'src/hooks';
import palette from 'src/theme/palette';
import { fDate } from 'src/utils/formatTime';

type OldTicketTypes = {
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

interface Props {
  ticketInfo: OldTicketTypes;
  onClose: () => void;
}

export default function SaveOldTicketContent({ ticketInfo, onClose }: Props) {
  const [qrTimestamp, setQrTimestamp] = useState(0);

  useEffect(() => {
    const now = new Date();
    setQrTimestamp(now.setMinutes(now.getMinutes() + 5));
  }, []);

  return (
    <Box
      sx={{
        pt: {
          xs: '48px',
          md: '24px',
        },
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <QRCode
          style={{}}
          value={`https://entrance.eternaleditions.io/admin-e-ticket?type=1&code=${ticketInfo.ticketInfo.code}&expireTime=${qrTimestamp}`}
          size={160}
        />
      </Box>
      <Stack gap="12px" mt="48px" mb="24px">
        <Stack gap={0.5}>
          <Typography
            sx={{
              fontSize: 24,
              lineHeight: 28 / 24,
            }}
          >
            {ticketInfo.ticketInfo.ticketName}
          </Typography>

          <Stack>
            <Typography variant="body2">{ticketInfo.ticketInfo.showName}</Typography>
            <Typography variant="body2">{ticketInfo.ticketInfo.location1}</Typography>
          </Stack>
        </Stack>
        <Divider />
        <Section>
          <Stack direction="row" justifyContent="space-between">
            <Label sx={{ color: palette.dark.black.darker }}>Time</Label>
            <Value sx={{ color: palette.dark.black.main }}>
              {ticketInfo.ticketInfo.showStartTime &&
                fDate(new Date(ticketInfo.ticketInfo.showStartTime), 'EEEE (MMMM dd, yyyy)')}
            </Value>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Label sx={{ color: palette.dark.black.darker }}>TEAM</Label>
            <Label sx={{ color: palette.dark.black.main }}> </Label>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Label sx={{ color: palette.dark.black.darker }}>QTY</Label>
            <Value sx={{ color: palette.dark.black.main }}> 1 </Value>
          </Stack>
        </Section>
        <Divider />
        <Typography variant="caption" sx={{ color: palette.dark.black.lighter }}>
          Please show the QR image to the ticket entrance manager.
        </Typography>
      </Stack>
    </Box>
  );
}
