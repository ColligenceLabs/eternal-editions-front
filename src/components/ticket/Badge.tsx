import { Chip, useTheme } from '@mui/material';
import React from 'react';

type Props = {
  label: string;
  style?: React.CSSProperties;
  disabled?: boolean;
};

export default function Badge({ label, style, disabled }: Props) {
  const theme = useTheme();

  return (
    <Chip
      label={label}
      variant="outlined"
      sx={{
        fontWeight: theme.typography.fontWeightBold,
        textTransform: 'uppercase',
        ...style,
        borderColor: disabled ? '' : theme.palette.primary.main,
        color: disabled ? '' : theme.palette.primary.main,
      }}
    />
  );
}
