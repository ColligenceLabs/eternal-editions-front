import { Box, Divider, FormControl, Input, inputClasses, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { TicketInfoTypes } from 'src/@types/ticket/ticketTypes';
import RoundedButton from 'src/components/common/RoundedButton';
import { Label, Section, Value } from 'src/components/my-tickets/StyledComponents';
import { useResponsive } from 'src/hooks';
import palette from 'src/theme/palette';
import { MyTicketTypes } from 'src/@types/my/myTicket';

interface Props {
  ticketInfo: MyTicketTypes;
  onClose: () => void;
}

export default function SaveTicketContent({ ticketInfo, onClose }: Props) {
  const isMobile = useResponsive('down', 'md');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [qrTimestamp, setQrTimestamp] = useState(0);
  const saveTicket = () => setIsSaved(true);
  const transfer = () => onClose();

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
          value={`https://entrance.eternaleditions.io/admin-e-ticket?type=2&tokenId=${ticketInfo.tokenId}&nftid=${ticketInfo.mysteryBoxId}&expireTime=${qrTimestamp}`}
          size={160}
        />
      </Box>
      <Typography
        sx={{ fontSize: '12px' }}
      >{`https://entrance.eternaleditions.io/admin-e-ticket?type=2&tokenId=${ticketInfo.tokenId}&nftid=${ticketInfo.mysteryBoxId}&expireTime=${qrTimestamp}`}</Typography>
      <Stack gap="12px" mt="48px" mb="24px">
        <Stack gap={0.5}>
          <Typography
            sx={{
              fontSize: 24,
              lineHeight: 28 / 24,
            }}
          >
            {ticketInfo.location}
          </Typography>

          <Stack>
            <Typography variant="body2">{ticketInfo.duration}</Typography>
            <Typography variant="body2">{ticketInfo.mysteryboxInfo.boxContractAddress}</Typography>
          </Stack>
        </Stack>
        <Divider />
        <Section>
          <Stack direction="row" justifyContent="space-between">
            <Label sx={{ color: palette.dark.black.darker }}>DAY</Label>
            <Value sx={{ color: palette.dark.black.main }}> {ticketInfo.day} </Value>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Label sx={{ color: palette.dark.black.darker }}>TEAM</Label>
            <Label sx={{ color: palette.dark.black.main }}> {`Team ${ticketInfo.team}`} </Label>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Label sx={{ color: palette.dark.black.darker }}>QTY</Label>
            <Value sx={{ color: 'red' }}> 1 </Value>
          </Stack>
        </Section>
        <Divider />
        <Typography variant="caption" sx={{ color: palette.dark.black.lighter }}>
          Please show the QR image to the ticket entrance manager.
        </Typography>
      </Stack>

      {isSaved && (
        <>
          <FormControl variant="standard" fullWidth>
            <Label sx={{ color: palette.dark.black.darker, mb: '12px' }}>PAYMENT AMOUNT</Label>
            <Input
              placeholder="e.g. 1234..."
              inputProps={{
                style: {
                  color: 'black',
                },
              }}
              sx={{
                fontSize: 14,
                lineHeight: 20 / 14,
                [`.${inputClasses.input}::placeholder`]: {
                  color: '#BBBBBB',
                },
              }}
            />
          </FormControl>
          <Typography variant="body2" sx={{ textAlign: 'center', paddingY: 3 }}>
            Kansas City, KS Silver Editio will be transferred to...
          </Typography>
        </>
      )}

      <RoundedButton
        variant="default"
        size={isMobile ? 'small' : 'large'}
        fullWidth
        onClick={isSaved ? transfer : saveTicket}
      >
        {isSaved ? 'Transfer' : 'Save the ticket'}
      </RoundedButton>
    </Box>
  );
}
