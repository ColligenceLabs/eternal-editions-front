import React, { ReactElement } from 'react';
import { Page } from 'src/components';
import { Box, styled, Typography } from '@mui/material';
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from 'src/config';
import Layout from 'src/layouts';
import NextLink from 'next/link';
import Routes from 'src/routes';
import RoundedButton from 'src/components/common/RoundedButton';

const RootStyle = styled('div')(({ theme }) => ({
  paddingBottom: HEADER_MOBILE_HEIGHT,
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
    paddingBottom: HEADER_DESKTOP_HEIGHT,
  },
}));

const Container = styled(Box)(({ theme }) => ({
  margin: '0 auto',
  width: 'calc(100% - 2rem)',
  backgroundColor: theme.palette.common.white,
  color: theme.palette.common.black,
  border: 'none',
  borderRadius: '24px',
  paddingTop: '16px',
  paddingBottom: '16px',
  [theme.breakpoints.up('md')]: {
    paddingTop: '24px',
    paddingBottom: '24px',
  },
}));

const Content = styled(Box)(({ theme }) => ({
  maxHeight: 'calc(100vh - 6rem)',
  position: 'relative',
  overflowY: 'auto',
  marginTop: 1,
  paddingLeft: '16px',
  paddingRight: '16px',
  [theme.breakpoints.up('md')]: {
    paddingLeft: '24px',
    paddingRight: '24px',
  },
}));

export default function Identity(effect: React.EffectCallback, deps?: React.DependencyList) {
  return (
    <Page title="Identity">
      <RootStyle>
        <Container sx={{ width: 'min(100%, 400px)' }}>
          <Content>
            <Typography
              sx={{
                fontSize: { xs: '16px', md: '24px' },
                fontWeight: 'bold',
                lineHeight: { xs: '24px', md: '28px' },
                mb: { xs: '32px', md: '62px' },
              }}
            >
              Sign up
            </Typography>
            <NextLink
              passHref
              as={Routes.eternalEditions.register}
              href={Routes.eternalEditions.register}
            >
              <RoundedButton fullWidth>본인 인증</RoundedButton>
            </NextLink>
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 'bold',
                lineHeight: '16px',
                mt: 1.5,
              }}
            >
              If you are a foreigner, please register{' '}
              <Typography
                variant={'caption'}
                color={'#00BA03'}
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  console.log('I am a foreigner');
                }}
              >
                here.
              </Typography>
            </Typography>
          </Content>
        </Container>
      </RootStyle>
    </Page>
  );
}

Identity.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
