import {ReactElement} from 'react';
// utils
// @types
// _data
// layouts
import Layout from '../../src/layouts';
// components
import {Page} from '../../src/components';
import {Container, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import {HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT} from "../../src/config";
import {RegisterForm} from "../../src/sections/auth";
import PaymentPoint from "../../src/sections/@my/PaymentPoint";
import PaymentMatic from "../../src/sections/@my/PaymentMatic";
// sections

// ----------------------------------------------------------------------
const RootStyle = styled('div')(({theme}) => ({
    paddingTop: HEADER_MOBILE_HEIGHT,
    [theme.breakpoints.up('md')]: {
        paddingTop: HEADER_DESKTOP_HEIGHT,
    },
}));


type Props = {};

export default function PaymentMaticPage({}: Props) {
    return (
        <Page title="Account">
            <RootStyle>
                <Container maxWidth={"sm"}>
                    <Typography variant="h3" paragraph>
                        Matic 구매
                    </Typography>

                    <PaymentMatic/>
                </Container>
            </RootStyle>
        </Page>
    );
}

// ----------------------------------------------------------------------

PaymentMaticPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};
