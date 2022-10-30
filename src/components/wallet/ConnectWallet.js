// @mui
import {alpha, styled} from '@mui/material/styles';
import {Stack, Button, Box, Typography, Divider, Modal} from '@mui/material';
import Image from "../Image";
import * as React from "react";
import useWallets from "../../hooks/useWallets";
import {getIconByType} from "../../utils/wallet";
import {WALLET_KAIKAS, WALLET_KLIP, WALLET_METAMASK} from "../../config";

// ----------------------------------------------------------------------

const MetaMaskButton = styled(Button)({
    width: '100% !important',
    fontSize: 12,
    // backgroundColor: '#f1f2f5',
    // borderColor: '#f1f2f5',
    // color: '#000000',
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

    const {connectKaikas, connectMetamask, connectKlip, disconnect, requestKey, message, type} = useWallets();

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
                <>
                    <MetaMaskButton variant="contained"
                                    onClick={() => {
                                        connectMetamask();
                                        onClose();
                                    }}
                                    startIcon={<Image
                                        alt="metamask icon"
                                        src={getIconByType(WALLET_METAMASK)}
                                        sx={{width: 24, height: 24}}
                                    />}>
                        CONNECT TO METAMASK WALLET
                    </MetaMaskButton>

                </>
            </Stack>
        </Stack>
    );
}
