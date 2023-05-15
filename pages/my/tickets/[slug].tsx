import { ReactElement } from 'react';
import Layout from 'src/layouts';
import { Page } from 'src/components';
import { Container, useTheme } from '@mui/material';
import MyTicketSell from 'src/sections/@my/MyTicketSell';
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from 'src/config';

// ----------------------------------------------------------------------

export default function MyTicketSellPage() {
  const theme = useTheme();

  return (
    <Page title="Sell">
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
    <Layout
      verticalAlign="top"
      background={{
        backgroundImage: `url(/assets/background/bg-my-items-sell.jpg)`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
      disabledFooter
    >
      {page}
    </Layout>
  );
};
