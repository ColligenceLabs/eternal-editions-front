import { useEffect, useState } from 'react';
import { Box, Grid, Button, Stack, Tab, Tabs, Typography, tabClasses } from '@mui/material';
import TicketPostItem from './TicketPostItem';
import { Iconify } from 'src/components';
import arrowDown from '@iconify/icons-carbon/arrow-down';
import { useTheme } from '@mui/material/styles';
import { getTicketCountByCategory, getTicketsService } from 'src/services/services';
import { SUCCESS } from 'src/config';
import { TicketInfoTypes } from 'src/@types/ticket/ticketTypes';
import { useResponsive } from 'src/hooks';

// ----------------------------------------------------------------------

type Props = {
  categories: string[];
};

type CategoryTypes = {
  category: string;
  count: string;
};

export default function TicketsFilter({ categories: originCategories }: Props) {
  const isMobile = useResponsive('down', 'sm');
  const theme = useTheme();
  const [curPage, setCurPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [selected, setSelected] = useState('All');
  const [ticketInfoList, setTicketInfoList] = useState<TicketInfoTypes[]>([]);
  const [categories, setCategories] = useState<CategoryTypes[]>([]);

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
            pb: { xs: 2, md: 5 },
            flexGrow: 1,
            // width: isMobile ? 330 : '100%',
            /* 2023.04.18 320px 화면에서 깨지는 현상 수정 */
            width: '100%',
          }}
        >
          <Tabs
            value={selected.toLowerCase()}
            variant="scrollable"
            TabIndicatorProps={{ sx: { display: 'none' } }}
            onChange={handleChangeCategory}
          >
            {categories.map((category: CategoryTypes) => {
              if (category.category !== '')
                return (
                  <Tab
                    key={category.category}
                    value={category.category}
                    label={
                      <Stack
                        flexDirection="row"
                        useFlexGap
                        gap="10px"
                        sx={{
                          fontSize: '14px',
                          textTransform: 'uppercase',
                          padding: {
                            xs: '10px 12px',
                            md: '10px 16px',
                          },
                        }}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          {category.category}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: 'red' }}>
                          {category.count}
                        </Typography>
                      </Stack>
                    }
                    sx={{
                      [`&.${tabClasses.root}`]: {
                        opacity: 0.6,
                        color: 'white',
                        [theme.breakpoints.down('md')]: {
                          background: 'rgba(0, 0, 0, 0.24)',
                          backdropFilter: 'blur(50px)',
                          borderRadius: '60px',
                        },
                      },
                      [`&.${tabClasses.selected}`]: {
                        opacity: 1,
                      },
                      [`&.${tabClasses.root}:first-of-type`]: {
                        ml: {
                          xs: 2.5,
                          md: 0,
                        },
                      },
                      [`&.${tabClasses.root}:not(:last-of-type)`]: {
                        mr: {
                          xs: 0.25,
                          md: 0.5,
                        },
                      },
                    }}
                  />
                );
            })}
          </Tabs>
        </Box>

        {/*<TicketSortByFilter filterSortBy={filters.filterSortBy} onChangeSortBy={handleChangeSortBy}/>*/}
      </Stack>

      {/* {ticketInfoList && (
        <Masonry columns={{ xs: 1, md: 2 }} spacing={2} sx={{ width: 'auto' }}>
          {ticketInfoList.map((ticket, index) => (
            <TicketPostItem key={index} ticket={ticket} />
          ))}
        </Masonry>
      )} */}
      {ticketInfoList.length ? (
        <Grid container spacing={3}>
          {ticketInfoList.map((ticket, index) => (
            <TicketPostItem key={index} ticket={ticket} />
          ))}
        </Grid>
      ) : (
        <Typography textAlign="center" color="grey" sx={{ py: 5 }}>
          No items hav been registered.
        </Typography>
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
