import { Typography } from '@mui/material';
import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import OffersTable from './OffersTable';

type Props = {
  onClickItem: (offer: OfferType) => void;
  sellbookId: number;
};

export interface OfferType {
  price: string;
  usdPrice: string;
  floorDifference: string;
  expiration: string;
  address: string;
}

function OffersContent({ sellbookId, onClickItem }: Props) {
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
        <OffersTable onClickItem={onClickItem} sellbookId={sellbookId} />
      </Stack>
    </Stack>
  );
}

export default OffersContent;
