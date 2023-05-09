import { ReactElement } from 'react';
import Layout from 'src/layouts';
import { Page } from 'src/components';
import { Container } from '@mui/material';
import MyTicketSell from 'src/sections/@my/MyTicketSell';

// ----------------------------------------------------------------------

export default function MyTicketSellPage() {
  return (
    <Page title="Sell">
      <Container sx={{ py: '45px', height: '100vh' }}>
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
      disabledHeader
      disabledFooter
    >
      {page}
    </Layout>
  );
};
