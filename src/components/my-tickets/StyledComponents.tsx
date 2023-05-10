import { Input, inputBaseClasses, inputClasses, Stack, styled, Typography } from '@mui/material';

export const Label = styled(Typography)({
  fontSize: 12,
  lineHeight: 17 / 12,
  textTransform: 'uppercase',
  color: 'rgba(255, 255, 255, 0.6)',
});

export const Value = styled(Typography)({
  fontSize: 14,
  lineHeight: 20 / 14,
  color: 'white',
});

export const TotalValue = styled(Typography)({
  fontSize: 16,
  fontWeight: 'bold',
  lineHeight: 24 / 16,
  color: 'white',
});

export const FootText = styled(Typography)({
  fontSize: 12,
  lineHeight: 16 / 12,
  color: 'rgba(255, 255, 255, 0.6)',
});

export const Row = styled(Stack)(({ theme }) => ({
  flexDirection: 'column',
  gap: 8,
  minHeight: '20px',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

export const Section = styled(Stack)({
  gap: '12px',
});

export const StyledInput = styled(Input)({
  height: '44px',
  fontSize: 14,
  lineHeight: 20 / 14,
  [`&::before`]: {
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  [`&.${inputBaseClasses.adornedEnd}`]: {
    height: '53px',
  },
  [`& .${inputClasses.input}`]: {
    alignSelf: 'flex-end',
    marginBottom: '12px',
    padding: 0,
  },
  [`& .${inputClasses.input}::placeholder`]: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
});

export const Hr = styled('hr')({
  width: '100%',
  border: 'none',
  borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
});
