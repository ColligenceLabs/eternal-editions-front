import { Button, buttonClasses, ButtonProps, styled } from '@mui/material';
import moment from 'moment';
import React from 'react';
import useCountdown from 'src/hooks/useCountdown';

type Props = {
  releasedDate: Date;
  onClick?: () => void;
};

const StyledButton = styled((props: ButtonProps) => <Button {...props} />)(({ theme }) => ({
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
  [`&.${buttonClasses.textPrimary}`]: {
    color: theme.palette.common.black,
  },
  [`&:disabled.${buttonClasses.textPrimary}`]: {
    color: theme.palette.common.white,
  },
  [`&:disabled.${buttonClasses.textError}`]: {
    color: '#EC1515',
  },
  [`&:disabled.${buttonClasses.textSuccess}`]: {
    color: theme.palette.primary.main,
  },
}));

const getColor = (diffTime: number) => {
  if (diffTime <= 1) {
    return 'error';
  }

  if (diffTime <= 15 * 60) {
    return 'success';
  }

  return 'primary';
};

export default function BuyNowButton({ releasedDate, onClick }: Props) {
  const countdown = useCountdown(new Date(releasedDate));
  const today = new Date();
  const diffTime = moment(releasedDate).diff(today, 'seconds');

  if (diffTime > 0) {
    return (
      <StyledButton onClick={onClick} color={getColor(1)} disabled>
        {countdown.days}:{countdown.hours}:{countdown.minutes}:{countdown.seconds}
      </StyledButton>
    );
  }

  return <StyledButton onClick={onClick}>Buy Now</StyledButton>;
}
