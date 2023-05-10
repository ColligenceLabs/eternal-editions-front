import { ReactElement } from 'react';
import Layout from 'src/layouts';
import { Page } from 'src/components';
import { Container, Grid, Stack } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from 'src/config';
import MyTicketList from 'src/sections/@my/MyTicketList';
import PageHeader from 'src/components/common/PageHeader';
import MyOldTicketList from 'src/sections/@my/MyOldTicketList';
import SideMenu from 'src/components/SideMenu';

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

export default function MyTicketPage({}: Props) {
  // const [tickets, setTickets] = useState([]);
  const theme = useTheme();

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
              <SideMenu chipLabel={1} />
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
