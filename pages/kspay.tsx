import * as Yup from 'yup';
import { useForm, Controller, Paths } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';

import React, { ChangeEvent } from 'react';
import { useState, useEffect, ReactElement } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Button,
  Container,
  Divider,
  Input,
  TextField,
  Stack,
  Typography,
} from '@mui/material';
// config
import { HEADER_MOBILE_HEIGHT, HEADER_DESKTOP_HEIGHT } from 'src/config';
// layouts
import Layout from 'src/layouts';
// components
import { Page } from 'src/components';
// sections
import { useRouter } from 'next/router';
import EECard from 'src/components/EECard';
import { useSelector } from 'react-redux';
import env from 'src/env';
import { format } from 'date-fns';
import { isMobile } from 'react-device-detect';
import useAccount from 'src/hooks/useAccount';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingBottom: HEADER_MOBILE_HEIGHT,
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
    paddingBottom: HEADER_DESKTOP_HEIGHT,
  },
}));

const FormSchema = Yup.object().shape({
  sndPaymethod: Yup.string(),
  sndStoreid: Yup.string(),
  sndOrdernumber: Yup.string(),
  sndGoodname: Yup.string(),
  sndAmount: Yup.string(),
  sndOrdername: Yup.string(),
  sndEmail: Yup.string(),
  sndMobile: Yup.string(),
  sndReply: Yup.string(),
  sndCharSet: Yup.string(),
  sndGoodType: Yup.string(),
  sndShowcard: Yup.string(),
  sndCurrencytype: Yup.string(),
  iframeYn: Yup.string(),
  sndInstallmenttype: Yup.string(),
  sndInteresttype: Yup.string(),
  sndStoreCeoName: Yup.string(),
  sndStorePhoneNo: Yup.string(),
  sndStoreAddress: Yup.string(),
  sndEscrow: Yup.string(),
  sndCashReceipt: Yup.string(),
  reCommConId: Yup.string(),
  reCommType: Yup.string(),
  reHash: Yup.string(),
});

type FormValuesProps = {
  sndPaymethod: string;
  sndStoreid: string;
  sndOrdernumber: string;
  sndGoodname: string;
  sndAmount?: string;
  sndOrdername: string;
  sndEmail: string;
  sndMobile: string;
  sndReply: string;
  sndCharSet: string;
  sndGoodType: string;
  sndShowcard: string;
  sndCurrencytype: string;
  iframeYn: string;
  sndInstallmenttype: string;
  sndInteresttype: string;
  sndStoreCeoName: string;
  sndStorePhoneNo: string;
  sndStoreAddress: string;
  sndEscrow: string;
  sndCashReceipt: string;
  sndDateTime: string;
  reCommConId: string;
  reCommType: string;
  reHash: string;
};

export default function KSPay() {
  const { user } = useSelector((state: any) => state.webUser);
  const { account } = useAccount();
  const router = useRouter();
  const quantity = router.query['amount'] ? `${router.query['amount']} EDCP` : 'EDCP';
  const price = router.query['price'] ? router.query['price'] : '0';
  const theme = useTheme();

  const getLocalUrl = (str: string): string =>
    location.href.substring(0, location.href.lastIndexOf('/')).replaceAll('/kspay', '') + '/' + str;

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormValuesProps>({
    mode: 'onTouched',
    resolver: yupResolver(FormSchema),
    defaultValues: {
      sndPaymethod: '1000000000',
      sndStoreid: env.KSPAY_STORE_ID,
      sndOrdernumber: `EE${format(new Date(), 'yyyy/MMddHHmmss')}-${
        Math.floor(Math.random() * 89999) + 10000
      }`,
      sndDateTime: `${format(new Date(), 'MM/dd/yyyy hh:mm:ss')}`,
      sndGoodname: quantity,
      sndAmount: price,
      sndOrdername: user.name.replaceAll('"', ''),
      sndEmail: user.email,
      sndMobile: '',
      sndReply: getLocalUrl(isMobile ? 'api/ksnet/kspay_m_wh_result/' : 'api/ksnet/kspay_wh_rcv/'),

      //공통 환경설정
      sndCharSet: 'UTF-8',
      sndGoodType: '1',

      //1. 신용카드 관련 설정
      //신용카드 결제방법
      //일반적인 업체의 경우 ISP,안심결제만 사용하면 되며 다른 결제방법 추가시에는 사전에 협의이후 적용바랍니다
      sndShowcard: 'C',

      // 신용카드(해외카드) 통화코드: 해외카드결제시 달러결제를 사용할경우 변경
      // 원화(WON), 달러(USD)
      sndCurrencytype: 'WON',
      // 원화(WON), 달러(USD)
      iframeYn: 'Y',

      //할부개월수 선택범위
      // 상점에서 적용할 할부개월수를 세팅합니다. 여기서 세팅하신 값은 결제창에서 고객이 스크롤하여 선택하게 됩니다
      // 아래의 예의경우 고객은 0~12개월의 할부거래를 선택할수있게 됩니다.
      sndInstallmenttype: 'ALL(0:2:3:4:5:6:7:8:9:10:11:12)',

      // 가맹점부담 무이자할부설정
      // 카드사 무이자행사만 이용하실경우  또는 무이자 할부를 적용하지 않는 업체는  "NONE"로 세팅
      // 예 : 전체카드사 및 전체 할부에대해서 무이자 적용할 때는 value="ALL" / 무이자 미적용할 때는 value="NONE"
      // 예 : 전체카드사 3,4,5,6개월 무이자 적용할 때는 value="ALL(3:4:5:6)"
      // 예 : 삼성카드(카드사코드:04) 2,3개월 무이자 적용할 때는 value="04(3:4:5:6)"
      // sndInteresttype: '10(02:03),05(06)',
      sndInteresttype: 'NONE',

      // 카카오페이 사용시 필수 세팅 값
      // 카카오페이용 상점대표자명
      sndStoreCeoName: '',
      // 카카오페이 연락처
      sndStorePhoneNo: '',
      // 카카오페이 주소
      sndStoreAddress: '',

      // 2. 온라인입금(가상계좌) 관련설정
      // 에스크로사용여부 (0:사용안함, 1:사용)
      sndEscrow: '0',

      // 3. 계좌이체 현금영수증발급여부 설정
      // 계좌이체시 현금영수증 발급여부 (0: 발급안함, 1:발급)
      sndCashReceipt: '0',

      // 결과데이타: 승인이후 자동으로 채워집니다. (*변수명을 변경하지 마세요)
      reCommConId: '',
      reCommType: '',
      reHash: '',

      // 업체에서 추가하고자하는 임의의 파라미터를 입력하면 됩니다.
      // 이 파라메터들은 지정된결과 페이지(kspay_result.php)로 전송됩니다.
      a: router.query['amount'],
      ECHA: router.query['amount'],
    },
  });

  const onSubmit = (data: FormValuesProps, { nativeEvent: { target } }) => {
    if (isMobile) {
      // sndReply는 kspay_wh_rcv.php (결제승인 후 결과값들을 본창의 KSPayWeb Form에 넘겨주는 페이지)의 절대경로를 넣어줍니다.
      //_frm.target = '_blank';
      target.action =
        process.env.NODE_ENV !== 'development'
          ? 'https://kspay.ksnet.to/store/KSPayMobileV1.4/KSPayPWeb.jsp'
          : 'http://210.181.28.134/store/KSPayMobileV1.4/KSPayPWeb.jsp';

      target.submit();
    } else {
      // @ts-ignore
      _pay(target);
    }
  };

  return (
    <Page title="Support">
      <RootStyle>
        <Container maxWidth={'xs'} sx={{ my: '25px' }}>
          <EECard width="400px" marginTop="50px">
            <Box sx={{ mb: '1rem' }}>
              <Typography sx={{ color: '#999999', fontSize: '12px' }}>WALLET ADDRESS</Typography>
              <Typography sx={{ wordBreak: 'break-all', fontSize: '14px' }}>{account}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ color: '#999999', fontSize: '12px' }}>PRUCHASE QUANTITY</Typography>
              <Typography sx={{ color: 'black', fontSize: '14px' }}>{quantity}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ color: '#999999', fontSize: '12px' }}>PAYMENT AMOUNT</Typography>
              <Typography sx={{ color: 'black', fontSize: '14px' }}>
                <span style={{ color: 'red' }}>$60</span> (= ₩{price})
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ color: '#999999', fontSize: '12px' }}>DATE/TIME</Typography>
              <Typography sx={{ color: 'black', fontSize: '14px' }}>{`${format(
                new Date(),
                'MM/dd/yyyy hh:mm:ss'
              )}`}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ color: '#999999', fontSize: '12px' }}>CARD TYPE</Typography>
              <Typography sx={{ color: 'black', fontSize: '14px' }}>CREDIT CARD</Typography>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '12px', mb: 2 }}>
              <Typography sx={{ color: '#999999', fontSize: '12px', fontWeight: 'bold' }}>
                TOTAL PAYMENT{' '}
              </Typography>
              <Typography sx={{ color: 'black', fontSize: '14px', fontWeight: 'bold' }}>
                <span style={{ color: 'red' }}>$60</span> (= ₩{price})
              </Typography>
            </Box>
            <form name="KSPayWeb" method="POST" onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="vivid"
                  loading={isSubmitting}
                >
                  BUY ITEM
                </LoadingButton>
                {/* 공통 환경설정 */}

                <Box style={{ display: 'none' }}>
                  {[
                    'sndGoodname',
                    'sndAmount',
                    'sndReply',
                    'sndOrdername',
                    'sndEmail',
                    'sndMobile',
                    'sndCharSet',
                    'sndGoodType',
                    'sndShowcard',
                    'sndCurrencytype',
                    'iframeYn',
                    'sndInstallmenttype',
                    'sndInteresttype',
                    'sndStoreCeoName',
                    'sndStorePhoneNo',
                    'sndStoreAddress',
                    'sndEscrow',
                    'sndCashReceipt',
                    'reCommConId',
                    'reCommType',
                    'reHash',
                    'sndStoreid',
                    'sndPaymethod',
                    'sndOrdernumber',
                    'a',
                    'ECHA',
                  ].map((name: Paths) => (
                    <Controller
                      key={name}
                      control={control}
                      name={name}
                      render={({ field }) => <TextField {...field} />}
                    />
                  ))}
                </Box>
              </Stack>
            </form>
            <LoadingButton
              fullWidth
              size="large"
              variant="vivid"
              sx={{ mt: 0.5, bgcolor: '#F5F5F5' }}
            >
              Main
            </LoadingButton>
          </EECard>
        </Container>
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

KSPay.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout
      background={{
        backgroundImage: `url(/assets/background/bg-account.jpg)`,
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
