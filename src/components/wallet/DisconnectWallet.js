// @mui
import {Button, Divider, Stack, Typography} from '@mui/material';
import * as React from "react";
import useWallets from "../../hooks/useWallets";

// ----------------------------------------------------------------------

export default function DisconnectWallet({onClose, ...other}) {

    // const walletKaikas = new WalletKaikas();
    const {account, type, disconnect} = useWallets();

    return (
        <Stack {...other}>
            <Typography id="transition-modal-title" variant="h4" component="h2" sx={{mb: 2}}>
                DISCONNECT WALLET
            </Typography>

            <Divider/>
            <Stack sx={{mt: 4}}>
                {/*<Image src={getIconByType(type)} sx={{width: 60, textAlign: 'center', display: 'inline'}}/>*/}
                <Typography variant="p" component="p" sx={{fontSize: '0.8em', textAlign: 'center', display: 'inline'}}>
                    {account}
                </Typography>
            </Stack>

            <Stack spacing={2} sx={{mt: 4}}>
                <Button variant="contained" onClick={() => {
                    disconnect();
                    onClose();
                }}>DISCONNECT</Button>
            </Stack>
        </Stack>
    );
}
