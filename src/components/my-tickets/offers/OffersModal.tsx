import { useEffect, useState } from 'react';
import ModalCustom, { ModalCustomProps } from '../../common/ModalCustom';
import { useTheme } from '@mui/material';
import WinningBidContent from './OffersModalContent/WinningBidContent';
import OffersContent, { OfferType } from './OffersModalContent/OffersContent';

interface Props extends Omit<ModalCustomProps, 'children'> {
  sellbookId: number;
}

function OffersModal({ sellbookId, ...props }: Props) {
  const theme = useTheme();
  const [openWinningBid, setOpenWinningBid] = useState(false);
  const [activeOffer, setActiveOffer] = useState<OfferType>();
  const [bids, setBids] = useState([]);

  const resetOfferSelection = () => {
    setOpenWinningBid(false);
    setActiveOffer(undefined);
    setOpenWinningBid(false);

    if (typeof props.onClose === 'function') {
      props.onClose();
    }
  };

  const onClickItem = (offer: OfferType) => {
    setOpenWinningBid(true);
    setActiveOffer(offer);
  };

  const getModalContent = () => {
    if (openWinningBid) {
      return (
        <WinningBidContent offer={activeOffer} open={props.open} onClose={resetOfferSelection} />
      );
    }

    return <OffersContent onClickItem={onClickItem} />;
  };

  const fetchBids = async () => {
    console.log('!! check offers : selBook id = ', sellbookId);
    // TODO : // TODO : DB 에서 해당 sellBook 건과 관련된 auction bid 정보 가져오기...
    setBids([]);
  };

  useEffect(() => {
    fetchBids();
  }, []);

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
