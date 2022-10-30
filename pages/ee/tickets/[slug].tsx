import {ReactElement} from 'react';
// @mui
import {styled} from '@mui/material/styles';
import {Container, Grid} from '@mui/material';
// routes
// utils
// config
import {HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT} from '../../../src/config';
// @types
// layouts
import Layout from '../../../src/layouts';
// components
import {Image, Page} from '../../../src/components';
// sections
import {TicketProps} from "../../../src/@types/ticket/ticket";
import {useRouter} from "next/router";
import {useResponsive} from "../../../src/hooks";
import {TravelTourReserveForm} from "../../../src/sections/@travel";

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT + 30,
  paddingBottom: 30,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT + 30,
    paddingBottom: 30
  },
  background: 'red'
}));

// ----------------------------------------------------------------------

// type Props = {
//   ticket: TicketProps;
//   tickets: TicketProps[];
// };

export default function TicketDetailPage() {
  const isDesktop = useResponsive('up', 'md');
  const router = useRouter();
  const { slug } = router.query;

  return (
    <Page title={`${slug} - Ticket`}>
      <RootStyle>

        <Container>
          <Grid container spacing={8} direction="row">
            <Grid item xs={12} md={5} lg={6}>
              <Image
                  alt="photo"
                  src={'https://dummyimage.com/900x900/000/fff'}
                  ratio="1/1"
                  sx={{ borderRadius: 2, cursor: 'pointer' }}
              />
            </Grid>
            <Grid item xs={12} md={7} lg={6}>
              2
            </Grid>
          </Grid>

        </Container>

      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

TicketDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

type Params = {
  params: {
    slug: string;
  };
};
