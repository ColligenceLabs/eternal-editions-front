import React, {ReactElement} from 'react';
// utils
// @types
// _data
// layouts
import Layout from '../../src/layouts';
// components
import {Page} from '../../src/components';
import {Container} from "@mui/material";
import {styled} from "@mui/material/styles";
import {HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT} from "../../src/config";
// sections
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PageHeader from "../../src/components/common/PageHeader";
import NFTTransactionNFT from '../../src/sections/@my/NFTTransactionNFT';
import NFTTransactionPoint from '../../src/sections/@my/NFTTransactionPoint';
// import PointTransactionGrid from "../../src/sections/@my/PointTransactionGrid";

// ----------------------------------------------------------------------

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const RootStyle = styled('div')(({theme}) => ({
    paddingTop: HEADER_MOBILE_HEIGHT,
    [theme.breakpoints.up('md')]: {
        paddingTop: HEADER_DESKTOP_HEIGHT,
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
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
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
                <Container sx={{mt:3}}>

                    <PageHeader title="Transaction"/>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }} component={'div'}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Ticket (NFT)" {...a11yProps(0)} />
                            <Tab label="EDC Point" {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <NFTTransactionNFT />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <NFTTransactionPoint />
                    </TabPanel>


                </Container>
            </RootStyle>
        </Page>
    );
}

// ----------------------------------------------------------------------

TransactionPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};
