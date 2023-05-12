import { Box, FormControl, Input, InputLabel, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { log } from 'console';
import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import RoundedButton from 'src/components/common/RoundedButton';
import { useResponsive } from 'src/hooks';
// theme
import palette from 'src/theme/palette';

export default function SaveTicketContent({ ticketInfo }: any) {
  const isMobile = useResponsive('down', 'md');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const saveTicket = () => setIsSaved(true);
  const transfer = () => console.log('transfer');
  return (
    <Box>
      <Box sx={{ textAlign: 'center' }}>
        <QRCode
          style={{}}
          value={`https://entrace2023.eternaleditions.io/entrace-confirm?contractAddress=${ticketInfo.boxContractAddress}&tokenId=${ticketInfo.tokenId}`}
          size={160}
        />
      </Box>
      <Typography variant="h3"> Kansas City, KS Silver Editio</Typography>
      <Typography variant="body2"> {ticketInfo.duration}</Typography>
      <Typography variant="body2"> {ticketInfo.boxContractAddress}</Typography>
      <Box
        sx={{
          borderTop: `1px solid rgba(0, 0, 0, 0.04)`,
          borderBottom: `1px solid rgba(0, 0, 0, 0.04)`,
          paddingY: 1,
          marginY: 1,
        }}
      >
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Typography variant="body1" sx={{ color: palette.dark.black.lighter }}>
            DAY
          </Typography>
          <Typography variant="body1"> Saturday </Typography>
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Typography variant="body1" sx={{ color: palette.dark.black.lighter }}>
            TEAM
          </Typography>
          <Typography variant="body1"> Team Yellow </Typography>
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Typography variant="body1" sx={{ color: palette.dark.black.lighter }}>
            QTY
          </Typography>
          <Typography variant="body1"> 1 </Typography>
        </Stack>
      </Box>
      <Typography variant="caption" sx={{ color: palette.dark.black.lighter }}>
        Please show the QR image to the ticket entrance manager.
      </Typography>
      {isSaved && (
        <>
          <FormControl variant="standard" fullWidth>
            <InputLabel>PAYMENT AMOUNT</InputLabel>
            <Input readOnly inputProps={{ style: { color: 'black' } }} />
          </FormControl>
          <Typography variant="body2" sx={{ textAlign: 'center', paddingY: 2 }}>
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
