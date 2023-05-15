import { Box } from '@mui/material';
import React from 'react';

type Props = {
  url: string;
};

export default function FixedBackground({ url }: Props) {
  return (
    <Box
      sx={{
        backgroundImage: url,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        zIndex: -1,
      }}
    />
  );
}
