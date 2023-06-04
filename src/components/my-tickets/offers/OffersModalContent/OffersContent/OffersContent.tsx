import { Typography } from '@mui/material';
import { Stack } from '@mui/material';
import React from 'react';
import OffersTable from './OffersTable';

type Props = {
  onClickItem: (offer: OfferType) => void;
};

export interface OfferType {
  price: string;
  usdPrice: string;
  floorDifference: string;
  expiration: string;
  address: string;
}

function OffersContent({ onClickItem }: Props) {
  return (
    <Stack gap={3} sx={{ maxHeight: '374px' }}>
      <Typography variant="h3">OFFERS</Typography>
      <Stack
        sx={{
          flex: 1,
          overflow: 'auto',
          [`&::-webkit-scrollbar`]: {
            width: '6px',
            borderRadius: '12px',
          },
          [`&:hover::-webkit-scrollbar-thumb`]: {
            background: 'rgba(99, 115, 129, 0.48)',
            borderRadius: '12px',
            opacity: 0.48,
          },
        }}
      >
        <OffersTable onClickItem={onClickItem} />
      </Stack>
    </Stack>
  );
}

export default OffersContent;
