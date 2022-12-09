// icons
// @mui
import {styled} from '@mui/material/styles';
import {Box, Container} from '@mui/material';
import React from "react";
// hooks
import {useTheme} from "@mui/system";
// routes
// components

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({theme}) => ({
  [theme.breakpoints.up('md')]: {},
}));

const AboutHeaderSection = styled('section')(({theme}) => ({
  position: 'relative',
  paddingTop: '70px',
  paddingBottom: '70px',
  overflow: 'hidden',
  [theme.breakpoints.up('md')]: {
    paddingTop: '130px',
    paddingBottom: '100px',
  },
}));

// ----------------------------------------------------------------------

export default function AboutHeader() {
  const theme = useTheme();

  return (
    <RootStyle>
      <AboutHeaderSection>
        <Container maxWidth={false} sx={{ px: { xs: '12px', lg: '80px' }}}>
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
        </Container>
      </AboutHeaderSection>
    </RootStyle>
  );
}
