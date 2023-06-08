import { Stack, Typography, styled } from '@mui/material';
import { useState } from 'react';
import { ModalCustomProps } from 'src/components/common/ModalCustom';
import { Label, Section, Value } from '../../StyledComponents';
import RoundedButton from 'src/components/common/RoundedButton';
import palette from 'src/theme/palette';
import TransferContent from './TransferContent';
import HyperlinkButton from 'src/components/ticket/HyperlinkButton';
import { getShotAddress } from 'src/utils/wallet';

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

interface Props extends Omit<ModalCustomProps, 'children'> {
  offer: BidTypes | undefined;
  reservePrice: number;
}

function WinningBidContent({ offer, reservePrice, ...props }: Props) {
  const [openTransfer, setOpenTransfer] = useState(false);
  const [isVerifided, setIsVerified] = useState(false);
  const [txid, setTxid] = useState('');

  if (!offer) {
    return null;
  }

  const onTransferSuccess = () => {
    setTxid('0x033c5e2f3059b57b6a91de1cb5ad0697023ea83a');
    setIsVerified(true);
    setOpenTransfer(false);
  };

  const onClose = () => {
    setTxid('');
    setIsVerified(false);
    setOpenTransfer(false);
  };

  const onConfirm = () => {
    if (typeof props.onClose === 'function') {
      props.onClose();
    }
  };

  const handleWinningBid = async () => {
    console.log('!! handleWinningBid : offer = ', offer);
  };

  if (openTransfer) {
    return (
      <TransferContent open={props.open} onClose={onClose} onSubmitSuccess={onTransferSuccess} />
    );
  }

  return (
    <Stack gap={3}>
      <Typography variant="h3">WINNING BID</Typography>

      <Section>
        <StyledLabel>PRICE</StyledLabel>
        <StyledValue>{offer.price} USDC</StyledValue>
      </Section>

      <Section>
        <StyledLabel>USD PRICE</StyledLabel>
        <StyledValue>${offer.price}</StyledValue>
      </Section>

      <Section>
        <StyledLabel>FLOOR DIFFERENCE</StyledLabel>
        <StyledValue>{((reservePrice / offer.price) * 100).toFixed(0)}%</StyledValue>
      </Section>

      <Section>
        <StyledLabel>FROM</StyledLabel>
        <StyledValue>{offer.wallet}</StyledValue>
      </Section>

      {txid ? (
        <Section>
          <StyledLabel>TXID</StyledLabel>
          <Stack flexDirection="row" alignItems="center" gap="12px">
            <StyledValue>{getShotAddress(offer.wallet)}</StyledValue>
            <HyperlinkButton href={''} styles={{ backgroundColor: '#F5F5F5' }} />
          </Stack>
        </Section>
      ) : null}

      {isVerifided ? (
        <RoundedButton onClick={onConfirm}>confirm</RoundedButton>
      ) : (
        // <RoundedButton onClick={() => setOpenTransfer(true)}>winning bid</RoundedButton>
        <RoundedButton onClick={handleWinningBid}>winning bid</RoundedButton>
      )}
    </Stack>
  );
}

export default WinningBidContent;

// ----------------------------------------------------------------------

const StyledLabel = styled(Label)(() => ({
  color: palette.dark.black.lighter,
}));

const StyledValue = styled(Value)(() => ({
  color: palette.dark.common.black,
}));
