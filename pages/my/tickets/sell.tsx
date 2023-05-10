import { ReactElement } from 'react';
import Layout from 'src/layouts';
import { Page } from 'src/components';
import { Container } from '@mui/material';
import MyTicketSell from 'src/sections/@my/MyTicketSell';
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from 'src/config';

// ----------------------------------------------------------------------

export default function MyTicketSellPage() {
  return (
    <Page title="Sell">
      <Container
        sx={{
          height: '100vh',
          paddingTop: {
            xs: `${HEADER_MOBILE_HEIGHT}px`,
            md: `${HEADER_DESKTOP_HEIGHT}px`,
          },
          paddingBottom: {
            xs: '32px',
            md: '45px',
          },
        }}
      >
        <MyTicketSell />
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

MyTicketSellPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout
      verticalAlign="top"
      background={{
        backgroundImage: `url(/assets/background/bg-my-items-sell.jpg)`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
      disabledFooter
    >
      {page}
    </Layout>
  );
};
