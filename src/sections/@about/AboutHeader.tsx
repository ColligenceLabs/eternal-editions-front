// icons
// @mui
import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
// hooks
import { useTheme } from '@mui/system';
import moment from 'moment/moment';
// routes
// components

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {},
}));

const AboutHeaderSection = styled('section')(({ theme }) => ({
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
  const [time, setTime] = useState<moment.Moment>(moment());
  const [dateStr, setDateStr] = useState<string>('');
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    setInterval(() => {
      setTime(moment());
    }, 1000);
  }, []);

  useEffect(() => {
    setDateStr(time.format('YYYY.MM.DD'));
    setTimeStr(time.format('HH:mm:ss'));
  }, [time]);

  return (
    <RootStyle>
      <AboutHeaderSection>
        <Container maxWidth={false} sx={{ px: { xs: '12px', lg: '80px' } }}>
          <Box
            component="h1"
            sx={{
              typography: 'banner1',
              color: theme.palette.primary.main,
              mb: { xs: '16px', lg: '40px' },
            }}
          >
            ETERNAL
            <br />
            EDITIONS
            <br />
            {dateStr}
            <br />
            {timeStr}
          </Box>
          <Box
            component="p"
            sx={{
              maxWidth: { lg: '768px' },
              fontSize: { xs: '20px', lg: '40px' },
              fontWeight: 'bold',
              lineHeight: { xs: '26px', lg: '44px' },
              textTransform: 'uppercase',
            }}
          >
            Eternal Editions gives new values in the live event industry.In the WEB 3.0 world, live
            event planners and participants communicate, BUIDL up, and share together. Our mission
            is to make all those experiences fun and convenient
          </Box>
        </Container>
      </AboutHeaderSection>
    </RootStyle>
  );
}
