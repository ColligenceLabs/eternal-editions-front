import { ReactElement, useEffect, useState } from 'react';
import Layout from 'src/layouts';
import { Page } from 'src/components';
import { Container, Grid, Stack } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from 'src/config';
import MyTicketList from 'src/sections/@my/MyTicketList';
import MyOldTicketList from 'src/sections/@my/MyOldTicketList';
import SideMenu from 'src/components/SideMenu';
import { useSelector } from 'react-redux';
import { getMyTickets, getOldMyTicketByUid } from 'src/services/services';
import { useRouter } from 'next/router';

// ----------------------------------------------------------------------
const RootStyle = styled('div')(({ theme }) => ({
  paddingBottom: HEADER_MOBILE_HEIGHT,
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
    paddingBottom: HEADER_DESKTOP_HEIGHT,
  },
}));

export default function MyTicketPage() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useSelector((state: any) => state.webUser);
  const [itemCount, setItemCount] = useState(0);
  const fetchMyItemCount = async () => {
    let ticketCount = 0;
    let oldTicketCount = 0;
    const ticketList = await getMyTickets(user?.uid);
    if (ticketList.data.data) ticketCount = ticketList.data.data.length;

    const oldTicketList = await getOldMyTicketByUid(user?.uid);
    if (oldTicketList.data.data) oldTicketCount = oldTicketList.data.data.length;

    setItemCount(ticketCount + oldTicketCount);
  };
  useEffect(() => {
    if (router.pathname === '/my/tickets') {
      fetchMyItemCount();
    }
  }, [router.pathname]);
  return (
    <Page title="Account">
      <RootStyle>
        <Container sx={{ mt: 3 }}>
          <Grid container zeroMinWidth>
            <Grid
              item
              md={2}
              sx={{
                [theme.breakpoints.down('md')]: {
                  marginRight: '-20px',
                  marginLeft: '-20px',
                  maxWidth: 'calc(100% + 40px)',
                },
              }}
            >
              <SideMenu chipLabel={itemCount} />
            </Grid>

            <Grid item md={10}>
              <Stack sx={{ mb: 3 }}>
                <MyTicketList loading={false} />
                <MyOldTicketList loading={false} />
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

MyTicketPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout
      verticalAlign="top"
      background={{
        backgroundImage: {
          xs: `url(/assets/background/bg-about.jpg)`,
          md: `url(/assets/background/bg-my-items.jpg)`,
        },
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      {page}
    </Layout>
  );
};
