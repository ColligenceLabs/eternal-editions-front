import { Typography, Grid } from '@mui/material';
import { JobItemSkeleton } from 'src/components';
import { useEffect, useState } from 'react';
import TicketItem from '../@eternaledtions/tickets/TicketItem';
import { useSelector } from 'react-redux';
import { getMyTickets } from '../../services/services';
import { SUCCESS } from '../../config';

// ----------------------------------------------------------------------

type Props = { loading?: boolean };

export default function MyTicketList({ loading }: Props) {
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
  return (
    <>
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
        <Typography textAlign="center" color="grey" sx={{ py: 5 }}>
          No items hav been registered.
        </Typography>
      )}
    </>
  );
}
