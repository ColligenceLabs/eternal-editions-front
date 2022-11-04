import {useState} from 'react';
// @mui
import {Box, Button, Stack, Tab, Tabs} from '@mui/material';
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

// ----------------------------------------------------------------------

type Props = {
    posts: BlogPostProps[];
    caseStudies: CaseStudyProps[];
};

const defaultValues = {
    filterSortBy: '',
};

export default function TicketsFilter({posts, caseStudies}: Props) {
    const [selected, setSelected] = useState('All');

    const getCategories = caseStudies.map((project) => project.frontmatter.category);

    const categories = ['All', ...Array.from(new Set(getCategories))];

    const filtered = applyFilter(caseStudies, selected);

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
            <Stack direction="row">
                <Box
                    sx={{
                        pb: {xs: 2, md: 3},
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
                            <Tab key={category} value={category} label={category}/>
                        ))}
                    </Tabs>
                </Box>

                <TicketSortByFilter filterSortBy={filters.filterSortBy} onChangeSortBy={handleChangeSortBy} />
            </Stack>

            <Masonry columns={{xs: 1, md: 2}} spacing={2}>
                {posts.map((post, index) => (
                    <TicketPostItem key={index} post={post}/>
                ))}
            </Masonry>

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
                >
                    Load more
                </Button>
            </Stack>
        </>
    );
}

// ----------------------------------------------------------------------

function applyFilter(arr: CaseStudyProps[], category: string) {
    if (category !== 'All') {
        arr = arr.filter((project) => project.frontmatter.category === category);
    }
    return arr;
}
