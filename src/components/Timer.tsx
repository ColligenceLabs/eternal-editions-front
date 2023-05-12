import { styled, Typography, TypographyProps, useTheme } from '@mui/material';
import moment from 'moment';
import React, { ElementType } from 'react';
import useCountdown from 'src/hooks/useCountdown';

type Props = {
  releasedDate: Date;
  as?: ElementType;
  onClick?: () => void;
};

const StyledTypography = styled((props: TypographyProps) => <Typography {...props} />)(
  ({ theme }) => ({
    fontSize: '14px',
    fontWeight: 'bold',
    lineHeight: 12 / 14,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '22px 32px',
    '&:disabled': {
      background: 'rgba(0, 0, 0, 0.24)',
      backdropFilter: 'blur(50px)',
    },
    background: theme.palette.primary.main,
  })
);

export default function Timer({ releasedDate, as = StyledTypography }: Props) {
  const theme = useTheme();
  const { days, hours, minutes, seconds } = useCountdown(new Date(releasedDate));
  const Component = as;

  if (!(releasedDate instanceof Date) || isNaN(Number(days))) {
    return null;
  }

  const getColor = () => {
    if (Number(seconds) < 0 || Number(minutes) > 15) {
      return theme.palette.common.white;
    }

    if (Number(seconds) <= 1) {
      return '#EC1515';
    }

    return theme.palette.primary.main;
  };

  return (
    <Component sx={{ color: getColor() }}>
      {days}:{hours}:{minutes}:{seconds}
    </Component>
  );
}
