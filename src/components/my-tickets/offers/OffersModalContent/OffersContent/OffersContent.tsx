import { Typography } from '@mui/material';
import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import OffersTable from './OffersTable';

type Props = {
  onClickItem: (offer: BidTypes) => void;
  sellbookId: number | undefined;
  reservePrice: number;
};

type BidTypes = {
  id: number;
  price: number;
  sellbookId: number;
  uid: string;
  wallet: string;
  bidInfo: any;
  createdAt: Date;
  updatedAt: Date;
};

function OffersContent({ sellbookId, onClickItem, reservePrice }: Props) {
  return (
    <Stack gap={3}>
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
        <OffersTable
          onClickItem={onClickItem}
          sellbookId={sellbookId}
          reservePrice={reservePrice}
        />
      </Stack>
    </Stack>
  );
}

export default OffersContent;
