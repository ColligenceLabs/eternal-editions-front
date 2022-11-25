import {ReactElement} from 'react';
// @mui
import {styled} from '@mui/material/styles';
// config
import {HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT} from '../../src/config';
// utils
import {getAllPosts} from '../../src/utils/get-mardown/travel/posts';
// @types
// _data
// layouts
import Layout from '../../src/layouts';
// components
import {Page} from '../../src/components';
import {Container} from "@mui/material";
import {getAllCaseStudies} from "../../src/utils/get-mardown/marketing/case-studies";
import TicketsFilter from "../../src/sections/@eternaledtions/tickets/TicketsFilter";
import PageHeader from "../../src/components/common/PageHeader";
import {TicketProps} from "../../src/@types/ticket/ticket";
import TICKET from "../../src/sample/ticket";
// sections

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({theme}) => ({
    paddingTop: HEADER_MOBILE_HEIGHT,
    [theme.breakpoints.up('md')]: {
        paddingTop: HEADER_DESKTOP_HEIGHT,
    },
}));

// ----------------------------------------------------------------------

type Props = {};

export default function TicketPage({}: Props) {

    const tickets: TicketProps[] = TICKET.tickets;
    const categories: string[] = TICKET.categories;

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
