import { ReactElement, useEffect, useState } from 'react';
// utils
// @types
// _data
// layouts
import Layout from '../../src/layouts';
// components
import { Page } from '../../src/components';
import { Container, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from '../../src/config';
import MyTicketList from '../../src/sections/@my/MyTicketList';
import TICKET from '../../src/sample/ticket';
import PageHeader from '../../src/components/common/PageHeader';
// sections

// ----------------------------------------------------------------------
const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

type Props = {};

export default function MyTicketPage({}: Props) {
  // const [tickets, setTickets] = useState([]);

  useEffect(() => {
    // setTickets();
  }, []);

  return (
    <Page title="Account">
      <RootStyle>
        <Container sx={{ mt: 3 }}>
          <PageHeader title="My Ticket" />

          <Stack sx={{ mb: 3 }}>
            <MyTicketList loading={false} tickets={TICKET.myTickets} />
          </Stack>
        </Container>
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

MyTicketPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
