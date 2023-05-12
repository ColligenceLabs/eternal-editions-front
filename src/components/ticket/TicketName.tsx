import { styled, Typography } from '@mui/material';

export const TicketName = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: 24,
  lineHeight: 28 / 24,
  [theme.breakpoints.up('md')]: {
    fontSize: 40,
    lineHeight: 44 / 40,
  },
}));
