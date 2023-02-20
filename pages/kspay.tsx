import React, { ChangeEvent, useRef } from 'react';
import { useState, useEffect, ReactElement } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Container, Input, SelectChangeEvent, Typography } from '@mui/material';
// config
import { HEADER_MOBILE_HEIGHT, HEADER_DESKTOP_HEIGHT } from '../src/config';
// layouts
import Layout from '../src/layouts';
// components
import { Page } from '../src/components';
// sections
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useRouter } from 'next/router';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

const SectionWrapper = styled(Box)(({ theme }) => ({
  marginTop: '20px',
}));

const Rows = styled(Box)(({ theme }) => ({
  marginTop: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
}));

const Title = styled(Typography)(({ theme }) => ({
  minWidth: '120px',
}));
// ----------------------------------------------------------------------

export default function KSPay() {
  const router = useRouter();
  const [orderInfo, setOrderInfo] = useState({
    sndPaymethod: '1000000000',
    sndStoreid: '2999199999',
    sndOrdernumber: 'carrot_1234',
    sndGoodname: '당근10kg',
    sndAmount: router.query['price'] ? router.query['price'] : '0',
    sndOrdername: '김토끼',
    sndEmail: 'kspay@carrot.co.kr',
    sndMobile: '01112341234',
    sndReply: '',
    sndCharSet: '',
    sndGoodType: '',
    sndShowcard: '',
    sndCurrencytype: '',
    iframeYn: '',
    sndInstallmenttype: '',
    sndInteresttype: '',
    sndStoreCeoName: '',
    sndStorePhoneNo: '',
    sndStoreAddress: '',
    sndEscrow: '',
    sndCashReceipt: '',
    reCommConId: '',
    reCommType: '',
    reHash: '',
  });

  const handleChangeOrderInfo = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    console.log(`${name} : ${value}`);
    setOrderInfo({ ...orderInfo, [name]: value });
  };

  const _submit = (_frm: any) => {
    console.log(typeof _frm[0]);
    // _frm[0].sndReply.value = getLocalUrl('api/ksnet/kspay_wh_rcv/');
    setOrderInfo({ ...orderInfo, sndReply: 'http://localhost:8888/api/ksnet/kspay_wh_rcv/' });
    _frm[0].sndReply.value = 'http://localhost:8888/api/ksnet/kspay_wh_rcv/';
    console.log('=====>', _frm[0], _frm[0].sndReply);

    // @ts-ignore
    _pay(_frm[0]);
  };

  useEffect(() => {
    console.log(orderInfo);
  }, [orderInfo]);

  return (
    <Page title="Support">
      <RootStyle>
        <Container>
          <Box sx={{ padding: '20px' }}>
            <form
              name="KSPayWeb"
              method="post"
              // onSubmit={(form) => {
              //   console.log(form);
              // }}
            >
              <Typography variant={'h2'}>KSNET WebHost Sample V1.4[PHP]</Typography>
              <SectionWrapper>
                <Typography variant={'h3'}>고객에게보여지지 않아야 하는 설정값 항목</Typography>
                <Rows>
                  <Title>결제 수단</Title>
                  <Select
                    value={orderInfo.sndPaymethod}
                    name="sndPaymethod"
                    onChange={(event: SelectChangeEvent<string>) =>
                      setOrderInfo({ ...orderInfo, sndPaymethod: event.target.value })
                    }
                  >
                    <MenuItem value={'1000000000'}>신용카드</MenuItem>
                    <MenuItem value={'0100000000'}>가상계좌</MenuItem>
                    <MenuItem value={'0010000000'}>계좌이체</MenuItem>
                    <MenuItem value={'0000010000'}>휴대폰결제</MenuItem>
                  </Select>
                </Rows>
                <Rows>
                  <Title>상점아이디</Title>
                  <Input
                    name="sndStoreid"
                    value={orderInfo.sndStoreid}
                    onChange={handleChangeOrderInfo}
                  />
                </Rows>
                <Rows>
                  <Title>주문번호</Title>
                  <Input
                    name="sndOrdernumber"
                    value={orderInfo.sndOrdernumber}
                    onChange={handleChangeOrderInfo}
                  />
                </Rows>
              </SectionWrapper>
              <SectionWrapper>
                <Typography variant={'h3'}>고객에게 보여주는 항목</Typography>
                <Rows>
                  <Title>상품명</Title>
                  <Input
                    id="outlined-basic"
                    name="sndGoodname"
                    value={orderInfo.sndGoodname}
                    onChange={handleChangeOrderInfo}
                  />
                </Rows>
                <Rows>
                  <Title>금액</Title>
                  <Input
                    id="outlined-basic"
                    name="sndAmount"
                    value={orderInfo.sndAmount}
                    onChange={handleChangeOrderInfo}
                  />
                </Rows>
                <Rows>
                  <Title>주문자명</Title>
                  <Input
                    id="outlined-basic"
                    name="sndOrdername"
                    value={orderInfo.sndOrdername}
                    onChange={handleChangeOrderInfo}
                  />
                </Rows>
                <Rows>
                  <Title>전자우편</Title>
                  <Input
                    id="outlined-basic"
                    name="sndEmail"
                    value={orderInfo.sndEmail}
                    onChange={handleChangeOrderInfo}
                  />
                </Rows>
                <Rows>
                  <Title>이동전화</Title>
                  <Input
                    id="outlined-basic"
                    name="sndMobile"
                    value={orderInfo.sndMobile}
                    onChange={handleChangeOrderInfo}
                  />
                </Rows>
              </SectionWrapper>
              <Button
                variant="outlined"
                onClick={() => _submit(document.getElementsByName('KSPayWeb'))}
              >
                결제
              </Button>
              {/* 공통 환경설정 */}
              <Input type="hidden" name="sndReply" value={orderInfo.sndReply} />
              <Input type="hidden" name="sndCharSet" value="UTF-8" />
              <Input type="hidden" name="sndGoodType" value="1" />

              {/* 1. 신용카드 관련 설정*/}
              {/* 신용카드 결제방법 */}
              {/* 일반적인 업체의 경우 ISP,안심결제만 사용하면 되며 다른 결제방법 추가시에는 사전에 협의이후 적용바랍니다 */}
              <Input type="hidden" name="sndShowcard" value="C" />

              {/*신용카드(해외카드) 통화코드: 해외카드결제시 달러결제를 사용할경우 변경*/}
              {/*원화(WON), 달러(USD) */}
              <Input type="hidden" name="sndCurrencytype" value="WON" />
              {/*원화(WON), 달러(USD)*/}
              <Input type="hidden" name="iframeYn" value="Y" />

              {/* 할부개월수 선택범위 */}
              {/*상점에서 적용할 할부개월수를 세팅합니다. 여기서 세팅하신 값은 결제창에서 고객이 스크롤하여 선택하게 됩니다*/}
              {/*아래의 예의경우 고객은 0~12개월의 할부거래를 선택할수있게 됩니다.*/}
              <Input
                type="hidden"
                name="sndInstallmenttype"
                value="ALL(0:2:3:4:5:6:7:8:9:10:11:12)"
              />

              {/*가맹점부담 무이자할부설정 */}
              {/*카드사 무이자행사만 이용하실경우  또는 무이자 할부를 적용하지 않는 업체는  "NONE"로 세팅  */}
              {/*예 : 전체카드사 및 전체 할부에대해서 무이자 적용할 때는 value="ALL" / 무이자 미적용할 때는 value="NONE" */}
              {/*예 : 전체카드사 3,4,5,6개월 무이자 적용할 때는 value="ALL(3:4:5:6)" */}
              {/*예 : 삼성카드(카드사코드:04) 2,3개월 무이자 적용할 때는 value="04(3:4:5:6)"*/}
              <Input type="hidden" name="sndInteresttype" value="10(02:03),05(06)" />
              <Input type="hidden" name="sndInteresttype" value="NONE" />

              {/*카카오페이 사용시 필수 세팅 값*/}
              {/*카카오페이용 상점대표자명*/}
              <Input type="hidden" name="sndStoreCeoName" value="" />
              {/*  카카오페이 연락처*/}
              <Input type="hidden" name="sndStorePhoneNo" value="" />
              {/*카카오페이 주소*/}
              <Input type="hidden" name="sndStoreAddress" value="" />

              {/*2. 온라인입금(가상계좌) 관련설정*/}
              {/*에스크로사용여부 (0:사용안함, 1:사용)*/}
              <Input type="hidden" name="sndEscrow" value="0" />

              {/*3. 계좌이체 현금영수증발급여부 설정*/}
              {/*계좌이체시 현금영수증 발급여부 (0: 발급안함, 1:발급)*/}
              <Input type="hidden" name="sndCashReceipt" value="0" />

              {/*결과데이타: 승인이후 자동으로 채워집니다. (*변수명을 변경하지 마세요)*/}
              <Input type="hidden" name="reCommConId" value="" />
              <Input type="hidden" name="reCommType" value="" />
              <Input type="hidden" name="reHash" value="" />

              {/*업체에서 추가하고자하는 임의의 파라미터를 입력하면 됩니다.*/}
              {/*이 파라메터들은 지정된결과 페이지(kspay_result.php)로 전송됩니다.*/}
              <Input type="hidden" name="a" value="a1" />
              <Input type="hidden" name="b" value="b1" />
              <Input type="hidden" name="c" value="c1" />
              <Input type="hidden" name="d" value="d1" />
            </form>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

KSPay.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
