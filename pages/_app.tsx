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

import { PersistGate } from 'redux-persist/integration/react';

// ----------------------------------------------------------------------

import { ReactElement, ReactNode, useEffect } from 'react';
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
import { SettingsProvider } from 'src/contexts/SettingsContext';
// theme
import ThemeProvider from 'src/theme';
// utils
import axios from 'src/utils/axios';
// components
import Settings from 'src/components/settings';
import RtlLayout from 'src/components/RtlLayout';
import ProgressBar from 'src/components/ProgressBar';
import ThemeColorPresets from 'src/components/ThemeColorPresets';
import MotionLazyContainer from 'src/components/animate/MotionLazyContainer';
import { WalletProvider } from 'src/contexts/WalletContext';

import { wrapper } from 'src/store/store';
import { useDispatch } from 'react-redux';
import { getUser } from 'src/services/services';
import { initWebUser, setWebUser } from 'src/store/slices/webUser';
import { persistStore } from 'redux-persist';
import { createStore } from 'redux';
import { persistedReducer } from 'src/store/rootReducers';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import env from '../src/env';

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

function MyApp(props: MyAppProps) {
  const store = createStore(persistedReducer);
  const persistor = persistStore(store);
  const dispatch = useDispatch();
  const { Component, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  console.info('[INFO] baseAPI', axios.defaults.baseURL);

  const initialOptions = {
    'client-id': env.PAYPAL_CLIENT_ID ?? 'test',
    currency: 'USD',
    intent: 'capture',
  };

  const updateUserRedux = async () => {
    const userRes = await getUser();
    console.log(userRes);
    if (userRes.status === 200 && userRes.data.status != 0) dispatch(setWebUser(userRes.data.user));
    else dispatch(initWebUser()); // 서버에 세션 없으면 초기화
  };

  useEffect(() => {
    updateUserRedux();
  }, []);

  return (
    <PersistGate persistor={persistor} loading={<div>loading...</div>}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <WalletProvider>
          <SettingsProvider>
            <ThemeProvider>
              <Web3ReactProvider getLibrary={getLibrary}>
                <PayPalScriptProvider options={initialOptions}>
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
                </PayPalScriptProvider>
              </Web3ReactProvider>
            </ThemeProvider>
          </SettingsProvider>
        </WalletProvider>
      </LocalizationProvider>
    </PersistGate>
  );
}

export default wrapper.withRedux(MyApp);
