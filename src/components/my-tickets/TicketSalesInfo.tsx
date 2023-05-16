import { Stack } from '@mui/material';
import React from 'react';
import RoundedButton from '../common/RoundedButton';
import { Hr, Label, Row, TotalValue, Value } from './StyledComponents';
import { MyTicketTypes } from 'src/@types/my/myTicket';

interface Props {
  sellTicketInfo: MyTicketTypes;
  amount: string;
  typeOfSale: string;
  creatorEarnings: string;
}

export default function TicketSalesInfo({
  sellTicketInfo,
  amount,
  typeOfSale,
  creatorEarnings,
}: Props) {
  const isAuction = typeOfSale === 'auction';

  const handleClickConfirm = async () => {
    console.log('click confirm.');
    console.log(sellTicketInfo);
    console.log(`amount : ${amount}`);
    console.log(`typeOfSale : ${typeOfSale}`);
    console.log(`creatorEarnings : ${creatorEarnings}`);
  };
  return (
    <Stack gap="24px" justifyContent="space-between" sx={{ height: '100%' }}>
      <Stack gap="12px">
        <Stack gap={{ xs: 2, md: '7px' }}>
          <Row>
            <Label>Day</Label>
            <Value>Wednesday (November 11,2023)</Value>
          </Row>
          <Row>
            <Label>Team</Label>
            <Value>Team Yellow</Value>
          </Row>
        </Stack>
        <Hr />
        <Stack gap={{ xs: 2, md: '7px' }}>
          <Row>
            <Label>Status</Label>
            <Value>{isAuction ? 'On Auction' : 'For Sale'}</Value>
          </Row>
          <Row>
            <Label>Reserve Price</Label>
            <Value>$ 37.45(Ξ 0.02871)</Value>
          </Row>
          {isAuction ? (
            <Row>
              <Label>Current Price</Label>
              <Value>$ 74.9(Ξ 0.05742)</Value>
            </Row>
          ) : null}
          <Row>
            <Label>Duration of Listing</Label>
            <Value>2022.11.16 ~ 2022.12.16</Value>
          </Row>
          <Row>
            <Label>Creator Earnings</Label>
            <Value>{creatorEarnings}%</Value>
          </Row>
        </Stack>
        <Label sx={{ mt: '15px' }}>Summary</Label>
        <Hr />
        <Stack gap={{ xs: 2, md: '7px' }}>
          <Row>
            <Label>Listing Price</Label>
            <Value>-- EDCP</Value>
          </Row>
          <Row>
            <Label>Service fee</Label>
            <Value>2.5%</Value>
          </Row>{' '}
          <Row>
            <Label>Creator earnings</Label>
            <Value>{creatorEarnings}%</Value>
          </Row>
        </Stack>
        <Hr />
        <Row>
          <Label>Potential earning</Label>
          <TotalValue>-- EDCP</TotalValue>
        </Row>
      </Stack>

      {/*{isAuction ? <RoundedButton variant="withImage">CONFIRM</RoundedButton> : null}*/}
      <RoundedButton variant="withImage" onClick={handleClickConfirm}>
        CONFIRM
      </RoundedButton>
    </Stack>
  );
}
