import {
  Box,
  FormControl,
  Input,
  InputAdornment,
  inputBaseClasses,
  inputClasses,
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

const Row = styled(Stack)({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const StyledSelect = styled(Select)(({ theme }) => ({
  fontSize: '14px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  textAlign: 'center',
  borderRadius: '60px',
  minHeight: 'unset',
  [`&:hover`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
  },
  [`& .${outlinedInputClasses.notchedOutline}`]: {
    borderColor: theme.palette.common.white,
  },
  [`& .${selectClasses.icon}`]: {
    right: '16px',
    color: theme.palette.common.white,
  },
  [`&:hover .${selectClasses.icon}`]: {
    color: theme.palette.common.black,
  },
  [`& .${selectClasses.select}`]: {
    padding: '22px 40px',
    fontWeight: 'bold',
  },
  [`&:hover .${selectClasses.select}`]: {
    backgroundColor: theme.palette.common.white,
    borderRadius: 'inherit',
  },
  [`& .${inputBaseClasses.inputSizeSmall}`]: {
    padding: '10px 12px',
    fontSize: 12,
    [`& .${selectClasses.icon}`]: {
      top: 'calc(50% - 10px)',
      right: '12px',
    },
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
  [`&:hover`]: {
    borderColor: theme.palette.common.white,
  },
  [`&.${menuItemClasses.selected}`]: {
    background: theme.palette.primary.main,
  },
}));

const StyledInput = styled(Input)({
  height: '53px',
  fontSize: 14,
  lineHeight: 20 / 14,
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
      color: 'black',
    },
  },
};

// ----------------------------------------------------------------------

export default function MyTicketSell() {
  const { data } = useRequest(`api/service/mysterybox/336`);
  const ticketInfo = data?.data;
  const [typeOfSale, setTypeOfSale] = useState(TYPES_OF_SALE[0].value);
  const [priceUnit, setPriceUnit] = useState(PRICE_UNITS[0].value);

  if (!ticketInfo) {
    return null;
  }

  const onChangeTypeOfSale = (event: SelectChangeEvent<unknown>) => {
    setTypeOfSale(event.target.value as string);
  };

  const onChangeUnit = (event: SelectChangeEvent<unknown>) => {
    setPriceUnit(event.target.value as string);
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

      <Box>
        <Label mb="12px">CHOOSE A TYPE OF SALE</Label>
        <StyledSelect
          fullWidth
          variant="outlined"
          value={typeOfSale}
          onChange={onChangeTypeOfSale}
          MenuProps={MenuProps}
        >
          {TYPES_OF_SALE.map((option) => (
            <StyledMenuItem key={option.value} value={option.value} color="black" disableGutters>
              {option.label}
            </StyledMenuItem>
          ))}
        </StyledSelect>
      </Box>

      <Box>
        <Label>SET A PRICE</Label>
        <FormControl variant="standard" fullWidth>
          <StyledInput
            placeholder="Amount"
            endAdornment={
              <InputAdornment position="end">
                <StyledSelect size="small" value={priceUnit} onChange={onChangeUnit}>
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
    </Stack>
  );
}
