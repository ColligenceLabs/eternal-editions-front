import React from 'react';
import { useState, useEffect, ReactElement } from 'react';
import { useDispatch } from 'react-redux';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Container, Typography, Stack } from '@mui/material';
// config
import { HEADER_MOBILE_HEIGHT, HEADER_DESKTOP_HEIGHT, SUCCESS } from 'src/config';
// layouts
import Layout from 'src/layouts';
// components
import { Page, Iconify, TextIconLabel } from 'src/components';
import { IconButtonAnimate } from 'src/components/animate';
// sections
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { getUser, savePoint } from 'src/services/services';
import { setWebUser } from 'src/store/slices/webUser';
import EECard from 'src/components/EECard';
import Link from 'next/link';
import { LoadingButton } from '@mui/lab';
import { useResponsive } from 'src/hooks';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingBottom: HEADER_MOBILE_HEIGHT,
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
    paddingBottom: HEADER_DESKTOP_HEIGHT,
  },
}));

type LineItemProps = {
  icon?: ReactElement;
  label: string;
  value: any;
  isBuying?: boolean;
};

function LineItem({ icon, label, value }: LineItemProps) {
  const isMobile = useResponsive('down', 'md');
  return (
    <TextIconLabel
      icon={icon!}
      value={
        <>
          <Typography sx={{ fontSize: '14px', color: 'common.black' }}>{label}</Typography>
          <Typography
            variant="subtitle2"
            sx={{
              color: 'common.black',
              flexGrow: 1,
              textAlign: 'right',
              fontSize: isMobile ? '14px' : '16px',
              fontWeight: 'bold',
            }}
          >
            {value}
          </Typography>
        </>
      }
      sx={{
        color: 'text.primary',
        '& svg': { mr: 1, width: 24, height: 24 },
      }}
    />
  );
}

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
            <Stack spacing={2}>
              <Box sx={{ py: 2 }}>
                <Typography variant="h6" sx={{ fontSize: '14px' }}>
                  EDCP 충전이 완료되었습니다.
                </Typography>
              </Box>
              <LineItem label="결제방법" value={payResult.typeStr} />
              <LineItem label="성공여부" value={payResult.authyn} />
              <LineItem label="금액" value={payResult.amt} />
              <LineItem label="거래번호" value={payResult.trno} />
              <LineItem label="거래일자" value={payResult.trddt} />
              <LineItem label="거래시간" value={payResult.trdtm} />
              {/* <SectionWrapper>
              <InputWrapper sx={{ fontSize: '14px' }}>결제방법</InputWrapper>
              <InputWrapper>{payResult.typeStr}</InputWrapper>
            </SectionWrapper>
            <SectionWrapper>
              <InputWrapper sx={{ fontSize: '14px' }}>성공여부</InputWrapper>
              <InputWrapper>{payResult.authyn}</InputWrapper>
            </SectionWrapper>
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
            </SectionWrapper> */}

              {/*<SectionWrapper>*/}
              {/*  <InputWrapper>응답코드</InputWrapper>*/}
              {/*  <InputWrapper>{payResult.resultcd}</InputWrapper>*/}
              {/*</SectionWrapper>*/}
              {/*<SectionWrapper>*/}
              {/*  <InputWrapper>주문번호</InputWrapper>*/}
              {/*  <InputWrapper>{payResult.ordno}</InputWrapper>*/}
              {/*</SectionWrapper>*/}

              <Link href={'/'}>
                <LoadingButton size="large" fullWidth variant="contained">
                  MAIN
                </LoadingButton>
              </Link>
              <Link href={'/tickets'}>
                <LoadingButton size="large" fullWidth variant="vivid">
                  BUY TICKET
                </LoadingButton>
              </Link>
            </Stack>
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
