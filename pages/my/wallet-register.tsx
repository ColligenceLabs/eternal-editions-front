import React, { useState, useEffect, ReactElement } from 'react';
// icons
import menuIcon from '@iconify/icons-carbon/menu';
// @mui
import { styled } from '@mui/material/styles';
import { Backdrop, Box, Button, Container, Fade, Modal, Stack, Typography } from '@mui/material';
// config
import {
  HEADER_MOBILE_HEIGHT,
  HEADER_DESKTOP_HEIGHT,
  ChainId,
  WALLET_METAMASK,
  WALLET_WALLECTCONNECT,
} from 'src/config';
// _data
import { _faqsSupport } from '../../_data/mock';
// layouts
import Layout from 'src/layouts';
// components
import { Iconify, Page } from 'src/components';
import { IconButtonAnimate } from 'src/components/animate';
// sections
import { SupportHero, SupportSidebar, SupportContent } from 'src/sections/support';
import { useDispatch, useSelector } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import useActiveWeb3React from 'src/hooks/useActiveWeb3React';
import useAccount from 'src/hooks/useAccount';
import { setWebUser } from 'src/store/slices/webUser';
import { deleteAddress, updateAddress } from 'src/services/services';
import { SignUp } from 'src/components/user';
import env from 'src/env';
import { setupNetwork } from 'src/utils/network';
import { injected, walletconnect } from 'src/hooks/connectors';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingBottom: HEADER_MOBILE_HEIGHT,
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
    paddingBottom: HEADER_DESKTOP_HEIGHT,
  },
}));

// ----------------------------------------------------------------------

export default function WalletRegister() {
  const context = useWeb3React();
  const { activate, chainId, deactivate, library } = context;
  const dispatch = useDispatch();
  const [doAddWallet, setDoAddWallet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const { account } = useAccount();
  const { user } = useSelector((state: any) => state.webUser);

  const handleSignUpClose = () => {
    setOpenSignUp(false);
  };

  const connectWallet = async (id: any) => {
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
    } finally {
      handleSignUpClose();
    }
  };

  const handleDeleteAddressClick = async () => {
    setIsLoading(true);
    try {
      window.localStorage.removeItem('walletStatus');
      const data = {};
      const res = await deleteAddress(data);
      dispatch(setWebUser(res.data));
      deactivate();
      localStorage.removeItem('walletconnect');
    } catch (error: any) {
      console.log(error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const saveAddress = async () => {
      console.log('asdflaiejlwijeflij');
      setIsLoading(true);
      try {
        const target_copy = Object.assign({}, library.provider);
        const isAbc = target_copy.isABC === true;
        // const isKaikas = typeof target_copy._kaikas !== 'undefined';
        let signature;
        const message = `apps.eternaleditions.io wants you to sign in with your Ethereum account.

EternalEditions Signature Request

Type: Address verification`;
        // if (isKaikas) {
        //   const caver = new Caver(window.klaytn);
        //   signature = await caver.klay.sign(message, account ?? '').catch(() => deactivate());
        // } else {
        //   signature = await library
        //     .getSigner()
        //     .signMessage(message)
        //     .catch(() => deactivate());
        // }
        signature = await library
          .getSigner()
          .signMessage(message)
          .catch(() => deactivate());
        if (!signature) return setIsLoading(false); // 서명 거부
        // const data = { message, signature, isKaikas, isAbc };
        const data = { message, signature, isAbc };
        const res = await updateAddress(data);
        console.log(res);
        dispatch(setWebUser(res.data));
      } catch (error: any) {
        console.log(error.message);
      } finally {
        setDoAddWallet(false);
        setIsLoading(false);
      }
    };

    if (!library?.connection || !doAddWallet) {
      console.log('exited');
      return;
    }
    saveAddress();
  }, [library]);

  return (
    <Page title="Support">
      <Box sx={{ margin: 5, display: 'flex', flexDirection: 'column' }}>
        <RootStyle>Wallet Register</RootStyle>
        <Box>{user.eth_address ? user.eth_address : '-'}</Box>
        {user.eth_address ? (
          <Button
            sx={{ maxWidth: '200px' }}
            variant={'outlined'}
            onClick={handleDeleteAddressClick}
          >
            Delete
          </Button>
        ) : (
          <Button
            sx={{ maxWidth: '200px' }}
            variant={'outlined'}
            onClick={() => {
              setDoAddWallet(true);
              setOpenSignUp(true);
            }}
          >
            Add Wallet
          </Button>
        )}

        {openSignUp && (
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant={'outlined'}
              onClick={async () => {
                await connectWallet(WALLET_METAMASK);
              }}
            >
              Metamask
            </Button>
            <Button
              variant={'outlined'}
              onClick={async () => {
                await connectWallet(WALLET_WALLECTCONNECT);
              }}
            >
              Wallet Connect
            </Button>
          </Box>
        )}
      </Box>
      {/*<Modal*/}
      {/*  aria-labelledby="transition-modal-title"*/}
      {/*  aria-describedby="transition-modal-description"*/}
      {/*  open={openSignUp}*/}
      {/*  onClose={handleSignUpClose}*/}
      {/*  closeAfterTransition*/}
      {/*  BackdropComponent={Backdrop}*/}
      {/*  BackdropProps={{*/}
      {/*    timeout: 500,*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Fade in={openSignUp}>*/}
      {/*    <Box sx={modalStyle}>*/}
      {/*      <SignUp hideSns={true} onClose={handleSignUpClose} />*/}
      {/*    </Box>*/}
      {/*  </Fade>*/}
      {/*</Modal>*/}
    </Page>
  );
}

// ----------------------------------------------------------------------

WalletRegister.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
