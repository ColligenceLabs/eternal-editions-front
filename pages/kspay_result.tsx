import React from 'react';
import { useState, useEffect, ReactElement } from 'react';
import { useDispatch } from 'react-redux';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Container, Typography } from '@mui/material';
// config
import { HEADER_MOBILE_HEIGHT, HEADER_DESKTOP_HEIGHT, SUCCESS } from '../src/config';
// layouts
import Layout from '../src/layouts';
// components
import { Page } from '../src/components';
// sections
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { getUser, savePoint } from '../src/services/services';
import { setWebUser } from '../src/store/slices/webUser';
import EECard from '../src/components/EECard';
import Link from 'next/link';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

const SectionWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '1rem',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '5px 30px',

  borderBottom: '0.7px solid #999999',
}));

const InputWrapper = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
}));

// ----------------------------------------------------------------------

export default function KSPayResult() {
  const router = useRouter();
  const dispatch = useDispatch();
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

    if (rslt[1] === 'O') {
      const result = await savePoint({
        order_id: rslt[9],
        point: router.query['point'],
        type: 'BUY',
      });
      if (result.data.status === SUCCESS) {
        const userRes = await getUser();
        if (userRes.status === 200 && userRes.data.status != 0)
          dispatch(setWebUser(userRes.data.user));
      }
    }

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
        <Container maxWidth={'xs'} sx={{ my: '25px' }}>
          <EECard>
            <Box sx={{ padding: '20px', textAlign: 'center' }}>
              <Typography sx={{ fontSize: '14px' }}>결제 결과</Typography>
            </Box>
            <SectionWrapper>
              <InputWrapper sx={{ fontSize: '14px' }}>결제방법</InputWrapper>
              <InputWrapper>{payResult.typeStr}</InputWrapper>
            </SectionWrapper>
            <SectionWrapper>
              <InputWrapper sx={{ fontSize: '14px' }}>성공여부</InputWrapper>
              <InputWrapper>{payResult.authyn}</InputWrapper>
            </SectionWrapper>
            {/*<SectionWrapper>*/}
            {/*  <InputWrapper>응답코드</InputWrapper>*/}
            {/*  <InputWrapper>{payResult.resultcd}</InputWrapper>*/}
            {/*</SectionWrapper>*/}
            {/*<SectionWrapper>*/}
            {/*  <InputWrapper>주문번호</InputWrapper>*/}
            {/*  <InputWrapper>{payResult.ordno}</InputWrapper>*/}
            {/*</SectionWrapper>*/}
            <SectionWrapper>
              <InputWrapper sx={{ fontSize: '14px' }}>금액</InputWrapper>
              <InputWrapper>{`${payResult.amt} 원`}</InputWrapper>
            </SectionWrapper>
            <SectionWrapper>
              <InputWrapper sx={{ fontSize: '14px' }}>거래번호</InputWrapper>
              <InputWrapper>{payResult.trno}</InputWrapper>
            </SectionWrapper>
            <SectionWrapper>
              <InputWrapper sx={{ fontSize: '14px' }}>거래일자</InputWrapper>
              <InputWrapper>{payResult.trddt}</InputWrapper>
            </SectionWrapper>
            <SectionWrapper>
              <InputWrapper sx={{ fontSize: '14px' }}>거래시간</InputWrapper>
              <InputWrapper>{payResult.trdtm}</InputWrapper>
            </SectionWrapper>

            {/*{payResult.authyn && 'O' === payResult.authyn && (*/}
            {/*  <Box sx={{ display: 'flex', gap: '1rem' }}>*/}
            {/*    <InputWrapper>카드사 승인번호/은행 코드번호</InputWrapper>*/}
            {/*    <InputWrapper>{`${payResult.authno} :카드사에서 부여한 번호로 고유한값은 아닙니다.`}</InputWrapper>*/}
            {/*  </Box>*/}
            {/*)}*/}

            {/*<SectionWrapper>*/}
            {/*  <InputWrapper>발급사코드/가상계좌번호/계좌이체번호</InputWrapper>*/}
            {/*  <InputWrapper>{payResult.isscd}</InputWrapper>*/}
            {/*</SectionWrapper>*/}

            {/*<SectionWrapper>*/}
            {/*  <InputWrapper>매입사코드</InputWrapper>*/}
            {/*  <InputWrapper>{payResult.aqucd}</InputWrapper>*/}
            {/*</SectionWrapper>*/}

            {/*<SectionWrapper>*/}
            {/*  <InputWrapper>메시지1</InputWrapper>*/}
            {/*  <InputWrapper>{payResult.msg1}</InputWrapper>*/}
            {/*</SectionWrapper>*/}

            {/*<SectionWrapper>*/}
            {/*  <InputWrapper>메시지2</InputWrapper>*/}
            {/*  <InputWrapper>{payResult.msg2}</InputWrapper>*/}
            {/*</SectionWrapper>*/}
            <Link href={'/'}>
              <Box
                sx={{
                  width: '100%',
                  textAlign: 'center',
                  marginTop: '15px',
                  padding: '10px',
                  backgroundColor: '#999999',
                  borderRadius: '12px',
                  cursor: 'pointer',
                }}
              >
                확인
              </Box>
            </Link>
          </EECard>
        </Container>
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

KSPayResult.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
