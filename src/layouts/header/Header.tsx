// next
import NextLink from 'next/link';
// @mui
import {useTheme} from '@mui/material/styles';
import {Box, Stack, Button, AppBar, Divider, Container, Link, Modal, Backdrop, Fade} from '@mui/material';
// hooks
import {useOffSetTop, useResponsive} from '../../hooks';
// routes
import Routes from '../../routes';
// config
import {HEADER_DESKTOP_HEIGHT} from '../../config';
// components
import {Logo, Label, Image} from '../../components';
//
import Searchbar from '../Searchbar';
import LanguagePopover from '../LanguagePopover';
import {NavMobile, NavDesktop, navConfig} from '../nav';
import {ToolbarStyle, ToolbarShadowStyle} from './HeaderToolbarStyle';
import useWallets from "../../hooks/useWallets";
import {getIconByType} from "../../utils/wallet";
import React from "react";
import {ConnectWallet, DisconnectWallet} from "../../components/wallet";
import WalletPopover from "../../components/WalletPopover";

const modalStyle = {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

// ----------------------------------------------------------------------

type Props = {
    transparent?: boolean;
};

export default function Header({transparent}: Props) {
    const theme = useTheme();

    const isDesktop = useResponsive('up', 'md');

    const [connectOpen, setConnectOpen] = React.useState(false);
    const handleConnectOpen = () => setConnectOpen(true);
    const handleConnectClose = () => setConnectOpen(false);

    const [disconnectOpen, setDisconnectOpen] = React.useState(false);
    const handleDisconnectOpen = () => setDisconnectOpen(true);
    const handleDisconnectClose = () => setDisconnectOpen(false);

    const {account, accountShot, type, disconnect} = useWallets();

    const isLight = theme.palette.mode === 'light';

    const isScrolling = useOffSetTop(HEADER_DESKTOP_HEIGHT);

    return (
        <AppBar sx={{boxShadow: 0, bgcolor: 'transparent'}}>
            <ToolbarStyle disableGutters transparent={transparent} scrolling={isScrolling}>
                <Container
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                    }}
                >
                    <Box sx={{lineHeight: 0, position: 'relative'}}>
                        <Logo onDark={transparent && !isScrolling}/>

                        {/*<Link href="https://zone-docs.vercel.app/changelog" target="_blank" rel="noopener">*/}
                        {/*  <Label*/}
                        {/*    color="info"*/}
                        {/*    sx={{*/}
                        {/*      ml: 0.5,*/}
                        {/*      px: 0.5,*/}
                        {/*      top: -14,*/}
                        {/*      left: 64,*/}
                        {/*      height: 20,*/}
                        {/*      fontSize: 11,*/}
                        {/*      cursor: 'pointer',*/}
                        {/*      position: 'absolute',*/}
                        {/*    }}*/}
                        {/*  >*/}
                        {/*    Beta*/}
                        {/*  </Label>*/}
                        {/*</Link>*/}
                    </Box>

                    {isDesktop && (
                        <NavDesktop
                            isScrolling={isScrolling}
                            isTransparent={transparent}
                            navConfig={navConfig}
                        />
                    )}

                    <Box sx={{flexGrow: 1}}/>

                    <Stack spacing={2} direction="row" alignItems="center">
                        <Searchbar
                            sx={{
                                ...(isScrolling && {color: 'text.primary'}),
                            }}
                        />

                        {/*<LanguagePopover*/}
                        {/*  sx={{*/}
                        {/*    ...(isScrolling && { color: 'text.primary' }),*/}
                        {/*  }}*/}
                        {/*/>*/}

                        <Divider orientation="vertical" sx={{height: 24}}/>

                        {isDesktop && (
                            <Stack direction="row" spacing={1}>
                                {/*<NextLink href={Routes.registerIllustration} prefetch={false} passHref>*/}
                                {/*<Button*/}
                                {/*  color="inherit"*/}
                                {/*  variant="outlined"*/}
                                {/*  sx={{*/}
                                {/*    ...(transparent && {*/}
                                {/*      color: 'common.white',*/}
                                {/*    }),*/}
                                {/*    ...(isScrolling && isLight && { color: 'text.primary' }),*/}
                                {/*  }}*/}
                                {/*>*/}
                                {/*  Join Us*/}
                                {/*</Button>*/}
                                {/*</NextLink>*/}

                                {/*<Button variant="contained" href={'/'} target="_blank" rel="noopener">*/}
                                {/*    Connect Wallet*/}
                                {/*</Button>*/}

                                {/* 지갑 연동 */}

                                {account ?
                                    <>
                                        <WalletPopover/>

                                    </> :
                                    <Button variant="contained" onClick={() => handleConnectOpen()}>
                                        Connect Wallet
                                    </Button>
                                }
                            </Stack>
                        )}
                    </Stack>

                    {!isDesktop && (
                        <NavMobile
                            navConfig={navConfig}
                            sx={{
                                ml: 1,
                                ...(isScrolling && {color: 'text.primary'}),
                            }}
                        />
                    )}
                </Container>
            </ToolbarStyle>

            {isScrolling && <ToolbarShadowStyle/>}

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={connectOpen}
                onClose={handleConnectClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={connectOpen}>
                    <Box sx={modalStyle}>
                        <ConnectWallet onClose={handleConnectClose}/>
                    </Box>
                </Fade>
            </Modal>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={disconnectOpen}
                onClose={handleDisconnectClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={disconnectOpen}>
                    <Box sx={modalStyle}>
                        <DisconnectWallet onClose={handleDisconnectClose}/>
                    </Box>
                </Fade>
            </Modal>
        </AppBar>
    );
}
