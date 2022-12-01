import {ReactElement} from 'react';
// utils
// @types
// _data
// layouts
import Layout from '../../src/layouts';
// components
import {Page} from '../../src/components';
import {Container, Stack, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import {HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT} from "../../src/config";
import {RegisterForm} from "../../src/sections/auth";
import AccountForm from "../../src/sections/@my/AccountForm";
import * as React from "react";
// sections

// ----------------------------------------------------------------------
const RootStyle = styled('div')(({theme}) => ({
    paddingTop: HEADER_MOBILE_HEIGHT,
    [theme.breakpoints.up('md')]: {
        paddingTop: HEADER_DESKTOP_HEIGHT,
    },
}));


type Props = {};

export default function MyAccountPage({}: Props) {
    return (
        <Page title="Account">
            <RootStyle>
                <Container maxWidth={"sm"}>
                    <Stack spacing={2} sx={{mb: 10}}>
                        <Typography variant="h3"  sx={{textAlign: 'center'}}>
                            ACCOUNT
                        </Typography>
                        <Typography>
                            계정관리에 필요한 사항<br/>
                            - 본인인증 통한 <br/>
                            - 본명 / 생년월일 / (국가)모바일번호
                        </Typography>
                        <AccountForm/>
                    </Stack>
                </Container>
            </RootStyle>
        </Page>
    );
}

// ----------------------------------------------------------------------

MyAccountPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};
