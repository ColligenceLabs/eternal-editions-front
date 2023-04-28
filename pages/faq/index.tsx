import { ReactElement } from 'react';
import * as React from 'react';
import Layout from 'src/layouts';
// components
import { Page } from 'src/components';
import { Container, Stack, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from 'src/config';
import PageHeader from 'src/components/common/PageHeader';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// sections

// ----------------------------------------------------------------------
const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  paddingBottom: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

type Props = {};

const FAQs = [
  {
    id: 1,
    q: 'Eternal Editions는 무엇인가요?',
    a: 'Eternal Editions(이하 ‘EE’)는 WEB 3.0 기반의 라이브 이벤트 커뮤니티입니다. EE는 삶속에서 재미를 찾는 이들의 커뮤니티를 만들어 누구나 이벤트를 기획하고 제작하며 티켓 판매를 통해 유저를 얻을 수 있는 기회를 제공합니다. 또한 이벤트에서 발생하는 수익을 프로젝트 성장에 기여한 커뮤니티 멤버들과 공유함으로써, 기존의 콘서트 기획사나 티켓 판매 업체에 집중되었던 수익을 커뮤니티에 합리적으로 분배합니다.',
  },
  {
    id: 2,
    q: '어떤 종류의 기능이 제공되나요?',
    a: 'Eternal Editions는 NFT 티켓을 자유롭게 발행하는 기능, 다양한 재화의 리셀기능, 커뮤니티 빌딩 기 등을 제공합니다.',
  },
  {
    id: 3,
    q: '어떻게 구매할 수 있나요?',
    a: '구매를 위해서는 EDCP 혹은 USDC, MATIC을 사용해야 합니다. 구매를 원하는 NFT 콘텐츠의 페이지로 이동한 후, 지시 사항을 따라 구매를 진행할 수 있습니다.',
  },
  {
    id: 4,
    q: '구매한 아이템 어떻게 받아볼 수 있나요?',
    a: '구매한 아이템은 유저가 연결한 월렛 혹은 시스템에서 제공하는 월렛으로 전송됩니다. 자세한 내용은 My page에서 확인이 가능합니다.',
  },
  {
    id: 5,
    q: '환불이 가능한가요?',
    a: '여러가지 정책상의 이슈로 NFT 아이템의 환불은 불가능합니다. 따라서 구매 전에 신중하게 검토해주세요. 다만, 예외적으로 NFT 아이템 자체에 문제가 있을경우 환불이 가능합니다. ',
  },
  {
    id: 6,
    q: 'EDCP란 무엇인가요?',
    a: 'EDCP는 Eternal Editions에서 NFT 콘텐츠를 구매하기 위한 가상 포인트입니다. 1 EDCP는 $10 의 가치를 가지고 있습니다.',
  },
  {
    id: 7,
    q: 'ABC 월렛이란 무엇인가요?',
    a: 'ABC 월렛은 대한민국의 주요 사이버 보안 기업인 안랩에서 개발한 Web 3.0 월렛입니다. 사용자의 자산을 안전하고 신뢰성있게 보호하도록 설계되어 있으며, 다양한 암호화폐 및 NFT를 안전하게 보관 및 이전할 수 있도록 지원합니다.',
  }
];

export default function FAQPage({}: Props) {
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <Page title="FAQ">
      <RootStyle>
        <Container sx={{ mt: 3 }}>
          <PageHeader title="FAQ" />

          <Stack sx={{ mb: 3, gap: '1rem' }}>
            {FAQs.map((faq) => (
              <Accordion
                key={faq.id}
                expanded={expanded === `panel${faq.id}`}
                onChange={handleChange(`panel${faq.id}`)}
              >
                <AccordionSummary
                  sx={{
                    background: '#000000',
                    borderTopLeftRadius: '24px',
                    borderTopRightRadius: '24px',
                    borderBottomLeftRadius: expanded === `panel${faq.id}` ? '0px' : '24px',
                    borderBottomRightRadius: expanded === `panel${faq.id}` ? '0px' : '24px',
                    paddingLeft: '24px',
                    paddingRight: '24px',
                  }}
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography
                    sx={{
                      width: '100%',
                      background: 'common.black',
                      color:
                        expanded === `panel${faq.id}` ? theme.palette.primary.main : 'common.white',
                    }}
                  >
                    {faq.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    background: '#000000',
                    borderTopLeftRadius: expanded === `panel${faq.id}` ? '0px' : '24px',
                    borderTopRightRadius: expanded === `panel${faq.id}` ? '0px' : '24px',
                    borderBottomLeftRadius: '24px',
                    borderBottomRightRadius: '24px',
                    paddingLeft: '24px',
                    paddingRight: '24px',
                  }}
                >
                  <Typography>{faq.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Container>
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

FAQPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout
      background={{
        backgroundImage: `url(/assets/background/bg-main.jpg)`,
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
