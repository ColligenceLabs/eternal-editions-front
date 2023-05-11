import { ReactElement } from 'react';
import { styled } from '@mui/material/styles';
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from 'src/config';
import { getAllPosts } from 'src/utils/get-mardown/travel/posts';
import Layout from 'src/layouts';
import { Page } from 'src/components';
import { Container } from '@mui/material';
import { getAllCaseStudies } from 'src/utils/get-mardown/marketing/case-studies';
import TicketsFilter from 'src/sections/@eternaledtions/tickets/TicketsFilter';
import PageHeader from 'src/components/common/PageHeader';
import TICKET from 'src/sample/ticket';

const RootStyle = styled('div')(({ theme }) => ({
  paddingBottom: HEADER_MOBILE_HEIGHT,
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
    paddingBottom: HEADER_DESKTOP_HEIGHT,
  },
}));

type Props = {};

export default function TicketPage({}: Props) {
  const categories: string[] = TICKET.categories;

  return (
    <Page title="DROPS">
      <RootStyle>
        <Container sx={{ mt: 3, mr: { sx: 0 } }}>
          <PageHeader title="DROPS" tooltipMessage="Guide text to describe DROPS." />

          {/*티켓 목록*/}
          <TicketsFilter categories={categories} />
        </Container>
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

TicketPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout
      verticalAlign="top"
      background={{
        backgroundImage: {
          xs: `url(/assets/background/bg-main.jpg)`,
          md: `url(/assets/background/bg-drops.jpg)`,
        },
        backgroundPosition: 'bottom center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      {page}
    </Layout>
  );
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
