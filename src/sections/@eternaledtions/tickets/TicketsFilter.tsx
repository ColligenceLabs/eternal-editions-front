import {useState} from 'react';
// @mui
import {Box, Button, Stack, Tab, Tabs, Typography} from '@mui/material';
// @types
import {CaseStudyProps} from '../../../@types/marketing';
//
import Masonry from "@mui/lab/Masonry";
import TicketPostItem from "./TicketPostItem";
import {BlogPostProps} from "../../../@types/blog";
import {Iconify} from "../../../components";
import arrowDown from "@iconify/icons-carbon/arrow-down";
import {TicketsFiltersProps} from "../../../@types/eternaleditions/tickets";
import TicketSortByFilter from "./TicketSortByFilter";
import {SelectChangeEvent} from "@mui/material/Select";
import {CategoryProps, TicketProps} from "../../../@types/ticket/ticket";
import {useTheme} from "@mui/material/styles";

// ----------------------------------------------------------------------

type Props = {
    tickets: TicketProps[];
    categories: string[];
};

const defaultValues = {
    filterSortBy: '',
};

export default function TicketsFilter({tickets, categories}: Props) {

    const theme = useTheme();
    const [selected, setSelected] = useState('All');
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
    return (
        <>
            <Stack direction="row" sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
                <Box sx={{
                    pb: {xs: 2, md: 3},
                    flexGrow: 1,
                }}>
                    <Tabs
                        value={selected}
                        scrollButtons="auto"
                        variant="scrollable"
                        allowScrollButtonsMobile
                        onChange={handleChangeCategory}>

                        {categories.map((category) => (
                            <Tab
                                key={category}
                                value={category}
                                label={<Typography variant="body2" sx={{fontSize: '14px'}}>{category}</Typography>}
                            />
                        ))}

                    </Tabs>
                </Box>

                {/*<TicketSortByFilter filterSortBy={filters.filterSortBy} onChangeSortBy={handleChangeSortBy}/>*/}
            </Stack>

            {tickets &&
                <Masonry columns={{xs: 1, md: 2}} spacing={2}>
                    {tickets.map((ticket, index) => (
                        <TicketPostItem key={index} ticket={ticket}/>
                    ))}
                </Masonry>}

            <Stack
                alignItems="center"
                sx={{
                    pt: 8,
                    pb: {xs: 8, md: 10},
                }}
            >
                <Button
                    size="large"
                    color="inherit"
                    variant="outlined"
                    endIcon={<Iconify icon={arrowDown} sx={{width: 20, height: 20}}/>}
                    sx={{color : 'common.white'}}
                >
                    LOAD MORE
                </Button>
            </Stack>
        </>
    );
}

// ----------------------------------------------------------------------
