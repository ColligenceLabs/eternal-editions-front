import { Stack } from '@mui/material';
import React from 'react';
import { Hr, Label, Row, TotalValue, Value } from './StyledComponents';

export default function TicketSalesInfo() {
  return (
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
          <Value>For Sale</Value>
        </Row>
        <Row>
          <Label>Reserve Price</Label>
          <Value>1,200 EDCP $123</Value>
        </Row>{' '}
        <Row>
          <Label>Duration of Listing</Label>
          <Value>2022.11.16 ~ 2022.12.16</Value>
        </Row>
        <Row>
          <Label>Creator Earnings</Label>
          <Value>7.5%</Value>
        </Row>
      </Stack>

      <Label sx={{ mt: '27px' }}>Summary</Label>

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
          <Value>7.5%</Value>
        </Row>
      </Stack>

      <Hr />

      <Row>
        <Label>Potential earning</Label>
        <TotalValue>-- EDCP</TotalValue>
      </Row>
    </Stack>
  );
}
