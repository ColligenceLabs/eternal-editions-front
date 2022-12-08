// icons
// @mui
import {styled} from '@mui/material/styles';
import {Box, Chip, Container, Typography, Link} from '@mui/material';
import React from "react";
import {useTheme} from "@mui/system";
import { Image } from '../../components';
// hooks
import useResponsive from "../../hooks/useResponsive";
import PageHeader from "../../components/common/PageHeader";
import Masonry from "@mui/lab/Masonry";
import TicketPostItem from "../@eternaledtions/tickets/TicketPostItem";
import {TicketProps} from "../../@types/ticket/ticket";
import TICKET from "../../sample/ticket";
// routes
// components

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({theme}) => ({
  [theme.breakpoints.up('md')]: {},
}));

const EternalEditionSection = styled('section')(({theme}) => ({
  position: 'relative',
  paddingTop: '454px',
  paddingBottom: '160px',
  overflow: 'hidden',
  [theme.breakpoints.up('md')]: {
    paddingTop: '612px',
  },
}));

const EternalEditionBody = styled('div')(() => ({
  position: 'relative',
}));

const ImgHuman = styled('img')(({theme}) => ({
  position: 'absolute',
  top: '90px',
  right: '-45%',
  width: '660px',
  [theme.breakpoints.up('md')]: {
    top: '152px',
    right: '80px',
    width: '1280px',
  },
}));

// ----------------------------------------------------------------------

export default function HomeEternalEditions() {
  const theme = useTheme();
  return (
    <RootStyle>
      <EternalEditionSection>
        <Container maxWidth={false} sx={{ px: { xs: '12px', lg: '80px' }}}>
          <ImgHuman src="/assets/img/img-human.png" />

          <EternalEditionBody>
            <PageHeader title="ABOUT" link='/tickets' />
            <Box
              component="h1"
              sx={{
                typography: 'banner1',
                color: theme.palette.primary.main,
                mb: { xs: '16px', lg: '40px' },
              }}
            >
              ETERNAL<br />
              EDITIONS<br />
              2022.11.01<br />
              11:59:53
            </Box>
            <Box
              component="p"
              sx={{
                maxWidth: { lg: '768px' },
                fontSize: { xs: '20px', lg: '40px'},
                fontWeight: 'bold',
                lineHeight: { xs: '26px', lg: '44px' },
                textTransform: 'uppercase',
              }}
            >
              Eternal Editions gives new values in the live event industry.In the WEB 3.0 world, live event planners and participants communicate, BUIDL up, and share together. Our mission is to make all those experiences fun and convenient
            </Box>
          </EternalEditionBody>
        </Container>
      </EternalEditionSection>
    </RootStyle>
  );
}
