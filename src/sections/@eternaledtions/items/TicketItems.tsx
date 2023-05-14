import { useEffect, useState } from 'react';
import { Box, Grid, Button, Stack, Typography } from '@mui/material';
import TicketItem from './TicketItem';
import { Iconify } from 'src/components';
import arrowDown from '@iconify/icons-carbon/arrow-down';
import { getTicketCountByCategory, getTicketsService } from 'src/services/services';
import { SUCCESS } from 'src/config';
import { TicketInfoTypes } from 'src/@types/ticket/ticketTypes';
import { useResponsive } from 'src/hooks';
import CategoryTabs from 'src/components/CategoryTabs';
import { TextSelect, TextSelectOption } from 'src/components/common/Select';

const COLLECTIONS = [
  {
    label: 'Team Yellow',
    value: 'yellow',
  },
  {
    label: 'Team Purple',
    value: 'purple',
  },
];

// ----------------------------------------------------------------------

type Props = {
  categories?: string[];
  shouldHideCategories?: boolean;
};

type CategoryTypes = {
  category: string;
  count: string;
};

export default function TicketItems({ categories: originCategories, shouldHideCategories }: Props) {
  const [curPage, setCurPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [selected, setSelected] = useState('All');
  const [ticketInfoList, setTicketInfoList] = useState<TicketInfoTypes[]>([]);
  const [categories, setCategories] = useState<CategoryTypes[]>([]);
  const [collection, setCollection] = useState('default');
  const [salesType, setSalesType] = useState('default');

  originCategories = ['All', ...Array.from(new Set(originCategories))];
  const perPage = 6;

  const handleChangeCategory = (event: React.SyntheticEvent, newValue: string) => {
    setSelected(newValue);
  };

  const getTickets = async () => {
    console.log(selected);
    const res = await getTicketsService(1, perPage, selected);
    console.log(res);
    if (res.status === 200) {
      setTicketInfoList(res.data.list);
      setLastPage(res.data.headers.x_pages_count);
    }
  };

  const getMoreTickets = async () => {
    const res = await getTicketsService(curPage, perPage, selected);
    console.log(res);
    if (res.status === 200) {
      setTicketInfoList((cur) => [...cur, ...res.data.list]);
    }
  };

  const getCountByCategory = async () => {
    const res = await getTicketCountByCategory();

    if (res.data.status === SUCCESS) setCategories(res.data.data);
    else {
      console.log('[error] item count by category fetch failed. ');
      const temp: CategoryTypes[] = originCategories.map((item) => ({
        category: item.toLowerCase(),
        count: '',
      }));
      setCategories([...temp]);
    }
  };

  useEffect(() => {
    setCurPage(1);
    getTickets();
    getCountByCategory();
  }, [selected]);

  useEffect(() => {
    if (curPage !== 1) getMoreTickets();
  }, [curPage]);

  return (
    <>
      <Stack
        direction="row"
        justifyContent={shouldHideCategories ? 'flex-end' : 'space-between'}
        alignItems="center"
        flexWrap="wrap"
        gap={1}
        sx={{
          mx: {
            xs: -2.5,
            md: 0,
          },
          pb: { xs: 2, md: 5 },
        }}
      >
        {!shouldHideCategories ? (
          <CategoryTabs
            categories={categories}
            value={selected.toLocaleLowerCase()}
            onChange={handleChangeCategory}
          />
        ) : null}

        <Stack
          flexDirection="row"
          gap="27px"
          sx={{
            ml: {
              xs: '20px',
              md: 0,
            },
          }}
        >
          <TextSelect
            value={collection}
            onChange={(event) => setCollection(event.target.value as string)}
          >
            <TextSelectOption hidden value="default">
              SELECT COLLECTION
            </TextSelectOption>
            {COLLECTIONS.map((collection) => (
              <TextSelectOption key={collection.value} value={collection.value}>
                {collection.label}
              </TextSelectOption>
            ))}
          </TextSelect>

          <TextSelect
            value={salesType}
            onChange={(event) => setSalesType(event.target.value as string)}
          >
            <TextSelectOption hidden value="default">
              SELECT SALES TYPE
            </TextSelectOption>
          </TextSelect>
        </Stack>
      </Stack>

      {ticketInfoList.length ? (
        <Grid container spacing={3}>
          {ticketInfoList.map((ticket, index) => (
            <TicketItem key={index} ticket={ticket} />
          ))}
        </Grid>
      ) : (
        <Typography textAlign="center" color="grey" sx={{ py: 5 }}>
          No items hav been registered.
        </Typography>
      )}

      {curPage < lastPage && (
        <Stack
          alignItems="center"
          sx={{
            pt: 8,
            pb: { xs: 8, md: 10 },
          }}
        >
          <Button
            size="large"
            color="inherit"
            variant="outlined"
            endIcon={<Iconify icon={arrowDown} sx={{ width: 20, height: 20 }} />}
            sx={{ color: 'common.white' }}
            onClick={() => {
              setCurPage((cur) => cur + 1);
            }}
          >
            LOAD MORE
          </Button>
        </Stack>
      )}
    </>
  );
}

// ----------------------------------------------------------------------
