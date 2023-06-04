import React, { useState } from 'react';
import ModalCustom, { ModalCustomProps } from '../../common/ModalCustom';
import { Stack, Typography, useTheme } from '@mui/material';
import OffersTable from './OffersTable';
import WinningBidModal from './WinningBidModal';
import { OfferType } from './OffersTable';

type Props = Omit<ModalCustomProps, 'children'>;

function OffersModal(props: Props) {
  const theme = useTheme();
  const [openWinningBid, setOpenWinningBid] = useState(false);
  const [activeOffer, setActiveOffer] = useState<OfferType>();

  const resetOfferSelection = () => {
    setOpenWinningBid(false);
    setActiveOffer(undefined);
    setOpenWinningBid(false);
  };

  const onClickItem = (offer: OfferType) => {
    setOpenWinningBid(true);
    setActiveOffer(offer);
  };

  if (openWinningBid) {
    return <WinningBidModal offer={activeOffer} open={props.open} onClose={resetOfferSelection} />;
  }

  return (
    <ModalCustom
      {...props}
      sx={{ [theme.breakpoints.down('md')]: { mx: 2 } }}
      containerStyles={{ width: 'min(850px, 100%)' }}
    >
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
    </ModalCustom>
  );
}

export default OffersModal;
