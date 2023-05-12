import { Chip, useTheme } from '@mui/material';
import React from 'react';

type Props = {
  label: string;
};

export default function Badge({ label }: Props) {
  const theme = useTheme();

  return (
    <Chip
      label={label}
      variant="outlined"
      color="primary"
      sx={{
        fontWeight: theme.typography.fontWeightBold,
        textTransform: 'uppercase',
      }}
    />
  );
}
