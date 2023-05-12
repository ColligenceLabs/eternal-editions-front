import { Box, Stack, useTheme } from '@mui/material';
import React from 'react';
import TicketSellForm from 'src/components/my-tickets/TicketSellForm';
import Badge from 'src/components/ticket/Badge';
import { CardWrapper } from 'src/components/ticket/CardWrapper';
import CompanyInfo from 'src/components/ticket/CompanyInfo';
import { TicketName } from 'src/components/ticket/TicketName';

export default function MyTicketSell() {
  const theme = useTheme();

  return (
    <Box sx={{ height: '100%', [theme.breakpoints.down('md')]: { pt: '480px', height: 'auto' } }}>
      <CardWrapper>
        <Stack
          gap={3}
          sx={{
            height: '100%',
            paddingLeft: 3,
            paddingRight: 3,
            overflowY: 'auto',
            [`&::-webkit-scrollbar`]: {
              width: '7px',
              borderRadius: '40px',
            },
            [`&:hover::-webkit-scrollbar-thumb`]: {
              background: 'rgba(0, 0, 0, 0.12)',
              borderRadius: '40px',
            },
          }}
        >
          <Stack flexDirection="row" justifyContent="space-between">
            <CompanyInfo
              account={'0x8B7B2b4F7A391b6f14A81221AE0920a9735B67Fc'}
              image={'url(/assets/static/avatars/1.jpg)'}
              name={'by @iloveseoul'}
            />

            <Badge label={'For sale'} />
          </Stack>
          <TicketName>DCENTRAL Miami 2023 VIP</TicketName>
          <TicketSellForm />
        </Stack>
      </CardWrapper>
    </Box>
  );
}
