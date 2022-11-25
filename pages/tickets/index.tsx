import {ReactElement} from 'react';
// @mui
import {styled} from '@mui/material/styles';
// config
import {HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT} from '../../src/config';
// utils
import {getAllPosts} from '../../src/utils/get-mardown/travel/posts';
// @types
import {BlogPostProps} from '../../src/@types/blog';
// _data
// layouts
import Layout from '../../src/layouts';
// components
import {Iconify, Page} from '../../src/components';
import {Button, Container, Stack} from "@mui/material";
import TicketPostItem from "../../src/sections/@eternaledtions/tickets/TicketPostItem";
import Masonry from "@mui/lab/Masonry";
import arrowDown from "@iconify/icons-carbon/arrow-down";
import {getAllCaseStudies} from "../../src/utils/get-mardown/marketing/case-studies";
import {CaseStudyProps} from "../../src/@types/marketing";
import TicketsFilter from "../../src/sections/@eternaledtions/tickets/TicketsFilter";
import PageHeader from "../../src/components/common/PageHeader";
import {MDXRemoteSerializeResult} from "next-mdx-remote";
import {TicketProps} from "../../src/@types/ticket/ticket";
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
};

export default function TicketPage({}: Props) {

    const tickets: TicketProps[] = [{
        slug: 'string',
        tokenId: 'string',
        title: 'string',
        subtitle: 'string',
        description: 'string',
        status: 'string',
        createdAt: '2020-03-16T05:35:07.322Z',
        background: 'string'
    }];
    const categories: string[] = ["ART", "COMMUNITY", "MUSIC", "TICKET"];

    return (
        <Page title="Tickets">
            <RootStyle>
                <Container sx={{mt: 3}}>

                    <PageHeader title="TICKET"/>

                    {/*티켓 목록*/}
                    <TicketsFilter tickets={tickets} categories={categories}/>

                </Container>
            </RootStyle>
        </Page>
    );
}

// ----------------------------------------------------------------------

TicketPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export async function getStaticProps() {
    return {
        props: {
            posts: getAllPosts(),
            categories: getAllCaseStudies(),
        },
    };
}
