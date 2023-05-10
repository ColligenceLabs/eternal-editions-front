import { Button, ButtonProps, styled } from '@mui/material';
import React from 'react';
import palette from 'src/theme/palette';

type ButtonVariant = 'default' | 'withImage';

interface Props extends Omit<ButtonProps, 'variant'> {
  variant?: ButtonVariant;
}

const TEXT_COLOR = {
  default: palette.dark.common.black,
  withImage: palette.dark.common.white,
};

const BACKGROUND_COLOR = {
  default: '#77FB79',
  withImage: 'rgba(0, 0, 0, 0.24)',
};

export default function RoundedButton({ variant = 'default', children, ...props }: Props) {
  const StyledButton = styled(Button)(({ theme }) => ({
    fontWeight: theme.typography.fontWeightBold,
    fontSize: 12,
    lineHeight: 13 / 12,
    [theme.breakpoints.up('md')]: {
      fontSize: 14,
      lineHeight: 12 / 14,
    },
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    bordrerRadius: '50px',
    paddingTop: '22px',
    paddingBottom: '22px',
    color: TEXT_COLOR[variant],
    backgroundColor: BACKGROUND_COLOR[variant],
    [`&:hover`]: {
      color: theme.palette.common.black,
      backgroundColor: theme.palette.primary.main,
    },
  }));

  return <StyledButton {...props}>{children}</StyledButton>;
}
