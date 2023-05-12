import {
  inputBaseClasses,
  listClasses,
  MenuItem,
  menuItemClasses,
  MenuItemProps,
  outlinedInputClasses,
  Select,
  selectClasses,
  SelectProps,
  styled,
} from '@mui/material';
import { PropsWithChildren } from 'react';

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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '22px',
    paddingBottom: '22px',
    fontWeight: 'bold',
    color: theme.palette.common.white,
    borderRadius: 'inherit',
    height: 'unset',
    minHeight: '56px',
    whiteSpace: 'pre-wrap !important',
    boxSizing: 'border-box',
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

interface Props extends PropsWithChildren, SelectProps {
  value: unknown;
  onChange?: SelectProps['onChange'];
}

export const RoundedSelectOption = ({ children, ...props }: PropsWithChildren<MenuItemProps>) => (
  <StyledMenuItem disableGutters {...props}>
    {children}
  </StyledMenuItem>
);

export const RoundedSelect = ({ value, onChange, children, ...props }: Props) => (
  <StyledSelect
    fullWidth
    variant="outlined"
    value={value}
    onChange={onChange}
    MenuProps={MenuProps}
    {...props}
  >
    {children}
  </StyledSelect>
);
