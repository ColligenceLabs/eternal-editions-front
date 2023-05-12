import { Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import EEAvatar from '../EEAvatar';

type Props = {
  account: string;
  name: string;
  image?: string;
};

export default function CompanyInfo({ account, name, image }: Props) {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      spacing={0.5}
      alignItems="center"
      sx={{
        opacity: 0.72,
        typography: 'caption',
        [theme.breakpoints.down('md')]: {
          marginBottom: -1,
        },
      }}
    >
      {image ? (
        <EEAvatar
          account={account}
          image={image}
          nickname={'by @iloveseoul'}
          sx={{ mr: 0, width: 24, height: 24 }}
        />
      ) : null}
      <Typography fontSize={14} lineHeight={20 / 14}>
        by @{name}
      </Typography>
    </Stack>
  );
}
