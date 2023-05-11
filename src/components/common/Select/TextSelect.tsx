import { ArrowDropDown, Check } from '@mui/icons-material';
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

const StyledSelect = styled(Select)(({ theme }) => ({
  width: 'max-content',
  textTransform: 'uppercase',
  textAlign: 'left',
  letterSpacing: '0.08em',
  fontSize: 12,
  lineHeight: 13 / 12,
  [theme.breakpoints.up('md')]: {
    fontSize: 14,
    lineHeight: 12 / 14,
  },
  [`& .${selectClasses.icon}`]: {
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    color: theme.palette.common.white,
  },
  [`& .${selectClasses.select}`]: {
    paddingTop: '11px',
    paddingBottom: '11px',
    fontWeight: 'bold',
    color: theme.palette.common.white,
    height: 'unset',
    minHeight: 'unset !important',
  },
  [`.${outlinedInputClasses.notchedOutline}`]: {
    border: 'none',
  },
  [`& .${inputBaseClasses.input}`]: {
    padding: '12px',
    paddingRight: '24px !important',
    fontSize: 12,
    lineHeight: 13 / 12,
  },
  [`&:hover, &.Mui-focused`]: {
    [`.${outlinedInputClasses.notchedOutline}`]: {
      color: theme.palette.common.black,
    },
    [`& .${selectClasses.select}`]: {
      backgroundColor: 'transparent',
    },
    [`.${selectClasses.icon}`]: {
      color: theme.palette.common.white,
    },
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  [`&.${menuItemClasses.root}`]: {
    textTransform: 'uppercase',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: 12,
    lineHeight: 13 / 12,
    letterSpacing: '0.08em',
    padding: '12px 12px 12px 32px',
    [`&[hidden]`]: {
      display: 'none',
    },
  },
  [`&.${menuItemClasses.selected}`]: {
    background: `${theme.palette.common.white} !important`,
    borderRadius: 0,
  },
}));

const MenuProps = {
  PaperProps: {
    style: {
      background: 'white',
      borderRadius: '12px',
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

export const TextSelectOption = ({ children, ...props }: PropsWithChildren<MenuItemProps>) => (
  <StyledMenuItem disableGutters {...props}>
    {props.selected ? (
      <Check sx={{ position: 'absolute', left: '12px', fontSize: '12px' }} />
    ) : null}
    {children}
  </StyledMenuItem>
);

export const TextSelect = ({ value, onChange, children, ...props }: Props) => (
  <StyledSelect
    fullWidth
    variant="outlined"
    value={value}
    onChange={onChange}
    MenuProps={MenuProps}
    IconComponent={ArrowDropDown}
    {...props}
  >
    {children}
  </StyledSelect>
);
