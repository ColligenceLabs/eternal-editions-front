// @mui
import {Box, Pagination, Stack} from '@mui/material';
import TicketItem from "../@eternaledtions/tickets/TicketItem";
import {JobItemSkeleton} from "../../components";
import {MYTicketProps, TicketProps} from "../../@types/ticket/ticket";


// ----------------------------------------------------------------------

type Props = {
    tickets: MYTicketProps[];
    loading?: boolean;
};

export default function MyTicketList({tickets, loading}: Props) {
    console.log(loading, 'loading');
    return (
        <>
            <Stack spacing={1}>
                {!loading ?? <JobItemSkeleton />}
                {tickets.map((ticket, index) => {
                        console.log(ticket, 'ticket - ' + index);
                        return <TicketItem key={ticket.slug} ticket={ticket}/>;
                    }
                )}
            </Stack>
        </>
    );
}
