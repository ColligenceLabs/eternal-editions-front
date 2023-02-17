import React from 'react';
import { useState, useEffect, ReactElement } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Container, Typography } from '@mui/material';
// config
import { HEADER_MOBILE_HEIGHT, HEADER_DESKTOP_HEIGHT } from '../src/config';
// layouts
import Layout from '../src/layouts';
// components
import { Page } from '../src/components';
// sections
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

// ----------------------------------------------------------------------

export default function KSPayResult() {
  const router = useRouter();
  console.log(router.query);
  const rcid = router.query['rcid'];

  const [payResult, setPayResult] = useState({
    authyn: '',
    trno: '',
    trddt: '',
    trdtm: '',
    amt: '',
    authno: '',
    msg1: '',
    msg2: '',
    ordno: '',
    isscd: '',
    aqucd: '',
    typeStr: '',
    resultcd: '',
  });

  async function kspay_send_msg(rcid: any) {
    const res: AxiosResponse = await axios.post('/api/ksnet/kspay_wh_result', { rcid });
    console.log(res.data);
    const rslt = res.data;
    setPayResult({
      authyn: rslt[1] === 'O' ? '승인성공' : '승인거절',
      trno: rslt[2],
      trddt: rslt[3],
      trdtm: rslt[4],
      amt: rslt[5],
      authno: rslt[6],
      msg1: rslt[7],
      msg2: rslt[8],
      ordno: rslt[9],
      isscd: rslt[10],
      aqucd: rslt[11],
      typeStr:
        rslt[12] === '1' || 'I'
          ? '신용카드'
          : rslt === '2'
          ? '실시간계좌이체'
          : rslt === '6'
          ? '가상계좌발급'
          : rslt === 'M'
          ? '휴대폰결제'
          : '(????)',
      resultcd: rslt[13],
    });

    return rslt;
  }

  useEffect(() => {
    if (rcid) kspay_send_msg(rcid);
  }, [rcid]);

  useEffect(() => {
    console.log(payResult);
  }, [payResult]);

  return (
    <Page title="Support">
      <RootStyle>
        <Container>
          <Box sx={{ padding: '20px' }}>
            <Typography variant={'h2'}>결제 결과</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Typography variant={'h4'}>결제방법</Typography>
            <Typography variant={'h4'}>{payResult.typeStr}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Typography variant={'h4'}>성공여부</Typography>
            <Typography variant={'h4'}>{payResult.authyn}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Typography variant={'h4'}>응답코드</Typography>
            <Typography variant={'h4'}>{payResult.resultcd}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Typography variant={'h4'}>주문번호</Typography>
            <Typography variant={'h4'}>{payResult.ordno}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Typography variant={'h4'}>금액</Typography>
            <Typography variant={'h4'}>{payResult.amt}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Typography variant={'h4'}>거래번호</Typography>
            <Typography variant={'h4'}>{payResult.trno}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Typography variant={'h4'}>거래일자</Typography>
            <Typography variant={'h4'}>{payResult.trddt}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Typography variant={'h4'}>거래시간</Typography>
            <Typography variant={'h4'}>{payResult.trdtm}</Typography>
          </Box>

          {payResult.authyn && 'O' === payResult.authyn && (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <Typography variant={'h4'}>카드사 승인번호/은행 코드번호</Typography>
              <Typography
                variant={'h4'}
              >{`${payResult.authno} :카드사에서 부여한 번호로 고유한값은 아닙니다.`}</Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Typography variant={'h4'}>발급사코드/가상계좌번호/계좌이체번호</Typography>
            <Typography variant={'h4'}>{payResult.isscd}</Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Typography variant={'h4'}>매입사코드</Typography>
            <Typography variant={'h4'}>{payResult.aqucd}</Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Typography variant={'h4'}>메시지1</Typography>
            <Typography variant={'h4'}>{payResult.msg1}</Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Typography variant={'h4'}>메시지2</Typography>
            <Typography variant={'h4'}>{payResult.msg2}</Typography>
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
