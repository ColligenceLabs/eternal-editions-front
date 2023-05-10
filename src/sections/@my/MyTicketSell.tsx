import { Box, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import { EEAvatar } from 'src/components';
import TicketSellForm from 'src/components/my-tickets/TicketSellForm';

export default function MyTicketSell() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: 'rgba(0, 0, 0, 0.24)',
        backdropFilter: 'blur(50px)',
        borderRadius: '40px',
        width: 'min(100%, 400px)',
        height: '100%',
        paddingTop: 3,
        paddingBottom: 3,
        marginLeft: 'auto',
      }}
    >
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
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          sx={{
            opacity: 0.72,
            typography: 'caption',
            [theme.breakpoints.down('md')]: {
              marginBottom: -1,
            },
          }}
        >
          <EEAvatar
            account={'0x8B7B2b4F7A391b6f14A81221AE0920a9735B67Fc'}
            image={'url(/assets/static/avatars/1.jpg)'}
            nickname={'by @iloveseoul'}
            sx={{ mr: 0, width: 24, height: 24 }}
          />
          <Typography fontSize={14} lineHeight={20 / 14}>
            by @iloveseoul
          </Typography>
        </Stack>
        <Typography
          sx={{
            fontWeight: 'bold',
            fontSize: 24,
            lineHeight: 28 / 24,
            [theme.breakpoints.up('md')]: {
              fontSize: 40,
              lineHeight: 44 / 40,
            },
          }}
        >
          DCENTRAL Miami 2023 VIP
        </Typography>

        <TicketSellForm />
      </Stack>
    </Box>
  );
}
