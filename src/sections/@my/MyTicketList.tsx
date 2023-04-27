// @mui
import { Box, Pagination, Stack, Tab, Tabs, Typography, Grid } from '@mui/material';
// import TicketItem from "../@eternaledtions/tickets/TicketItem";
import { JobItemSkeleton } from '../../components';
import { MYTicketProps, TicketProps } from '../../@types/ticket/ticket';
import { useEffect, useState } from 'react';
import { TicketsFiltersProps } from '../../@types/eternaleditions/tickets';
import TicketItem from '../@eternaledtions/tickets/TicketItem';
import { useSelector } from 'react-redux';
import { getMyTickets } from '../../services/services';
import { SUCCESS } from '../../config';

// ----------------------------------------------------------------------

type Props = { tickets: MYTicketProps[]; loading?: boolean };

const defaultValues = {
  filterSortBy: '',
};

export default function MyTicketList({ tickets, loading }: Props) {
  const { user } = useSelector((state: any) => state.webUser);
  const [myTicketList, setMyTicketList] = useState([]);
  const getMyTicketList = async () => {
    const res = await getMyTickets(user.uid);
    if (res.data.status === SUCCESS) {
      setMyTicketList(res.data.data);
    }
  };
  useEffect(() => {
    if (user.uid) getMyTicketList();
  }, [user]);

  const [selected, setSelected] = useState('All');
  const [filters, setFilters] = useState<TicketsFiltersProps>(defaultValues);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setSelected(newValue);
  };

  return (
    <>
      {/*<Stack direction="row" sx={{display: 'flex', alignItems: 'center', width: '100%'}}>*/}
      {/*    <Box sx={{*/}
      {/*        pb: {xs: 2, md: 3},*/}
      {/*        flexGrow: 1,*/}
      {/*    }}>*/}
      {/*        <Tabs*/}
      {/*            value={selected}*/}
      {/*            scrollButtons="auto"*/}
      {/*            variant="scrollable"*/}
      {/*            allowScrollButtonsMobile*/}
      {/*            onChange={handleChangeTab}>*/}

      {/*            {["Available Tickets", "Ticket History"].map((category) => (*/}
      {/*                <Tab*/}
      {/*                    key={category}*/}
      {/*                    value={category}*/}
      {/*                    label={<Typography variant="body2" sx={{fontSize: '14px'}}>{category}</Typography>}*/}
      {/*                />*/}
      {/*            ))}*/}

      {/*        </Tabs>*/}
      {/*    </Box>*/}

      {/*    /!*<TicketSortByFilter filterSortBy={filters.filterSortBy} onChangeSortBy={handleChangeSortBy}/>*!/*/}
      {/*</Stack>*/}

      {/*{tickets.map((ticket, index) => {*/}
      {/*  console.log(ticket, 'ticket - ' + index);*/}
      {/*  return <TicketItem key={ticket.slug} ticket={ticket} />;*/}
      {/*})}*/}

      {loading ? (
        <Grid container spacing={1}>
          <Grid item>
            <JobItemSkeleton />
          </Grid>
          <Grid item>
            <JobItemSkeleton />
          </Grid>
          <Grid item>
            <JobItemSkeleton />
          </Grid>
        </Grid>
      ) : myTicketList.length ? (
        <Grid container spacing={2}>
          {myTicketList.map((ticket, index) => (
            <TicketItem key={index} ticket={ticket} />
          ))}
        </Grid>
      ) : (
        'Data not found'
      )}
    </>
  );
}
