import { ReactElement } from 'react';
import { Page } from 'src/components';
import { Box, styled } from '@mui/material';
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from 'src/config';
import Layout from 'src/layouts';
import GoogleFullSignUp from 'src/components/user/GoogleFullSignUp';

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

const NewRegister = () => (
  <Page title="Register">
    <RootStyle>
      <Container sx={{ width: 'min(100%, 400px)' }}>
        <Content>
          <GoogleFullSignUp />
        </Content>
      </Container>
    </RootStyle>
  </Page>
);

export default NewRegister;

NewRegister.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout
      background={{
        backgroundImage: 'url(/assets/background/bg-account.jpg)',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
      verticalAlign="top"
    >
      {page}
    </Layout>
  );
};
