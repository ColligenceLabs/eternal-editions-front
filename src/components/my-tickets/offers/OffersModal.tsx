import { useEffect, useState } from 'react';
import ModalCustom, { ModalCustomProps } from '../../common/ModalCustom';
import { useTheme } from '@mui/material';
import WinningBidContent from './OffersModalContent/WinningBidContent';
import OffersContent from './OffersModalContent/OffersContent';

interface Props extends Omit<ModalCustomProps, 'children'> {
  sellbookId: number | undefined;
  reservePrice: number;
}

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

function OffersModal({ sellbookId, reservePrice, ...props }: Props) {
  const theme = useTheme();
  const [openWinningBid, setOpenWinningBid] = useState(false);
  const [activeOffer, setActiveOffer] = useState<BidTypes>();

  const resetOfferSelection = () => {
    setOpenWinningBid(false);
    setActiveOffer(undefined);
    setOpenWinningBid(false);

    if (typeof props.onClose === 'function') {
      props.onClose();
    }
  };

  const onClickItem = (offer: BidTypes) => {
    setOpenWinningBid(true);
    setActiveOffer(offer);
  };

  const getModalContent = () => {
    if (openWinningBid) {
      return (
        <WinningBidContent
          offer={activeOffer}
          open={props.open}
          onClose={resetOfferSelection}
          reservePrice={reservePrice}
        />
      );
    }

    return (
      <OffersContent
        onClickItem={onClickItem}
        sellbookId={sellbookId}
        reservePrice={reservePrice}
      />
    );
  };

  return (
    <ModalCustom
      {...props}
      onClose={resetOfferSelection}
      sx={{ [theme.breakpoints.down('md')]: { mx: 2 } }}
      containerStyles={openWinningBid ? {} : { width: 'min(850px, 100%)' }}
    >
      <>{getModalContent()}</>
    </ModalCustom>
  );
}

export default OffersModal;
