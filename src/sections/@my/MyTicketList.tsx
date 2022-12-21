// @mui
import {Box, Pagination, Stack, Tab, Tabs, Typography} from '@mui/material';
// import TicketItem from "../@eternaledtions/tickets/TicketItem";
import {JobItemSkeleton} from "../../components";
import {MYTicketProps, TicketProps} from "../../@types/ticket/ticket";
import {useState} from "react";
import {TicketsFiltersProps} from "../../@types/eternaleditions/tickets";


// ----------------------------------------------------------------------

type Props = {
    tickets: MYTicketProps[];
    loading?: boolean;
};

const defaultValues = {
    filterSortBy: '',
};


export default function MyTicketList({tickets, loading}: Props) {
    console.log(loading, 'loading');

    const [selected, setSelected] = useState('All');

    const [filters, setFilters] = useState<TicketsFiltersProps>(defaultValues);

    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setSelected(newValue);
    };

    return (
        <>
            <Stack spacing={1}>
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


                {!loading ?? <JobItemSkeleton />}
                {/* {tickets.map((ticket, index) => {
                        console.log(ticket, 'ticket - ' + index);
                        return <TicketItem key={ticket.slug} ticket={ticket}/>;
                    }
                )} */}
            </Stack>
        </>
    );
}
