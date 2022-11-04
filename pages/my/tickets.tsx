import {ReactElement, useEffect, useState} from 'react';
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
import MyTicketList from "../../src/sections/@my/MyTicketList";
// sections

// ----------------------------------------------------------------------
const RootStyle = styled('div')(({theme}) => ({
    paddingTop: HEADER_MOBILE_HEIGHT,
    [theme.breakpoints.up('md')]: {
        paddingTop: HEADER_DESKTOP_HEIGHT,
    },
}));


type Props = {};

export default function MyTicketPage({}: Props) {

    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        let _tickets = [];

        // 임시 데이터
        const ticket1 = {
            slug: 'ticket1',
            title: 'Waterbomb',
        }
        const ticket2 = {
            slug: 'ticket1',
            title: 'Waterbomb',
        }
        const ticket3 = {
            slug: 'ticket1',
            title: 'Waterbomb',
        }
        _tickets.push(ticket1);
        _tickets.push(ticket2);
        _tickets.push(ticket3);

        // @ts-ignore
        setTickets(_tickets);
    }, []);

    return (
        <Page title="Account">
            <RootStyle>
                <Container maxWidth={"lg"}>
                    <Typography variant="h3" paragraph>
                        My Ticket
                    </Typography>

                    <Stack sx={{mb: 3}}>

                        <MyTicketList tickets={tickets}/>
                    </Stack>
                </Container>
            </RootStyle>
        </Page>
    );
}

// ----------------------------------------------------------------------

MyTicketPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};
