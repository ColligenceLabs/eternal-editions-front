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
// sections

// ----------------------------------------------------------------------
const RootStyle = styled('div')(({theme}) => ({
    paddingTop: HEADER_MOBILE_HEIGHT,
    [theme.breakpoints.up('md')]: {
        paddingTop: HEADER_DESKTOP_HEIGHT,
    },
}));


type Props = {};

export default function FAQPage({}: Props) {
    return (
        <Page title="Account">
            <RootStyle>
                <Container maxWidth={"sm"}>
                    <Typography variant="h3" paragraph>
                        FAQ
                    </Typography>


                </Container>
            </RootStyle>
        </Page>
    );
}

// ----------------------------------------------------------------------

FAQPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};
