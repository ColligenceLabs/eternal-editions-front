import { ReactElement } from 'react';
// @mui
import { styled } from '@mui/material/styles';
// config
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from 'src/config';
// utils
// @types
// _data
// layouts
import Layout from 'src/layouts';
// components
import { Page } from 'src/components';
// sections
import AboutHeader from 'src/sections/@about/AboutHeader';
import AboutVideo from 'src/sections/@about/AboutVideo';
import AboutWhyEE from 'src/sections/@about/AboutWhyEE';
import AboutIFSo from 'src/sections/@about/AboutIFSo';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingBottom: HEADER_MOBILE_HEIGHT,
  paddingTop: HEADER_MOBILE_HEIGHT,
  background: 'url("/assets/background/bg-about.jpg") no-repeat top center',
  backgroundSize: 'cover',
  borderRadius: '24px',
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
    paddingBottom: HEADER_DESKTOP_HEIGHT,
  },
}));

// ----------------------------------------------------------------------

type Props = {};

export default function EEAboutUsPage({}: Props) {
  return (
    <Page title="About Us">
      <RootStyle>
        <AboutHeader />
        {/* <AboutVideo /> */}
        <AboutWhyEE />
        <AboutIFSo />
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

EEAboutUsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
