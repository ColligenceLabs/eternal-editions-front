import { Stack, Typography, styled } from '@mui/material';
import React, { useState } from 'react';
import ModalCustom, { ModalCustomProps } from 'src/components/common/ModalCustom';
import { Label, Section, Value } from '../StyledComponents';
import { OfferType } from './OffersTable';
import RoundedButton from 'src/components/common/RoundedButton';
import palette from 'src/theme/palette';
import TransferModal from './TransferModal';
import HyperlinkButton from 'src/components/ticket/HyperlinkButton';
import { getShotAddress } from 'src/utils/wallet';
import { set } from 'lodash';

interface Props extends Omit<ModalCustomProps, 'children'> {
  offer: OfferType | undefined;
}

function WinningBidModal({ offer, ...props }: Props) {
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

  if (openTransfer) {
    return (
      <TransferModal open={props.open} onClose={onClose} onSubmitSuccess={onTransferSuccess} />
    );
  }

  return (
    <ModalCustom {...props}>
      <Stack gap={3}>
        <Typography variant="h3">WINNING BID</Typography>

        <Section>
          <StyledLabel>PRICE</StyledLabel>
          <StyledValue>{offer.price}</StyledValue>
        </Section>

        <Section>
          <StyledLabel>USD PRICE</StyledLabel>
          <StyledValue>{offer.usdPrice}</StyledValue>
        </Section>

        <Section>
          <StyledLabel>FLOOR DIFFERENCE</StyledLabel>
          <StyledValue>{offer.floorDifference}</StyledValue>
        </Section>

        <Section>
          <StyledLabel>FROM</StyledLabel>
          <StyledValue>홍길동</StyledValue>
        </Section>

        {txid ? (
          <Section>
            <StyledLabel>TXID</StyledLabel>
            <Stack flexDirection="row" alignItems="center" gap="12px">
              <StyledValue>{getShotAddress(offer.address)}</StyledValue>
              <HyperlinkButton href={''} styles={{ backgroundColor: '#F5F5F5' }} />
            </Stack>
          </Section>
        ) : null}

        {isVerifided ? (
          <RoundedButton onClick={onConfirm}>confirm</RoundedButton>
        ) : (
          <RoundedButton onClick={() => setOpenTransfer(true)}>winning bid</RoundedButton>
        )}
      </Stack>
    </ModalCustom>
  );
}

export default WinningBidModal;

// ----------------------------------------------------------------------

const StyledLabel = styled(Label)(() => ({
  color: palette.dark.black.lighter,
}));

const StyledValue = styled(Value)(() => ({
  color: palette.dark.common.black,
}));
