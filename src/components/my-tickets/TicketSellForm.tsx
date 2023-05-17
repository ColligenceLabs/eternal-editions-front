import {
  Box,
  FormControl,
  InputAdornment,
  SelectChangeEvent,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import {
  FootText,
  Hr,
  Label,
  Row,
  Section,
  StyledInput,
  TotalValue,
  Value,
} from 'src/components/my-tickets/StyledComponents';
import RoundedButton from '../common/RoundedButton';
import { RoundedSelect, RoundedSelectOption } from '../common/Select';
import TicketSalesInfo from './TicketSalesInfo';
import { MyTicketTypes } from 'src/@types/my/myTicket';

const TYPES_OF_SALE = [
  {
    label: 'Fixed price',
    value: 'fixed',
  },
  {
    label: 'Timed Auction',
    value: 'auction',
  },
];

const PRICE_UNITS = [
  {
    label: 'EDCP',
    value: 'edcp',
  },
];

const DURATIONS = [
  {
    label: '1 MONTH (2022.11.16 ~ 2022.11.16)',
    value: '1',
  },
];

// ----------------------------------------------------------------------

type TicketSellFormProps = {
  sellTicketInfo: MyTicketTypes;
};

export default function TicketSellForm({ sellTicketInfo }: TicketSellFormProps) {
  console.log(sellTicketInfo);
  const theme = useTheme();
  const [typeOfSale, setTypeOfSale] = useState(TYPES_OF_SALE[0].value);
  const [priceUnit, setPriceUnit] = useState(PRICE_UNITS[0].value);
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState(DURATIONS[0].value);
  const [creatorEarnings, setCreatorEarnings] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = () => {
    setIsSubmitting(true);
  };

  if (isSubmitting) {
    return (
      <TicketSalesInfo
        sellTicketInfo={sellTicketInfo}
        amount={amount}
        typeOfSale={typeOfSale}
        creatorEarnings={creatorEarnings}
        duration={duration}
      />
    );
  }

  return (
    <>
      <Stack gap={{ xs: 2, md: 0 }}>
        <Row>
          <Label>Day</Label>
          <Value>Wednesday (November 11,2023)</Value>
        </Row>
        <Row>
          <Label>Team</Label>
          <Value>Team Yellow</Value>
        </Row>
      </Stack>

      <Section>
        <Label>CHOOSE A TYPE OF SALE</Label>
        <RoundedSelect
          value={typeOfSale}
          onChange={(event: SelectChangeEvent<any>) => setTypeOfSale(event.target.value)}
        >
          {TYPES_OF_SALE.map((option) => (
            <RoundedSelectOption key={option.value} value={option.value}>
              {option.label}
            </RoundedSelectOption>
          ))}
        </RoundedSelect>
      </Section>

      <Hr sx={{ [theme.breakpoints.up('md')]: { display: 'none' } }} />

      <Box>
        <Label>SET A PRICE</Label>
        <FormControl variant="standard" fullWidth>
          <StyledInput
            value={amount}
            onChange={({ target }) => setAmount(target.value)}
            placeholder="Amount"
            endAdornment={
              <InputAdornment position="end">
                <RoundedSelect
                  size="small"
                  value={priceUnit}
                  onChange={(event) => setPriceUnit(event.target.value as string)}
                >
                  {PRICE_UNITS.map((unit) => (
                    <RoundedSelectOption key={unit.value} value={unit.value}>
                      {unit.label}
                    </RoundedSelectOption>
                  ))}
                </RoundedSelect>
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>

      <Section>
        <Label>DURATION</Label>
        <RoundedSelect
          value={duration}
          onChange={(event) => setDuration(event.target.value as string)}
        >
          {DURATIONS.map((option) => (
            <RoundedSelectOption key={option.value} value={option.value}>
              {option.label}
            </RoundedSelectOption>
          ))}
        </RoundedSelect>
      </Section>

      {typeOfSale === 'auction' ? (
        <>
          <Stack>
            <Label>MAXIMUM BID QUANTITIES</Label>
            <FormControl variant="standard" fullWidth>
              <StyledInput placeholder="Amount" />
            </FormControl>
          </Stack>

          <Stack>
            <Label>MINIMUM BID INCREMENTS</Label>
            <FormControl variant="standard" fullWidth>
              <StyledInput placeholder="Amount" />
            </FormControl>
          </Stack>
        </>
      ) : null}

      <Box>
        <Label>CREATOR EARNINGS</Label>
        <FormControl variant="standard" fullWidth>
          <StyledInput
            value={creatorEarnings}
            onChange={({ target }) => setCreatorEarnings(target.value)}
            endAdornment={
              <InputAdornment position="end">
                <Typography color="white" fontWeight="bold" fontSize={14} lineHeight={12 / 14}>
                  %
                </Typography>
              </InputAdornment>
            }
          />
        </FormControl>
        <FootText mt="12px">
          Creator earning are optional for this collection. You can give them up to 7.50% of your
          sale.
        </FootText>
      </Box>

      <Section>
        <Label>Summary</Label>
        <Stack gap="7px">
          <Row>
            <Label>Listing Price</Label>
            <Value>-- {priceUnit.toUpperCase()}</Value>
          </Row>
          <Row>
            <Label>Service fee</Label>
            <Value>2.5%</Value>
          </Row>{' '}
          {creatorEarnings ? (
            <Row>
              <Label>Creator earnings</Label>
              <Value>{creatorEarnings}%</Value>
            </Row>
          ) : null}
        </Stack>
      </Section>

      <Hr sx={{ my: '-12px' }} />

      <Row>
        <Label>Potential earning</Label>
        <TotalValue>-- {priceUnit.toUpperCase()}</TotalValue>
      </Row>

      <RoundedButton sx={{ mt: 3 }} onClick={onSubmit}>
        COMPLETE LISTING
      </RoundedButton>
    </>
  );
}
