import { ReactElement } from 'react';
import Layout from 'src/layouts';
import { Page } from 'src/components';
import { styled } from '@mui/material';
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from 'src/config';
import * as React from 'react';
import MyAccountWrapper from 'src/components/AccountWrapper';
import Accordion from 'src/components/Accordion';

// ----------------------------------------------------------------------
const RootStyle = styled('div')(({ theme }) => ({
  paddingBottom: HEADER_MOBILE_HEIGHT,
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
    paddingBottom: HEADER_DESKTOP_HEIGHT,
  },
}));

type Props = {};

const NoticeContent = {
  q: 'Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget maximus est, id dignissim quam.',
  a: 'Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget maximus est, id dignissim quam.',
};

export default function NoticePage({}: Props) {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Page title="Notice">
      <RootStyle>
        <MyAccountWrapper>
          <Accordion
            isExpanded={expanded === 'panel1'}
            onChange={handleChange('panel1')}
            title={`Q. ${NoticeContent.q}`}
            content={NoticeContent.a}
          />
        </MyAccountWrapper>
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

NoticePage.getLayout = function getLayout(Page: ReactElement) {
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
      {Page}
    </Layout>
  );
};
