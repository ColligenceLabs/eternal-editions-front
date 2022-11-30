import {ReactElement} from 'react';
// utils
// @types
// _data
// layouts
import Layout from '../../src/layouts';
// components
import {Page} from '../../src/components';
import {Box, Button, Container, Stack, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import {HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT} from "../../src/config";
import {RegisterForm} from "../../src/sections/auth";
import NextLink from "next/link";
import Routes from "../../src/routes";
import PaymentPoint from "../../src/sections/@my/PaymentPoint";
import EECard from "../../src/components/EECard";
// sections

// ----------------------------------------------------------------------
const RootStyle = styled('div')(({theme}) => ({
    paddingTop: HEADER_MOBILE_HEIGHT,
    [theme.breakpoints.up('md')]: {
        paddingTop: HEADER_DESKTOP_HEIGHT,
    },
}));


type Props = {};

export default function PaymentPointPage({}: Props) {
    return (
        <Page title="Account">
            <RootStyle>
                <Container maxWidth={"sm"}>

                    <Stack spacing={2} sx={{mb:10}}>

                        <Typography variant="h3" paragraph sx={{textAlign: 'center'}}>
                            Buy with Debit <br/>or Credit Card
                        </Typography>


                            <PaymentPoint/>

                    </Stack>
                </Container>
            </RootStyle>
        </Page>
    );
}

// ----------------------------------------------------------------------

PaymentPointPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};
