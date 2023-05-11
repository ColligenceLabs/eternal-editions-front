import { Grid, useTheme } from '@mui/material';
import React, { PropsWithChildren } from 'react';
import SideMenu from './SideMenu';
import { Container } from '@mui/material';

export default function MyAccountWrapper({ children }: PropsWithChildren) {
  const theme = useTheme();

  return (
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
          <SideMenu />
        </Grid>
        <Grid
          item
          md={10}
          sx={{
            [theme.breakpoints.down('md')]: {
              width: '100%',
            },
          }}
        >
          {children}
        </Grid>
      </Grid>
    </Container>
  );
}
