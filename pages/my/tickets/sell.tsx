import { ReactElement } from 'react';
import Layout from 'src/layouts';
import { Page } from 'src/components';
import { Container, useTheme } from '@mui/material';
import MyTicketSell from 'src/sections/@my/MyTicketSell';
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from 'src/config';
import FixedBackground from 'src/components/common/FixedBackground';

// ----------------------------------------------------------------------

export default function MyTicketSellPage() {
  const theme = useTheme();

  return (
    <Page title="Sell">
      <FixedBackground url={`url(/assets/background/bg-my-items-sell.jpg)`} />

      <Container
        sx={{
          paddingTop: `${HEADER_MOBILE_HEIGHT}px`,
          paddingBottom: '32px',
          [theme.breakpoints.up('md')]: {
            paddingTop: `${HEADER_DESKTOP_HEIGHT}px`,
            paddingBottom: '45px',
            height: '100vh',
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
    <Layout verticalAlign="top" disabledFooter>
      {page}
    </Layout>
  );
};
