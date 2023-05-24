import {
  Box,
  FormControl,
  InputAdornment,
  SelectChangeEvent,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
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
  { label: 'USDC', value: 'usdc' },
];

// ----------------------------------------------------------------------

type TicketSellFormProps = {
  sellTicketInfo: MyTicketTypes;
  team: string;
  day: string;
  isForSale: boolean;
};

export default function TicketSellForm({
  sellTicketInfo,
  team,
  day,
  isForSale,
}: TicketSellFormProps) {
  const theme = useTheme();
  const [typeOfSale, setTypeOfSale] = useState(TYPES_OF_SALE[0].value);
  const [priceUnit, setPriceUnit] = useState(
    sellTicketInfo.usePoint ? PRICE_UNITS[0].value : PRICE_UNITS[1].value
  );
  const [amount, setAmount] = useState('');
  const [creatorEarnings, setCreatorEarnings] = useState('7.5');
  const [isSubmitting, setIsSubmitting] = useState(isForSale);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [durations, setDurations] = useState([
    {
      label: '1 MONTH (2022.11.16 ~ 2022.11.16)',
      value: '1',
    },
  ]);
  const [duration, setDuration] = useState(durations[0].value);
  const [potentialEarning, setPotentialEarning] = useState(0);

  const onSubmit = () => {
    setIsSubmitting(true);
  };

  useEffect(() => {
    if (parseFloat(amount) >= 0) {
      setPotentialEarning(parseFloat(amount) - parseFloat(amount) / 10);
    } else {
      setPotentialEarning(0);
    }
  }, [amount]);

  useEffect(() => {
    if (isForSale && sellTicketInfo.sellbook) {
      setAmount(sellTicketInfo.sellbook?.price.toString());
      setStartDate(sellTicketInfo.sellbook?.startDate);
      setEndDate(sellTicketInfo.sellbook?.endDate);
    }
  }, [isForSale]);

  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // Note: Months are zero-based, so we add 1
    const currentDay = today.getDate();

    const lastDay = new Date(today.setMonth(today.getMonth() + 1));
    const endYear = lastDay.getFullYear();
    const endMonth = lastDay.getMonth() + 1; // Note: Months are zero-based, so we add 1
    const endDay = lastDay.getDate();

    const startDateStr = `${currentYear}.${currentMonth.toString().padStart(2, '0')}.${currentDay
      .toString()
      .padStart(2, '0')}`;

    const endDateStr = `${endYear}.${endMonth.toString().padStart(2, '0')}.${endDay
      .toString()
      .padStart(2, '0')}`;

    setStartDate(new Date(startDateStr));
    setEndDate(new Date(endDateStr));
    setDurations([
      {
        ...durations[0],
        label: `1 MONTH (${startDateStr} ~ ${endDateStr})`,
      },
    ]);
  }, []);

  if (isSubmitting) {
    return (
      <TicketSalesInfo
        sellTicketInfo={sellTicketInfo}
        amount={amount}
        typeOfSale={typeOfSale}
        creatorEarnings={creatorEarnings}
        startDate={startDate}
        endDate={endDate}
        isForSale={isForSale}
      />
    );
  }

  return (
    <>
      <Stack gap={{ xs: 2, md: 0 }}>
        <Row>
          <Label>Day</Label>
          <Value>{day}</Value>
        </Row>
        <Row>
          <Label>Team</Label>
          <Value>{`Team ${team}`}</Value>
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
                {priceUnit.toUpperCase()}
                {/*<RoundedSelect*/}
                {/*  size="small"*/}
                {/*  value={priceUnit}*/}
                {/*  // onChange={(event) => setPriceUnit(event.target.value as string)}*/}
                {/*>*/}
                {/*  {PRICE_UNITS.map((unit) => (*/}
                {/*    <RoundedSelectOption key={unit.value} value={unit.value}>*/}
                {/*      {unit.label}*/}
                {/*    </RoundedSelectOption>*/}
                {/*  ))}*/}
                {/*</RoundedSelect>*/}
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
          {durations.map((option) => (
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

      {/*<Box>*/}
      {/*  <Label>CREATOR EARNINGS</Label>*/}
      {/*  <FormControl variant="standard" fullWidth>*/}
      {/*    <StyledInput*/}
      {/*      value={creatorEarnings}*/}
      {/*      onChange={({ target }) => setCreatorEarnings(target.value)}*/}
      {/*      endAdornment={*/}
      {/*        <InputAdornment position="end">*/}
      {/*          <Typography color="white" fontWeight="bold" fontSize={14} lineHeight={12 / 14}>*/}
      {/*            %*/}
      {/*          </Typography>*/}
      {/*        </InputAdornment>*/}
      {/*      }*/}
      {/*    />*/}
      {/*  </FormControl>*/}
      {/*  <FootText mt="12px">*/}
      {/*    Creator earning are optional for this collection. You can give them up to 7.50% of your*/}
      {/*    sale.*/}
      {/*  </FootText>*/}
      {/*</Box>*/}

      <Section>
        <Label>Summary</Label>
        <Stack gap="7px">
          <Row>
            <Label>Listing Price</Label>
            <Value>
              {amount} {priceUnit.toUpperCase()}
            </Value>
          </Row>
          <Row>
            <Label>Service fee</Label>
            <Value>2.5%</Value>
          </Row>
          {/*<Row>*/}
          {/*  <Label>CREATOR EARNINGS</Label>*/}
          {/*  <Value>7.5%</Value>*/}
          {/*</Row>*/}
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
        <TotalValue>
          {potentialEarning} {priceUnit.toUpperCase()}
        </TotalValue>
      </Row>

      <RoundedButton sx={{ mt: 3 }} onClick={onSubmit}>
        COMPLETE LISTING
      </RoundedButton>
    </>
  );
}
