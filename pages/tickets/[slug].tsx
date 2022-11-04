import {ReactElement} from 'react';
// @mui
import {styled} from '@mui/material/styles';
import {Button, Container, Divider, Grid, Stack} from '@mui/material';
// routes
// utils
// config
import {HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT} from '../../src/config';
// @types
// layouts
import Layout from '../../src/layouts';
// components
import {Page} from '../../src/components';
// sections
import {useRouter} from "next/router";
import {useResponsive} from "../../src/hooks";

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT + 30,
  paddingBottom: 30,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT + 30,
    paddingBottom: 30
  },
  // background: 'red'
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
              {/*<Image*/}
              {/*    alt="photo"*/}
              {/*    src={'https://dummyimage.com/900x900/000/fff'}*/}
              {/*    ratio="1/1"*/}
              {/*    sx={{ borderRadius: 2, cursor: 'pointer' }}*/}
              {/*/>*/}
            </Grid>


            <Grid item xs={12} md={7} lg={6}>
              {'주최자'}
              <br/>
              {'공연명'}
              <br/>
              {'티켓명'}
              <br/>
              {'기간'}
              <br/>
              <br/>
              {'금액 정보'}
              <br/>
              <Divider/>

              <Stack spacing={1} direction={"row"} sx={{mt:3, mb:3}}>
                <Button variant="contained">EDC 결제</Button>
                <Button variant="contained">MATIC 결제</Button>
              </Stack>

              <Divider/>
              <br/>
              {'공연 정보 요약'}
              <br/>
              <Button >공연 상세 정보 (모달)</Button>
              <br/>



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
