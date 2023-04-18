import { useEffect, useState } from 'react';
// @mui
import { Box, Button, Stack, Tab, Tabs, Typography } from '@mui/material';
// @types
import { CaseStudyProps } from '../../../@types/marketing';
//
import Masonry from '@mui/lab/Masonry';
import TicketPostItem from './TicketPostItem';
import { BlogPostProps } from '../../../@types/blog';
import { Iconify } from '../../../components';
import arrowDown from '@iconify/icons-carbon/arrow-down';
import { TicketsFiltersProps } from '../../../@types/eternaleditions/tickets';
import TicketSortByFilter from './TicketSortByFilter';
import { SelectChangeEvent } from '@mui/material/Select';
import { CategoryProps, TicketProps } from '../../../@types/ticket/ticket';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { getTicketsService } from '../../../services/services';
import { SUCCESS } from '../../../config';
import { TicketInfoTypes } from '../../../@types/ticket/ticketTypes';
// import { isMobile } from 'react-device-detect';
import { useResponsive } from '../../../hooks';

// ----------------------------------------------------------------------

type Props = {
  tickets: TicketProps[];
  categories: string[];
};

const defaultValues = {
  filterSortBy: '',
};

export default function TicketsFilter({ tickets, categories }: Props) {
  const isMobile = useResponsive('down', 'sm');
  const theme = useTheme();
  const [curPage, setCurPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [lastPage, setLastPage] = useState(0);
  const [selected, setSelected] = useState('All');
  const [ticketInfoList, setTicketInfoList] = useState<TicketInfoTypes[]>([]);
  categories = ['All', ...Array.from(new Set(categories))];

  const [filters, setFilters] = useState<TicketsFiltersProps>(defaultValues);

  const handleChangeCategory = (event: React.SyntheticEvent, newValue: string) => {
    setSelected(newValue);
  };

  const handleChangeSortBy = (keyword: string | null) => {
    setFilters({
      ...filters,
      filterSortBy: keyword,
    });
  };

  const getTickets = async () => {
    const res = await getTicketsService(1, perPage, selected);
    console.log(res);
    if (res.status === 200) {
      setTicketInfoList(res.data.list);
      setLastPage(res.data.headers.x_pages_count);
    }
  };

  const getMoreTickets = async () => {
    const res = await getTicketsService(curPage, perPage, selected);
    if (res.status === 200) {
      setTicketInfoList((cur) => [...cur, ...res.data.list]);
    }
  };

  useEffect(() => {
    setCurPage(1);
    getTickets();
  }, [selected]);

  useEffect(() => {
    if (curPage !== 1) getMoreTickets();
  }, [curPage]);

  return (
    <>
      <Stack
        direction="row"
        sx={{
          display: 'flex',
          alignItems: 'center',
          mx: {
            xs: -2.5,
            md: 0,
          },
        }}
      >
        <Box
          sx={{
            pb: { xs: 1, md: 3 },
            flexGrow: 1,
            // width: isMobile ? 330 : '100%',
            /* 2023.04.18 320px 화면에서 깨지는 현상 수정 */
            width: '100%',
          }}
        >
          <Tabs
            value={selected}
            scrollButtons="auto"
            variant="scrollable"
            allowScrollButtonsMobile
            onChange={handleChangeCategory}
          >
            {categories.map((category) => (
              <Tab
                key={category}
                value={category}
                label={
                  <Typography variant="body2" sx={{ fontSize: '14px' }}>
                    {category}
                  </Typography>
                }
              />
            ))}
          </Tabs>
        </Box>

        {/*<TicketSortByFilter filterSortBy={filters.filterSortBy} onChangeSortBy={handleChangeSortBy}/>*/}
      </Stack>

      {ticketInfoList && (
        <Masonry columns={{ xs: 1, md: 2 }} spacing={2}>
          {ticketInfoList.map((ticket, index) => (
            <TicketPostItem key={index} ticket={ticket} />
          ))}
        </Masonry>
      )}

      {/*{ticketInfoList && (*/}
      {/*  <Masonry columns={{ xs: 1, md: 2 }} spacing={2}>*/}
      {/*    {ticketInfoList.map((ticket, index) => (*/}
      {/*      <TicketPostItem key={index} ticketInfo={ticket} />*/}
      {/*    ))}*/}
      {/*  </Masonry>*/}
      {/*)}*/}

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
