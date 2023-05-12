import { Box, Divider, FormControl, Input, inputClasses, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { TicketInfoTypes } from 'src/@types/ticket/ticketTypes';
import RoundedButton from 'src/components/common/RoundedButton';
import { Label, Section, Value } from 'src/components/my-tickets/StyledComponents';
import { useResponsive } from 'src/hooks';
// theme
import palette from 'src/theme/palette';

interface Props {
  ticketInfo: TicketInfoTypes;
  onClose: () => void;
}

export default function SaveTicketContent({ ticketInfo, onClose }: Props) {
  const isMobile = useResponsive('down', 'md');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const saveTicket = () => setIsSaved(true);
  const transfer = () => onClose();

  return (
    <Box>
      <Box sx={{ textAlign: 'center' }}>
        <QRCode
          style={{}}
          value={`https://entrace2023.eternaleditions.io/entrace-confirm?contractAddress=${ticketInfo.boxContractAddress}&tokenId=${ticketInfo.tokenId}`}
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
            Kansas City, KS Silver Editio
          </Typography>

          <Stack>
            <Typography variant="body2"> {ticketInfo.duration}</Typography>
            <Typography variant="body2"> {ticketInfo.boxContractAddress}</Typography>
          </Stack>
        </Stack>
        <Divider />
        <Section>
          <Stack direction="row" justifyContent="space-between">
            <Label sx={{ color: palette.dark.black.darker }}>DAY</Label>
            <Value sx={{ color: palette.dark.black.main }}> Saturday </Value>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Label sx={{ color: palette.dark.black.darker }}>TEAM</Label>
            <Label sx={{ color: palette.dark.black.main }}> Team Yellow </Label>
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
