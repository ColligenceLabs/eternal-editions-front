import {ReactElement} from 'react';
// @mui
import {styled} from '@mui/material/styles';
import {Box, Button, Card, Container, Divider, Grid, Stack, Typography} from '@mui/material';
// routes
// utils
// config
import {HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT} from '../../src/config';
// @types
// layouts
import Layout from '../../src/layouts';
// components
import {Page, TextIconLabel, TextMaxLine} from '../../src/components';
// sections
import {useRouter} from "next/router";
import {useResponsive} from "../../src/hooks";
import EECard from "../../src/components/EECard";
import EEAvatar from "../../src/components/EEAvatar";
import {fDate} from "../../src/utils/formatTime";
import {TicketProps} from "../../src/@types/ticket/ticket";
import TICKET from "../../src/sample/ticket";

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({theme}) => ({
    paddingTop: HEADER_MOBILE_HEIGHT + 30,
    paddingBottom: 30,
    [theme.breakpoints.up('md')]: {
        paddingTop: HEADER_DESKTOP_HEIGHT + 30,
        paddingBottom: 30
    },
    // background: 'red'
}));

// ----------------------------------------------------------------------

// type Props = {
//   ticket: TicketProps;
//   tickets: TicketProps[];
// };

export default function TicketDetailPage() {
    const isDesktop = useResponsive('up', 'md');
    const router = useRouter();
    const {slug} = router.query;
    const {tokenId, title, subtitle, author, description, status, createdAt, background} = TICKET.ticket;

    return (
        <Page title={`${slug} - Ticket`} sx={{backgroundImage: `url(${background})`}}>
            <RootStyle>

                <Container>
                    <Grid container spacing={8} direction="row">
                        <Grid item xs={12} md={5} lg={6}>
                            {/*<Image*/}
                            {/*    alt="photo"*/}
                            {/*    src={'https://dummyimage.com/900x900/000/fff'}*/}
                            {/*    ratio="1/1"*/}
                            {/*    sx={{ borderRadius: 2, cursor: 'pointer' }}*/}
                            {/*/>*/}
                        </Grid>


                        <Grid item xs={12} md={7} lg={6}>
                            <EECard>

                                <Stack spacing={3}>
                                    <Stack
                                        justifyContent="space-between"
                                        sx={{
                                            height: 1,
                                            zIndex: 9,
                                            color: 'common.white',
                                        }}
                                    >
                                        <Stack spacing={1}>
                                            <Stack direction="row" spacing={1} alignItems="center"
                                                   sx={{opacity: 0.72, typography: 'caption'}}>

                                                <EEAvatar account={'0x8B7B2b4F7A391b6f14A81221AE0920a9735B67Fc'}
                                                          sx={{mr: 0, width: 24, height: 24}}/>

                                                <Typography>{author}</Typography>
                                            </Stack>

                                            <TextMaxLine variant="h3" sx={{width: '80%'}}>
                                                {title}
                                            </TextMaxLine>

                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    mb: 1,
                                                    mt: {xs: 1, sm: 0.5},
                                                    color: 'common.white',
                                                    fontSize: '1em'
                                                }}
                                            >
                                                {createdAt && fDate(createdAt)}
                                            </Typography>
                                        </Stack>
                                    </Stack>

                                    <Divider/>

                                    <Stack>
                                        <LineItem icon={<></>} label="Reserve Price" value={'$37.45 (Ξ 0.02871)'}/>
                                        <LineItem icon={<></>} label="Location" value={'HQ Beercade Nashville Nashville, TN'}/>
                                    </Stack>

                                    <Stack sx={{pb:4}}>
                                        <Button size={"large"} fullWidth={true} variant="contained">Payment</Button>
                                    </Stack>

                                    <Divider/>

                                    <Stack>

                                    </Stack>

                                    <Divider/>
                                    <Stack>
                                        <Typography variant={"subtitle2"} sx={{mb:1}}>Title area 2</Typography>
                                        <TextMaxLine line={5}>Unleash your inner warrior and get ready to battle with Ibutsu NFT! If you're looking to be a part of an immersive dojo-style world, then you can't go wrong by having your very own Ibutsu fighter. Join our community to make friends, have fun and collect $APE!</TextMaxLine>
                                    </Stack>
                                    <Divider/>
                                    <Stack>
                                        <Typography variant={"subtitle2"} sx={{mb:1}}>Title area 2</Typography>
                                        <TextMaxLine line={5}>Unleash your inner warrior and get ready to battle with Ibutsu NFT! If you're looking to be a part of an immersive dojo-style world, then you can't go wrong by having your very own Ibutsu fighter. Join our community to make friends, have fun and collect $APE!</TextMaxLine>
                                    </Stack>

                                </Stack>
                            </EECard>


                        </Grid>


                    </Grid>

                </Container>

            </RootStyle>
        </Page>
    );
}

// ----------------------------------------------------------------------

TicketDetailPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

type Params = {
    params: {
        slug: string;
    };
};


type LineItemProps = {
    icon: ReactElement;
    label: string;
    value: any;
};

function LineItem({icon, label, value}: LineItemProps) {
    return (
        <TextIconLabel
            icon={icon}
            value={
                <>
                    <Typography sx={{fontSize: '14px'}}>{label}</Typography>
                    <Typography
                        variant="subtitle2"
                        sx={{color: 'text.primary', flexGrow: 1, textAlign: 'right', fontSize: '16px', fontWeight: 'bold'}}
                    >
                        {value}
                    </Typography>
                </>
            }
            sx={{
                color: 'text.primary',
                '& svg': {mr: 1, width: 24, height: 24},
            }}
        />
    );
}
