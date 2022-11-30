// @mui
import { alpha, styled } from '@mui/material/styles';
import { Stack, Button, Box, Typography, Divider, Modal } from '@mui/material';
import Image from '../Image';
import * as React from 'react';
import useWallets from '../../hooks/useWallets';
import { getIconByType } from '../../utils/wallet';
import { ChainId, WALLET_METAMASK, WALLET_WALLECTCONNECT } from '../../config';
import { useWeb3React } from '@web3-react/core';
import { setupNetwork } from '../../utils/network';
import { injected, walletconnect } from '../../hooks/connectors';
import env from '../../env';
import useCreateToken from '../../hooks/useCreateToken';
import { useEffect, useState } from 'react';
import {Iconify} from "../index";

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
  },
});

const GoogleButton = styled(Button)({
  width: '100% !important',
  fontSize: 12,
  backgroundColor: '#f1f2f5',
  borderColor: '#f1f2f5',
  color: '#000000',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#DD4B39',
    borderColor: '#DD4B39',
    color: '#ffffff',
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: 'background.paper',
    borderColor: 'background.paper',
    color: '#ffffff',
  },
});

const FacebookButton = styled(Button)({
  width: '100% !important',
  fontSize: 12,
  backgroundColor: '#f1f2f5',
  borderColor: '#f1f2f5',
  color: '#000000',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#4460d1',
    borderColor: '#4460d1',
    color: '#ffffff',
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: 'background.paper',
    borderColor: 'background.paper',
    color: '#ffffff',
  },
});
// ----------------------------------------------------------------------

export default function SignUp({ onClose, ...other }) {
  const context = useWeb3React();
  const { activate, chainId, account, deactivate } = context;
  const [doSign, setDoSign] = useState(false);
  const tokenGenerator = useCreateToken();
  // const dispatch = useDispatch();
  const { connectKaikas, connectMetamask, connectKlip, disconnect, requestKey, message, type } =
    useWallets();

  useEffect(() => {
    async function createToken() {
      const result = await tokenGenerator.createToken(setDoSign);
      if (result) {
        onClose();
        window.localStorage.setItem('walletStatus', 'connected');
      } else await deactivate();
    }
    if (account) createToken();
  }, [account]);

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
  };

  const buttonGoogle = {

  };

  const buttonTwitter = {

  };

  return (
    <Stack {...other}>
      <Typography id="transition-modal-title" variant="h4" component="h2" sx={{ mb: 2 }}>
        SIGN UP
      </Typography>

      <Divider />

      <Stack spacing={2} sx={{ mt: 4 }}>
        <Stack spacing={1}>
          <Stack>
            <GoogleButton variant="outlined" startIcon={<Iconify icon={"mdi:google-plus"} />}>Google Login</GoogleButton>
          </Stack>
          <Stack>
            <FacebookButton variant="outlined" startIcon={<Iconify icon={"mdi:facebook"} />}>Facebook Login</FacebookButton>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
