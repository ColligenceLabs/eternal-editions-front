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
  MenuProps,
  Row,
  Section,
  StyledButton,
  StyledInput,
  StyledMenuItem,
  StyledSelect,
  TotalValue,
  Value,
} from 'src/components/my-tickets/StyledComponents';

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
    value: 1,
  },
];

export default function TicketSellForm() {
  const theme = useTheme();

  const [typeOfSale, setTypeOfSale] = useState(TYPES_OF_SALE[0].value);
  const [priceUnit, setPriceUnit] = useState(PRICE_UNITS[0].value);
  const [duration, setDuration] = useState(DURATIONS[0].value);

  const onChangeTypeOfSale = (event: SelectChangeEvent<unknown>) => {
    setTypeOfSale(event.target.value as string);
  };

  const onChangeUnit = (event: SelectChangeEvent<unknown>) => {
    setPriceUnit(event.target.value as string);
  };

  const onChangeDuration = (event: SelectChangeEvent<unknown>) => {
    setDuration(event.target.value as number);
  };

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
        <StyledSelect
          fullWidth
          variant="outlined"
          value={typeOfSale}
          onChange={onChangeTypeOfSale}
          MenuProps={MenuProps}
        >
          {TYPES_OF_SALE.map((option) => (
            <StyledMenuItem key={option.value} value={option.value} disableGutters>
              {option.label}
            </StyledMenuItem>
          ))}
        </StyledSelect>
      </Section>

      <Hr sx={{ [theme.breakpoints.up('md')]: { display: 'none' } }} />

      <Box>
        <Label>SET A PRICE</Label>
        <FormControl variant="standard" fullWidth>
          <StyledInput
            placeholder="Amount"
            endAdornment={
              <InputAdornment position="end">
                <StyledSelect
                  size="small"
                  value={priceUnit}
                  onChange={onChangeUnit}
                  MenuProps={MenuProps}
                >
                  {PRICE_UNITS.map((unit) => (
                    <StyledMenuItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </StyledMenuItem>
                  ))}
                </StyledSelect>
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>

      <Section>
        <Label>DURATION</Label>
        <StyledSelect
          fullWidth
          variant="outlined"
          value={duration}
          onChange={onChangeDuration}
          MenuProps={MenuProps}
        >
          {DURATIONS.map((option) => (
            <StyledMenuItem key={option.value} value={option.value} disableGutters>
              {option.label}
            </StyledMenuItem>
          ))}
        </StyledSelect>
      </Section>

      <Box>
        <Label>SET A PRICE</Label>
        <FormControl variant="standard" fullWidth>
          <StyledInput
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
      </Section>

      <Hr sx={{ my: '-12px' }} />

      <Row>
        <Label>Potential earning</Label>
        <TotalValue>-- EDCP</TotalValue>
      </Row>

      <StyledButton>COMPLETE LISTING</StyledButton>
    </>
  );
}
