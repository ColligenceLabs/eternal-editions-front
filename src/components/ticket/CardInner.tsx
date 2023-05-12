import { Stack, styled } from '@mui/material';

export const CardInner = styled(Stack)(({ theme }) => ({
  height: '100%',
  paddingLeft: '24px',
  paddingRight: '24px',
  overflowY: 'auto',
  gap: '24px',
  [`&::-webkit-scrollbar`]: {
    width: '7px',
    borderRadius: '40px',
  },
  [`&:hover::-webkit-scrollbar-thumb`]: {
    background: 'rgba(0, 0, 0, 0.12)',
    borderRadius: '40px',
  },
}));
