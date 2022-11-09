// @mui
import {alpha, styled} from '@mui/material/styles';
import {Stack, Button, Box, Typography, Divider, Modal} from '@mui/material';
import Image from "../Image";
import * as React from "react";
import useWallets from "../../hooks/useWallets";
import {getIconByType} from "../../utils/wallet";
import {
    ChainId,
    WALLET_COINBASE,
    WALLET_KAIKAS,
    WALLET_KLIP,
    WALLET_METAMASK,
    WALLET_WALLECTCONNECT
} from "../../config";
import {useWeb3React} from "@web3-react/core";
import {setupNetwork} from '../../utils/network';
import {injected, walletconnect} from "../../hooks/connectors";
import env from '../../env';

// ----------------------------------------------------------------------

const MetaMaskButton = styled(Button)({
    width: '100% !important',
    fontSize: 12,
    backgroundColor: '#f1f2f5',
    borderColor: '#f1f2f5',
    color: '#000000',
    boxShadow: 'none',
    '&:hover': {
        backgroundColor: 'background.paper',
        borderColor: 'background.paper',
        color: '#ffffff',
        boxShadow: 'none',
    },
    '&:active': {
        boxShadow: 'none',
        backgroundColor: 'background.paper',
        borderColor: 'background.paper',
        color: '#ffffff',
    }
});

const WalletConnectButton = styled(Button)({
    width: '100% !important',
    fontSize: 12,
    backgroundColor: '#f1f2f5',
    borderColor: '#f1f2f5',
    color: '#000000',
    boxShadow: 'none',
    '&:hover': {
        backgroundColor: 'background.paper',
        borderColor: 'background.paper',
        color: '#ffffff',
        boxShadow: 'none',
    },
    '&:active': {
        boxShadow: 'none',
        backgroundColor: 'background.paper',
        borderColor: 'background.paper',
        color: '#ffffff',
    }
});
// ----------------------------------------------------------------------

export default function ConnectWallet({onClose, ...other}) {
    const context = useWeb3React();
    const { activate, chainId, account } = context;
    // const dispatch = useDispatch();

    const {connectKaikas, connectMetamask, connectKlip, disconnect, requestKey, message, type} = useWallets();

    const connectWallet = async (id) => {
        try {
            const targetNetwork = env.REACT_APP_TARGET_NETWORK ?? ChainId.MUMBAI;
            try {
                if (id === WALLET_METAMASK && chainId !== targetNetwork) {
                    await setupNetwork(targetNetwork);
                }
            } catch (e) {
                console.log('change network error', e);
            }
            if (id === WALLET_METAMASK) {
                await activate(injected, undefined, true);
                // dispatch(setActivatingConnector(injected));
                window.localStorage.setItem('wallet', WALLET_METAMASK);
            } else if (id === WALLET_WALLECTCONNECT) {
                window.localStorage.removeItem('walletconnect');
                const wc = walletconnect(true);
                await activate(wc, undefined, true);
                window.localStorage.setItem('wallet', WALLET_WALLECTCONNECT);
            }
        } catch (e) {
            console.log('connect wallet error', e);
            alert(e);
        }
    }

    const modalStyle = {
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    return (
        <Stack {...other}>
            <Typography id="transition-modal-title" variant="h4" component="h2" sx={{mb: 2}}>
                CONNECT WALLET
            </Typography>

            <Divider/>

            <Stack spacing={2} sx={{mt: 4}}>
                <Stack spacing={1}>
                    <Stack>
                        <MetaMaskButton variant="contained"
                                        onClick={async () => {
                                            await connectWallet(WALLET_METAMASK);
                                            // await connectMetamask();
                                            onClose();
                                        }}
                                        startIcon={<Image
                                            alt="metamask icon"
                                            src={getIconByType(WALLET_METAMASK)}
                                            sx={{width: 24, height: 24}}
                                        />}>
                            CONNECT TO METAMASK WALLET
                        </MetaMaskButton>
                    </Stack>
                    <Stack>
                        <WalletConnectButton variant="contained"
                                        onClick={async () => {
                                            await connectWallet(WALLET_WALLECTCONNECT);
                                            onClose();
                                        }}
                                        startIcon={<Image
                                            alt="metamask icon"
                                            src={getIconByType(WALLET_WALLECTCONNECT)}
                                            sx={{width: 24, height: 24}}
                                        />}>
                            CONNECT TO WALLET CONNECT
                        </WalletConnectButton>

                    </Stack>
                </Stack>
                {/*<Divider/>*/}
                {/*<Stack>*/}
                {/*    <Stack>*/}
                {/*        <Button variant="contained">Google Login</Button>*/}
                {/*    </Stack>*/}
                {/*</Stack>*/}

            </Stack>
        </Stack>
    );
}
