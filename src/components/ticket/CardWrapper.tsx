import { Box, styled } from '@mui/material';

export const CardWrapper = styled(Box)(({ theme }) => ({
  background: 'rgba(0, 0, 0, 0.24)',
  backdropFilter: 'blur(50px)',
  borderRadius: '40px',
  width: '100%',
  height: '100%',
  paddingTop: '24px',
  paddingBottom: '24px',
  [theme.breakpoints.up('md')]: {
    width: 'min(100%, 400px)',
    marginLeft: 'auto',
  },
}));
