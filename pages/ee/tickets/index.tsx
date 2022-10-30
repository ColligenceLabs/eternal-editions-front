import {ReactElement} from 'react';
// @mui
import {styled} from '@mui/material/styles';
// config
import {HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT} from '../../../src/config';
// utils
import {getAllPosts} from '../../../src/utils/get-mardown/travel/posts';
// @types
import {BlogPostProps} from '../../../src/@types/blog';
// _data
// layouts
import Layout from '../../../src/layouts';
// components
import {Iconify, Page} from '../../../src/components';
import {Button, Container, Stack} from "@mui/material";
import TicketPostItem from "../../../src/sections/@eternaledtions/tickets/TicketPostItem";
import Masonry from "@mui/lab/Masonry";
import arrowDown from "@iconify/icons-carbon/arrow-down";
import {getAllCaseStudies} from "../../../src/utils/get-mardown/marketing/case-studies";
import {CaseStudyProps} from "../../../src/@types/marketing";
import TicketsFilter from "../../../src/sections/@eternaledtions/tickets/TicketsFilter";
// sections

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({theme}) => ({
    paddingTop: HEADER_MOBILE_HEIGHT,
    [theme.breakpoints.up('md')]: {
        paddingTop: HEADER_DESKTOP_HEIGHT,
    },
}));

// ----------------------------------------------------------------------

type Props = {
    posts: BlogPostProps[];
    caseStudies: CaseStudyProps[];
};

export default function EEAboutUsPage({posts, caseStudies}: Props) {
    return (
        <Page title="Tickets">
            <RootStyle>
                <Container sx={{mt: 3}}>

                    <TicketsFilter posts={posts} caseStudies={caseStudies}/>

                </Container>
            </RootStyle>
        </Page>
    );
}

// ----------------------------------------------------------------------

EEAboutUsPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export async function getStaticProps() {
    return {
        props: {
            posts: getAllPosts(),
            caseStudies: getAllCaseStudies(),
        },
    };
}
