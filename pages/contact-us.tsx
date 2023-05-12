import { ReactElement } from 'react';
import * as React from 'react';
import Layout from 'src/layouts';
import { Page } from 'src/components';
import { Stack, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from 'src/config';
import MyAccountWrapper from 'src/components/AccountWrapper';
import Accordion from 'src/components/Accordion';
import RoundedButton from 'src/components/common/RoundedButton';
import palette from 'src/theme/palette';

// ----------------------------------------------------------------------
const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  paddingBottom: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

type InquiryStatus = 'Replied' | 'Waiting';

type InquiryItem = {
  id: number | string;
  q: string;
  a: string;
  status: InquiryStatus;
};

const StatusColor: Record<InquiryStatus, string> = {
  Replied: '#00BA03',
  Waiting: palette.dark.black.darker,
};

const Inquiries: InquiryItem[] = [
  {
    id: 1,
    q: 'Eternal Editions는 무엇인가요?',
    a: `Your entries at the time of submission will be exposed.<br/>
    Your entries at the time of submission will be exposed.<br/>
    Your entries at the time of submission will be exposed.<br/>
    <br/>
    -ㅡ<br/>
    <br/>
    The answers entered by the responsible administrator will be exposed.<br/>
    The answers entered by the responsible administrator will be exposed.<br/>
    The answers entered by the responsible administrator will be exposed.<br/>`,
    status: 'Replied',
  },
  {
    id: 2,
    q: '어떤 종류의 기능이 제공되나요?',
    a: 'Eternal Editions는 NFT 티켓을 자유롭게 발행하는 기능, 다양한 재화의 리셀기능, 커뮤니티 빌딩 기 등을 제공합니다.',
    status: 'Waiting',
  },
  {
    id: 3,
    q: '어떻게 구매할 수 있나요?',
    a: '구매를 위해서는 EDCP 혹은 USDC, MATIC을 사용해야 합니다. 구매를 원하는 NFT 콘텐츠의 페이지로 이동한 후, 지시 사항을 따라 구매를 진행할 수 있습니다.',
    status: 'Replied',
  },
];

const InquiryTitle = ({ inquiry }: { inquiry: InquiryItem }) => (
  <Stack direction="row" gap={1}>
    <Typography
      sx={{
        color: StatusColor[inquiry.status],
        fontWeight: 'inherit',
        fontSize: 'inherit',
        lineHeight: 'inherit',
      }}
    >
      {inquiry.status}
    </Typography>
    <Typography sx={{ fontWeight: 'inherit', fontSize: 'inherit', lineHeight: 'inherit' }}>
      {inquiry.q}
    </Typography>
  </Stack>
);

export default function ContactPage() {
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <Page title="FAQ">
      <RootStyle>
        <MyAccountWrapper>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <RoundedButton sx={{ padding: '10px 16px' }}>Inquery</RoundedButton>
            <Typography
              sx={{
                opacity: 0.6,
                textAlign: 'right',
                textTransform: 'uppercase',
                fontSize: '12px',
                lineHeight: 17 / 12,
                mb: 1,
                [theme.breakpoints.down('sm')]: { display: 'none' },
              }}
            >
              Last Update: 9 March, 2023
            </Typography>
          </Stack>

          <Stack sx={{ mb: 3, gap: '2px' }}>
            {Inquiries.map((inquiry) => {
              const isExpanded = expanded === `panel${inquiry.id}`;
              return (
                <Accordion
                  key={inquiry.id}
                  isExpanded={isExpanded}
                  onChange={handleChange(`panel${inquiry.id}`)}
                  title={<InquiryTitle inquiry={inquiry} />}
                >
                  {inquiry.a}
                </Accordion>
              );
            })}
          </Stack>
        </MyAccountWrapper>
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

ContactPage.getLayout = function getLayout(page: ReactElement) {
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
