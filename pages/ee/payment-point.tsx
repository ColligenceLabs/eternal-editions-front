import { ReactElement } from 'react';
import Layout from 'src/layouts';
import { Page } from 'src/components';
import { Container, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from 'src/config';
import PaymentPoint from 'src/sections/@my/PaymentPoint';

// ----------------------------------------------------------------------
const RootStyle = styled('div')(({ theme }) => ({
  paddingBottom: HEADER_MOBILE_HEIGHT,
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
    paddingBottom: HEADER_DESKTOP_HEIGHT,
  },
}));

type Props = {};

export default function PaymentPointPage({}: Props) {
  return (
    <Page title="Account">
      <RootStyle>
        <Container maxWidth={'sm'}>
          <Stack spacing={2} sx={{ mb: 10 }}>
            {/* <Typography variant="h3" sx={{ textAlign: 'center' }}>
              Buy with Debit <br />
              or Credit Card
            </Typography> */}

            <PaymentPoint />
          </Stack>
        </Container>
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

PaymentPointPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout
      background={{
        backgroundImage: `url(/assets/background/bg-account.jpg)`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
      verticalAlign="top"
    >
      {page}
    </Layout>
  );
};

