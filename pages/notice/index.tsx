import { ReactElement } from 'react';
// utils
// @types
// _data
// layouts
import Layout from '../../src/layouts';
// components
import { Page } from '../../src/components';
import { Container, Stack, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from '../../src/config';
import PageHeader from '../../src/components/common/PageHeader';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import * as React from 'react';
// sections

// ----------------------------------------------------------------------
const RootStyle = styled('div')(({ theme }) => ({
  backgroundImage: `url(/assets/background/bg-main.jpg)`,
  height: '100%',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  paddingTop: HEADER_MOBILE_HEIGHT,
  paddingBottom: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

type Props = {};

export default function NoticePage({}: Props) {
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <Page title="Notice">
      <RootStyle>
        <Container sx={{ mt: 3 }}>
          <PageHeader title="Notice" />

          <Stack sx={{ mb: 3 }}>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
              <AccordionSummary
                sx={{
                  background: '#000000',
                  borderTopLeftRadius: '24px',
                  borderTopRightRadius: '24px',
                  borderBottomLeftRadius: expanded === 'panel1' ? '0px' : '24px',
                  borderBottomRightRadius: expanded === 'panel1' ? '0px' : '24px',
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
                    color: expanded === 'panel1' ? theme.palette.primary.main : 'common.white',
                  }}
                >
                  Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
                  maximus est, id dignissim quam.
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  background: '#000000',
                  borderTopLeftRadius: expanded === 'panel1' ? '0px' : '24px',
                  borderTopRightRadius: expanded === 'panel1' ? '0px' : '24px',
                  borderBottomLeftRadius: '24px',
                  borderBottomRightRadius: '24px',
                  paddingLeft: '24px',
                  paddingRight: '24px',
                }}
              >
                <Typography>
                  Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
                  maximus est, id dignissim quam.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Container>
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

NoticePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
