import {
  Box,
  Button,
  FormControl,
  Input,
  InputAdornment,
  inputBaseClasses,
  inputClasses,
  listClasses,
  MenuItem,
  menuItemClasses,
  outlinedInputClasses,
  Select,
  SelectChangeEvent,
  selectClasses,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { EEAvatar } from 'src/components';
import { useRequest } from 'src/hooks';

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

// ----------------------------------------------------------------------

const Label = styled(Typography)({
  fontSize: 12,
  lineHeight: 17 / 12,
  textTransform: 'uppercase',
  color: 'rgba(255, 255, 255, 0.6)',
});

const Value = styled(Typography)({
  fontSize: 14,
  lineHeight: 20 / 14,
  color: 'white',
});

const TotalValue = styled(Typography)({
  fontSize: 16,
  fontWeight: 'bold',
  lineHeight: 24 / 16,
  color: 'white',
});

const FootText = styled(Typography)({
  fontSize: 12,
  lineHeight: 16 / 12,
  color: 'rgba(255, 255, 255, 0.6)',
});

const Row = styled(Stack)({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const Section = styled(Stack)({
  gap: '12px',
});

const StyledButton = styled(Button)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  fontSize: 14,
  lineHeight: 12 / 14,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: theme.palette.common.black,
  backgroundColor: theme.palette.primary.light,
  bordrerRadius: '50px',
  paddingTop: '22px',
  paddingBottom: '22px',
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  fontSize: '14px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  textAlign: 'center',
  borderRadius: '60px',
  minHeight: 'unset',
  [`& .${selectClasses.icon}`]: {
    right: '16px',
    color: theme.palette.common.white,
  },
  [`& .${outlinedInputClasses.notchedOutline}`]: {
    borderColor: theme.palette.common.white,
  },
  [`& .${selectClasses.select}`]: {
    padding: '22px 40px',
    fontWeight: 'bold',
    color: theme.palette.common.white,
    borderRadius: 'inherit',
  },
  [`&:hover, &.Mui-focused`]: {
    [`.${outlinedInputClasses.notchedOutline}`]: {
      borderColor: theme.palette.common.white,
      color: theme.palette.common.black,
    },
    [`& .${selectClasses.select}`]: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black,
      borderRadius: 'inherit',
    },
    [`.${selectClasses.icon}`]: {
      color: theme.palette.common.black,
    },
  },
  [`& .${inputBaseClasses.inputSizeSmall}`]: {
    padding: '10px 12px',
    fontSize: 12,
  },
  [`&.MuiInputBase-sizeSmall .${selectClasses.icon}`]: {
    top: 'calc(50% - 10px)',
    right: '12px',
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  [`&.${menuItemClasses.root}`]: {
    textTransform: 'uppercase',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: 14,
    lineHeight: 12 / 14,
    letterSpacing: '0.08em',
    justifyContent: 'center',
    padding: '22px 40px',
  },
  [`&.${menuItemClasses.selected}`]: {
    background: '#00E904 !important',
    borderRadius: 0,
  },
}));

const StyledInput = styled(Input)({
  height: '53px',
  fontSize: 14,
  lineHeight: 20 / 14,
  [`&::before`]: {
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  [`& .${inputClasses.input}`]: {
    alignSelf: 'flex-end',
    marginBottom: '12px',
    padding: 0,
  },
  [`& .${inputClasses.input}::placeholder`]: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
});

const MenuProps = {
  PaperProps: {
    style: {
      background: 'white',
      borderRadius: '28px',
      border: 'none',
      color: 'black',
    },
    sx: {
      [`.${listClasses.padding}`]: {
        padding: '0',
      },
    },
  },
};

const Hr = styled('hr')({
  width: '100%',
  borderWidth: '1px',
  borderColor: 'rgba(255, 255, 255, 0.4)',
});

// ----------------------------------------------------------------------

export default function MyTicketSell() {
  const { data } = useRequest(`api/service/mysterybox/336`);
  const ticketInfo = data?.data;
  const [typeOfSale, setTypeOfSale] = useState(TYPES_OF_SALE[0].value);
  const [priceUnit, setPriceUnit] = useState(PRICE_UNITS[0].value);
  const [duration, setDuration] = useState(DURATIONS[0].value);

  if (!ticketInfo) {
    return null;
  }

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
    <Stack
      gap={3}
      sx={{
        background: 'rgba(0, 0, 0, 0.24)',
        backdropFilter: 'blur(50px)',
        borderRadius: '40px',
        width: 'min(100%, 400px)',
        height: '100%',
        overflowY: 'auto',
        padding: 3,
        marginLeft: 'auto',
        [`&::-webkit-scrollbar`]: {
          width: '7px',
          borderRadius: '40px',
        },
        [`&::-webkit-scrollbar-track`]: {
          marginTop: '24px',
          marginBottom: '24px',
        },
        [`&:hover::-webkit-scrollbar-thumb`]: {
          background: 'rgba(0, 0, 0, 0.12)',
          borderRadius: '40px',
        },
      }}
    >
      <Stack
        direction="row"
        spacing={0.5}
        alignItems="center"
        sx={{ opacity: 0.72, typography: 'caption' }}
      >
        <EEAvatar
          account={'0x8B7B2b4F7A391b6f14A81221AE0920a9735B67Fc'}
          image={'url(/assets/static/avatars/1.jpg)'}
          nickname={'by @iloveseoul'}
          sx={{ mr: 0, width: 24, height: 24 }}
        />

        <Typography fontSize={14} lineHeight={20 / 14}>
          by @iloveseoul
        </Typography>
      </Stack>

      <Typography variant="h2">DCENTRAL Miami 2023 VIP</Typography>

      <Box>
        <Row>
          <Label>Day</Label>
          <Value>Wednesday (November 11,2023)</Value>
        </Row>
        <Row>
          <Label>Team</Label>
          <Value>Team Yellow</Value>
        </Row>
      </Box>

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
            placeholder="Amount"
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
    </Stack>
  );
}
