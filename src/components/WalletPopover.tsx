import {useSnackbar} from 'notistack';
import {useState} from 'react';
// next
import NextLink from 'next/link';
import {useRouter} from 'next/router';
// @mui
import {Box, Button, Divider, List, ListSubheader, MenuItem, Stack, Typography} from '@mui/material';
// routes
// hooks
// components
import MenuPopover from './MenuPopover';
import useWallets from "../hooks/useWallets";
import {ClipboardCopy, getIconByType, MATIC_VERSION, toChain} from "../utils/wallet";
import Image from "./Image";
import Routes from "../routes";
import {Iconify} from "./index";
import launchIcon from "@iconify/icons-carbon/launch";


// ----------------------------------------------------------------------
WalletPopover.propTypes = {};

export default function WalletPopover({}) {
    const {account, accountShot, type, disconnect, switchChainNetwork, chainId, balance} = useWallets();

    const router = useRouter();

    // const {enqueueSnackbar} = useSnackbar();

    const [open, setOpen] = useState<HTMLElement | null>(null);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    return (
        <>
            <Button onClick={handleOpen}>{accountShot}
                <Image src={getIconByType(type)} sx={{width: 23, ml: 1}}/>
            </Button>

            <MenuPopover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleClose}
                sx={{
                    width: 320,
                    p: 0,
                    mt: 1.5,
                    pb: 1.5,
                    ml: 0.75,
                    '& .MuiMenuItem-root': {
                        typography: 'body2',
                        borderRadius: 0.75,
                    },
                }}
            >
                <Box sx={{my: 1.5, px: 2.5, mt: 2, mb: 2}}>

                    <Stack direction="row" alignItems="center" sx={{mb: 1}}>
                        <Stack>
                            {/*{toSymbolImage(chainId, {height: 15, mr: 1})}*/}
                        </Stack>
                        <Stack>

                        </Stack>

                    </Stack>
                    <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
                        <Box sx={{flexGrow: 1}}>
                            <Typography variant="body2" noWrap>
                                {/*{toChain(chainId).name}*/}
                                {toChain(MATIC_VERSION).name}
                            </Typography>
                        </Box>

                        <Button
                            onClick={() => ClipboardCopy(account, "지갑주소가 복사되었습니다.")}
                        >
                            Copy
                        </Button>

                        <Button
                            target="_blank"
                            href={'https://polygonscan.com/address/' + account}
                        >
                            Explore
                        </Button>
                    </Box>

                    <Typography variant="body2" sx={{fontSize: '0.8em', color: 'text.secondary'}} noWrap>
                        {account}
                    </Typography>

                </Box>

                <Divider sx={{borderStyle: 'dashed'}}/>

                <Stack sx={{my: 1.5, px: 2.5, mt: 2, mb: 2}} spacing={1}>
                    <Stack>
                        <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
                            <Box sx={{flexGrow: 1}}>
                                <Typography variant="body2" sx={{fontSize: '0.8em', color: 'text.secondary'}} noWrap>
                                    [EDC] : 1234
                                </Typography>
                            </Box>

                            <NextLink href={Routes.eternalEditions.paymentPoint} passHref>
                                <Button>포인트 구매</Button>
                            </NextLink>
                            {/*<Chip variant="outlined" color="primary" size="small"   label={2}/>*/}
                            {/*<Typography variant="caption" color="primary" size="small" sx={{pr: 1}}>2</Typography>*/}
                        </Box>

                    </Stack>
                    <Stack>
                        <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
                            <Box sx={{flexGrow: 1}}>
                                <Typography variant="body2" sx={{fontSize: '0.8em', color: 'text.secondary'}} noWrap>
                                    [MATIC] : 1234
                                </Typography>
                            </Box>

                            <NextLink href={Routes.eternalEditions.paymentMatic} passHref>
                                <Button>심플렉스 구매 (추후 진행)</Button>
                            </NextLink>
                            {/*<Chip variant="outlined" color="primary" size="small"   label={2}/>*/}
                            {/*<Typography variant="caption" color="primary" size="small" sx={{pr: 1}}>2</Typography>*/}
                        </Box>

                    </Stack>

                </Stack>

                <Divider sx={{borderStyle: 'dashed'}}/>

                <List
                    disablePadding
                    sx={{mb: 2}}
                    subheader={
                        <ListSubheader disableSticky sx={{py: 1, px: 2, typography: 'overline'}}>
                            My Page
                        </ListSubheader>
                    }
                >
                    <NextLink href={Routes.eternalEditions.my.account} passHref>
                        <MenuItem onClick={handleClose}>
                            <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
                                <Box sx={{flexGrow: 1}}>
                                    <Typography variant="subtitle1">Account</Typography>
                                </Box>

                            </Box>
                        </MenuItem>
                    </NextLink>

                    <NextLink href={Routes.eternalEditions.my.tickets} passHref>
                        <MenuItem onClick={handleClose}>
                            <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
                                <Box sx={{flexGrow: 1}}>
                                    <Typography variant="subtitle1">My Tickets</Typography>
                                </Box>

                            </Box>
                        </MenuItem>
                    </NextLink>

                    <NextLink href={Routes.eternalEditions.my.transaction} passHref>
                        <MenuItem onClick={handleClose}>
                            <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
                                <Box sx={{flexGrow: 1}}>
                                    <Typography variant="subtitle1">Transaction</Typography>
                                </Box>

                                {/*<Chip variant="outlined" color="primary" size="small"   label={2}/>*/}
                                {/*<Typography variant="caption" color="primary" size="small" sx={{pr: 1}}>2</Typography>*/}
                            </Box>
                        </MenuItem>
                    </NextLink>

                </List>

                <Divider sx={{borderStyle: 'dashed'}}/>

                <List
                    disablePadding
                    sx={{mt: 1}}
                >
                    <MenuItem onClick={() => disconnect()} sx={{m: 0}}>
                        <Typography variant="subtitle1">Disconnect</Typography>
                    </MenuItem>
                </List>

            </MenuPopover>
        </>
    );
}
