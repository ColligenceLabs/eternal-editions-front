import {
  Button,
  Input,
  inputBaseClasses,
  inputClasses,
  listClasses,
  MenuItem,
  menuItemClasses,
  outlinedInputClasses,
  Select,
  selectClasses,
  Stack,
  styled,
  Typography,
} from '@mui/material';

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
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

export const Section = styled(Stack)({
  gap: '12px',
});

export const StyledButton = styled(Button)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  fontSize: 12,
  lineHeight: 13 / 12,
  [theme.breakpoints.up('md')]: {
    fontSize: 14,
    lineHeight: 12 / 14,
  },
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: theme.palette.common.black,
  backgroundColor: theme.palette.primary.light,
  bordrerRadius: '50px',
  paddingTop: '22px',
  paddingBottom: '22px',
}));

export const StyledSelect = styled(Select)(({ theme }) => ({
  textTransform: 'uppercase',
  textAlign: 'center',
  borderRadius: '60px',
  letterSpacing: '0.08em',
  fontSize: 12,
  lineHeight: 13 / 12,
  [theme.breakpoints.up('md')]: {
    fontSize: 14,
    lineHeight: 12 / 14,
  },
  [`& .${selectClasses.icon}`]: {
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: theme.palette.common.white,
  },
  [`& .${outlinedInputClasses.notchedOutline}`]: {
    borderColor: theme.palette.common.white,
  },
  [`& .${selectClasses.select}`]: {
    paddingTop: '11px',
    paddingBottom: '11px',
    fontWeight: 'bold',
    color: theme.palette.common.white,
    borderRadius: 'inherit',
    height: 'unset',
    minHeight: 'unset !important',
    whiteSpace: 'pre-wrap',
    [theme.breakpoints.up('md')]: {
      padding: '22px 40px',
    },
  },
  [`&:hover, &.Mui-focused`]: {
    [`.${outlinedInputClasses.notchedOutline}`]: {
      borderColor: theme.palette.common.white,
      color: theme.palette.common.black,
    },
    [`& .${selectClasses.select}`]: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black,
      borderRadius: 'inherit',
    },
    [`.${selectClasses.icon}`]: {
      color: theme.palette.common.black,
    },
  },
  [`& .${inputBaseClasses.inputSizeSmall}`]: {
    padding: '10px 12px',
    fontSize: 12,
    lineHeight: 13 / 12,
  },
  [`&.MuiInputBase-sizeSmall .${selectClasses.icon}`]: {
    right: '12px',
  },
}));

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  [`&.${menuItemClasses.root}`]: {
    textTransform: 'uppercase',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: 14,
    lineHeight: 12 / 14,
    letterSpacing: '0.08em',
    justifyContent: 'center',
    padding: '22px 40px',
  },
  [`&.${menuItemClasses.selected}`]: {
    background: '#00E904 !important',
    borderRadius: 0,
  },
}));

export const StyledInput = styled(Input)({
  height: '53px',
  fontSize: 14,
  lineHeight: 20 / 14,
  [`&::before`]: {
    borderColor: 'rgba(255, 255, 255, 0.4)',
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

export const MenuProps = {
  PaperProps: {
    style: {
      background: 'white',
      borderRadius: '28px',
      border: 'none',
      color: 'black',
    },
    sx: {
      [`.${listClasses.padding}`]: {
        padding: '0',
      },
    },
  },
};

export const Hr = styled('hr')({
  width: '100%',
  border: 'none',
  borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
});
