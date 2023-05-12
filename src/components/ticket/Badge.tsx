import { Chip, useTheme } from '@mui/material';
import React from 'react';

type Props = {
  label: string;
  style?: React.CSSProperties;
};

export default function Badge({ label, style }: Props) {
  const theme = useTheme();

  return (
    <Chip
      label={label}
      variant="outlined"
      color="primary"
      sx={{
        fontWeight: theme.typography.fontWeightBold,
        textTransform: 'uppercase',
        ...style,
      }}
    />
  );
}
