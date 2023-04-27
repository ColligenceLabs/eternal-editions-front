// @mui
import { Autocomplete, Box, InputAdornment, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SearchNotFound } from 'src/components';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

// ----------------------------------------------------------------------

const SORT_TYPES = ['Latest', 'Floor Price', 'TEST'];

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
  width: '100%',
  '& .MuiAutocomplete-root': {
    '& .MuiInputAdornment-root': {
      marginTop: '0 !important',
    },
    '& .MuiFilledInput-root': {
      height: 56,
      padding: '0 12px',
    },
  },
}));

type Props = {
  filterSortBy: string | null;
  onChangeSortBy: (keyword: string | null) => void;
};

export default function TicketSortByFilter({ filterSortBy, onChangeSortBy }: Props) {
  return (
    <RootStyle>
      <Autocomplete
        autoHighlight
        options={SORT_TYPES}
        getOptionLabel={(option) => option}
        value={filterSortBy}
        onChange={(event, value) => onChangeSortBy(value)}
        noOptionsText={<SearchNotFound keyword={filterSortBy} />}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="filled"
            placeholder="Sort By"
            InputProps={{
              ...params.InputProps,
              autoComplete: 'search',
              startAdornment: (
                <InputAdornment position="start">
                  {/*<Iconify*/}
                  {/*    icon={inventoryManagement}*/}
                  {/*    sx={{ width: 24, height: 24, color: 'text.disabled', flexShrink: 0, mr: 1 }}*/}
                  {/*/>*/}
                </InputAdornment>
              ),
            }}
          />
        )}
        renderOption={(props, option, { inputValue }) => {
          const matches = match(option, inputValue);
          const parts: {
            text: string;
            highlight: boolean;
          }[] = parse(option, matches);
          return (
            <Box component="li" {...props}>
              {parts.map((part, index) => (
                <Box
                  key={index}
                  component="span"
                  sx={{
                    ...(part.highlight && {
                      fontWeight: 'fontWeightBold',
                    }),
                  }}
                >
                  {part.text}
                </Box>
              ))}
            </Box>
          );
        }}
      />
    </RootStyle>
  );
}
