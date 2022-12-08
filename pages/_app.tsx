// scroll bar
import 'simplebar/src/simplebar.css';

// lightbox
import 'react-image-lightbox/style.css';

// slick-carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';

// ----------------------------------------------------------------------

import { ReactElement, ReactNode } from 'react';
import { ethers } from 'ethers';
import { Web3ReactProvider } from '@web3-react/core';
// next
import Head from 'next/head';
import { NextPage } from 'next';
import { AppProps } from 'next/app';
// @mui
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
// contexts
import { SettingsProvider } from '../src/contexts/SettingsContext';
// theme
import ThemeProvider from '../src/theme';
// utils
import axios from '../src/utils/axios';
// components
import Settings from '../src/components/settings';
import RtlLayout from '../src/components/RtlLayout';
import ProgressBar from '../src/components/ProgressBar';
import ThemeColorPresets from '../src/components/ThemeColorPresets';
import MotionLazyContainer from '../src/components/animate/MotionLazyContainer';
import { WalletProvider } from '../src/contexts/WalletContext';

// ----------------------------------------------------------------------
function getLibrary(provider: any) {
  // const library = new Web3Provider(provider);
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface MyAppProps extends AppProps {
  Component: NextPageWithLayout;
}

export default function MyApp(props: MyAppProps) {
  const { Component, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  console.info('[INFO] baseAPI', axios.defaults.baseURL);

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <WalletProvider>
          <SettingsProvider>
            <ThemeProvider>
              <Web3ReactProvider getLibrary={getLibrary}>
                <ThemeColorPresets>
                  <MotionLazyContainer>
                    <RtlLayout>
                      {/*세팅 아이콘*/}
                      {/*<Settings />*/}
                      <ProgressBar />
                      {getLayout(<Component {...pageProps} />)}
                    </RtlLayout>
                  </MotionLazyContainer>
                </ThemeColorPresets>
              </Web3ReactProvider>
            </ThemeProvider>
          </SettingsProvider>
        </WalletProvider>
      </LocalizationProvider>
    </>
  );
}
