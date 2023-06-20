import React, { ReactElement } from 'react';
import Layout from 'src/layouts';
import { Page } from 'src/components';
import { styled } from '@mui/material/styles';
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from 'src/config';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import NFTTransactionNFT from 'src/sections/@my/NFTTransactionNFT';
import NFTTransactionPoint from 'src/sections/@my/NFTTransactionPoint';
import MyAccountWrapper from 'src/components/AccountWrapper';
import { Stack } from '@mui/material';
// import PointTransactionGrid from "src/sections/@my/PointTransactionGrid";

// ----------------------------------------------------------------------

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const RootStyle = styled('div')(({ theme }) => ({
  paddingBottom: HEADER_MOBILE_HEIGHT,
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
    paddingBottom: HEADER_DESKTOP_HEIGHT,
  },
}));

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ width: '100%' }}
      {...other}
    >
      {value === index && <Box sx={{ width: '100%' }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function TransactionPage({}) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Page title="Account">
      <RootStyle>
        <MyAccountWrapper>
          <Stack>
            <NFTTransactionNFT />
            {/*<Box sx={{ borderBottom: 1, borderColor: 'divider' }} component={'div'}>*/}
            {/*  <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">*/}
            {/*    <Tab label="Ticket (NFT)" {...a11yProps(0)} />*/}
            {/*    <Tab label="EDC Point" {...a11yProps(1)} />*/}
            {/*  </Tabs>*/}
            {/*</Box>*/}
            {/*<TabPanel value={value} index={0}>*/}
            {/*  <NFTTransactionNFT />*/}
            {/*</TabPanel>*/}
            {/*<TabPanel value={value} index={1}>*/}
            {/*  <NFTTransactionPoint />*/}
            {/*</TabPanel>*/}
          </Stack>
        </MyAccountWrapper>
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

TransactionPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout
      background={{
        backgroundImage: {
          xs: `url(/assets/background/bg-main.jpg)`,
          md: `url(/assets/background/bg-account.jpg)`,
        },
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
