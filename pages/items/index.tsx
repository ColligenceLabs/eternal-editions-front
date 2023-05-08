import { ReactElement } from 'react';
import { styled } from '@mui/material/styles';
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from 'src/config';
import { getAllPosts } from 'src/utils/get-mardown/travel/posts';
import Layout from 'src/layouts';
import { Page } from 'src/components';
import { Container } from '@mui/material';
import { getAllCaseStudies } from 'src/utils/get-mardown/marketing/case-studies';
import PageHeader from 'src/components/common/PageHeader';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    paddingBottom: HEADER_MOBILE_HEIGHT,
    paddingTop: HEADER_MOBILE_HEIGHT,
    [theme.breakpoints.up('md')]: {
        paddingTop: HEADER_DESKTOP_HEIGHT,
        paddingBottom: HEADER_DESKTOP_HEIGHT,
    },
}));

// ----------------------------------------------------------------------

type Props = {};

export default function ItemsPage({}: Props) {
    return (
        <Page title="Tickets">
            <RootStyle>
                <Container sx={{ mt: 3, mr: { sx: 0 } }}>
                    <PageHeader title="ITEMS" />

                    {/*ITEMS 목록*/}
                    Items List
                </Container>
            </RootStyle>
        </Page>
    );
}

// ----------------------------------------------------------------------

ItemsPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout verticalAlign="top">{page}</Layout>;
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
