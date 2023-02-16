import React, { ChangeEvent, useRef } from 'react';
import { useState, useEffect, ReactElement } from 'react';
// icons
import menuIcon from '@iconify/icons-carbon/menu';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Button,
  Container,
  Input,
  SelectChangeEvent,
  Stack,
  Table,
  Typography,
} from '@mui/material';
// config
import { HEADER_MOBILE_HEIGHT, HEADER_DESKTOP_HEIGHT } from '../src/config';
// _data
import { _faqsSupport } from '../_data/mock';
// layouts
import Layout from '../src/layouts';
// components
import { Iconify, Page } from '../src/components';
import { IconButtonAnimate } from '../src/components/animate';
// sections
import axios, { AxiosResponse } from 'axios';
import iconv from 'iconv-lite';
import { useRouter } from 'next/router';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

// ----------------------------------------------------------------------

const KSPAY_WEBHOST_URL = 'http://kspay.ksnet.to/store/KSPayWebV1.4/web_host/recv_post.jsp';
const DEFAULT_DELIM = '`';
const DEFAULT_RPARAMS =
  'authyn`trno`trddt`trdtm`amt`authno`msg1`msg2`ordno`isscd`aqucd`result`resultcd';

export default function KSPayResult() {
  const router = useRouter();
  console.log(router.query);
  const rcid = router.query['rcid'];

  let payKey;
  let typeStr;

  async function kspay_send_msg(rcid: any, mType: any) {
    payKey = rcid;
    const res: AxiosResponse = await axios.post('/api/ksnet/kspay_wh_result', { rcid });
    console.log(res.data);
    const rslt = res.data;

    return rslt;
  }

  useEffect(() => {
    kspay_send_msg(rcid, '1');
  }, []);

  return (
    <Page title="Support">
      <RootStyle>
        <Container>
          <Box sx={{ padding: '20px' }}>
            <Typography variant={'h2'}>result</Typography>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

KSPayResult.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
