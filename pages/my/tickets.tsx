import { ReactElement } from 'react';
import Layout from 'src/layouts';
import { Page } from 'src/components';
import { Container, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from 'src/config';
import MyTicketList from 'src/sections/@my/MyTicketList';
import PageHeader from 'src/components/common/PageHeader';
import MyOldTicketList from 'src/sections/@my/MyOldTicketList';

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

  return (
    <Page title="Account">
      <RootStyle>
        <Container sx={{ mt: 3 }}>
          <PageHeader title="My Items" />

          <Stack sx={{ mb: 3 }}>
            <MyTicketList loading={false} />
            <MyOldTicketList loading={false} />
          </Stack>
        </Container>
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

MyTicketPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout verticalAlign="top">{page}</Layout>;
};
