// @mui
import {Box, Pagination} from '@mui/material';
import TicketItem from "../@eternaledtions/tickets/TicketItem";
import {JobItemSkeleton} from "../../components";
import {TicketProps} from "../../@types/ticket/ticket";


// ----------------------------------------------------------------------

type Props = {
  tickets: TicketProps[];
  loading?: boolean;
};

export default function MyTicketList({ tickets, loading }: Props) {
  return (
    <>
      <Box
        sx={{
          display: 'grid',
          rowGap: { xs: 4, md: 5 },
          columnGap: 4,
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
        }}
      >
        {loading ?? tickets.map((ticket, index) =>
            ticket ? <TicketItem key={ticket.slug} ticket={ticket} /> : <JobItemSkeleton key={index} />
        )}
      </Box>
    </>
  );
}
