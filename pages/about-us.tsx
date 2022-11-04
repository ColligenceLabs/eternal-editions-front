import {ReactElement} from 'react';
// @mui
import {styled} from '@mui/material/styles';
// config
import {HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT} from '../src/config';
// utils
// @types
// _data
// layouts
import Layout from '../src/layouts';
// components
import {Page} from '../src/components';
// sections
import AboutHeader from "../src/sections/@about/AboutHeader";
import AboutWhyEE from "../src/sections/@about/AboutWhyEE";
import AboutHowTo from "../src/sections/@about/AboutHowTo";
import AboutIFSo from "../src/sections/@about/AboutIFSo";

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

// ----------------------------------------------------------------------

type Props = {
};

export default function EEAboutUsPage({ }: Props) {
  return (
    <Page title="About Us">
      <RootStyle>
        <AboutHeader />
        <AboutWhyEE />
        <AboutHowTo />
        <AboutIFSo />
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

EEAboutUsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};