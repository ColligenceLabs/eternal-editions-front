// next
import NextLink from 'next/link';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Stack,
  Button,
  AppBar,
  Divider,
  Container,
  Link,
  Modal,
  Backdrop,
  Fade,
} from '@mui/material';
// hooks
import { useOffSetTop, useResponsive } from '../../hooks';
// routes
import Routes from '../../routes';
// config
import { HEADER_DESKTOP_HEIGHT } from '../../config';
// components
import { Logo, Label, Image } from '../../components';
//
import Searchbar from '../Searchbar';
import LanguagePopover from '../LanguagePopover';
import { NavMobile, NavDesktop, navConfig } from '../nav';
import { ToolbarStyle, ToolbarShadowStyle } from './HeaderToolbarStyle';
import useWallets from '../../hooks/useWallets';
import { getIconByType } from '../../utils/wallet';
import React from 'react';
import { ConnectWallet, DisconnectWallet } from '../../components/wallet';
import { SignUp } from '../../components/user';
import WalletPopover from '../../components/WalletPopover';
import { useWeb3React } from '@web3-react/core';
import { useEagerConnect, useInactiveListener } from '../../hooks/useEagerConnect';

// TODO : dkeys WASM Go Initialize...
import '../../abc/sandbox/index';

import { controllers, accountRestApi, services } from '../../abc/background/init';
import { AbcLoginDto, AbcLoginResult } from '../../abc/main/abc/interface';
import { setAbcAuth } from '../../store/slices/abcAuth';
import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';
import TransactionUtil from '../../abc/utils/transaction';
import KlaytnUtil from '../../abc/utils/klaytn';
import { isKlaytn } from '../../abc/utils/network';

const modalStyle = {
  position: 'absolute',
  top: '30%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'common.white',
  color: 'common.black',
  boxShadow: 24,
  p: 4,
  borderRadius: '24px',
};

// ----------------------------------------------------------------------

type Props = {
  transparent?: boolean;
};

export default function Header({ transparent }: Props) {
  const { abcController, accountController } = controllers;
  const { mpcService } = services;
  const dispatch = useDispatch();

  const theme = useTheme();

  const isDesktop = useResponsive('up', 'md');

  const [connectOpen, setConnectOpen] = React.useState(false);
  const handleConnectOpen = () => setConnectOpen(true);
  const handleConnectClose = () => setConnectOpen(false);

  const [disconnectOpen, setDisconnectOpen] = React.useState(false);
  const handleDisconnectOpen = () => setDisconnectOpen(true);
  const handleDisconnectClose = () => setDisconnectOpen(false);

  const [joinOpen, setJoinOpen] = React.useState(false);
  const handleJoinOpen = async () => {
    setJoinOpen(true);

    // ABC Wallet Test
    const dto: AbcLoginDto = { username: 'hwnahm@gmail.com', password: '!owdin001' };
    const abcAuth: AbcLoginResult = await abcController.login(dto);
    await dispatch(setAbcAuth(abcAuth));

    window.localStorage.setItem('abcAuth', JSON.stringify(abcAuth));

    const { user, wallets } = await accountRestApi.getWalletsAndUserByAbcUid();
    console.log('==user, wallets ===>', user, wallets);

    await accountController.recoverShare(
      { password: '!owdin001', user, wallets, undefined },
      dispatch
    );

    const txParams = {
      chainId: 1001,
      data: '0x4e71d92d',
      // from: '0xbef6de269b0f4aa8435f7f4d345be68131ba14c3',
      // gas: '0x44819',
      gasLimit: '0x0440af',
      gasPrice: '0x0ba43b7400',
      to: '0xa97d236bb35a26b1bf329e096aa18d40ea337342',
      nonce: '0x0c',
    };

    // const unSignedTx = {
    //   chainId: 1001,
    //   gasLimit: '0x04cfe8',
    //   gasPrice: '0x0ba43b7400',
    //   data: '0x85be1b3b00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001',
    //   to: '0xf8e62f89bb0c37e0fa12fda659add38f7f42bc98',
    //   value: '0x11fc51222ce8000',
    //   nonce: '0x0b',
    // };

    const twofaToken = '889067';
    const mpcToken = await accountController.verifyTwofactorForMpcSign({
      twofaToken,
      jsonUnsignedTx: JSON.stringify(txParams),
    });

    console.log('===== mpcToken ===>', mpcToken);

    // const ABI = ['function transfer(address to, uint amount)'];
    // const iFace = new ethers.utils.Interface(ABI);
    // const data = iFace.encodeFunctionData('transfer', [
    //   '0x1234567890123456789012345678901234567890',
    //   ethers.utils.parseEther('1.0'),
    // ]);
    // data = '0xa9059cbb00000000000000000000000012345678901234567890123456789012345678900000000000000000000000000000000000000000000000000de0b6b3a7640000'

    const messageHash =
      isKlaytn(txParams.chainId) && txParams?.type
        ? KlaytnUtil.createTxHash(txParams)
        : TransactionUtil.createTxHash(txParams);
    console.log('=== messageHash ===>', messageHash);

    const account = user.accounts[0];
    console.log('=== account ===>', account);

    const sResult = await mpcService.sign({
      txHash: messageHash.slice(2),
      mpcToken,
      accountId: account.id,
    });
    console.log('=== sResult ===>', sResult);

    const { r, s, vsource } = sResult;
    const v = TransactionUtil.calculateV({
      r,
      s,
      vsource,
      hash: messageHash,
      address: account.ethAddress,
      chainId: txParams.chainId,
    });

    const rawTx =
      isKlaytn(txParams.chainId) && txParams?.type
        ? await KlaytnUtil.createRawTx({ txParams, v, r, s })
        : TransactionUtil.createRawTx({ txParams, v, r, s });
    console.log('==== rawTx ===>', rawTx);
  };

  const handleJoinClose = () => setJoinOpen(false);

  // const {account, accountShot, type, disconnect} = useWallets();
  const { account } = useWeb3React();
  const triedEager = useEagerConnect();
  // useInactiveListener(!triedEager || !!activatingConnector);
  useInactiveListener(!triedEager);
  const isLight = theme.palette.mode === 'light';

  const isScrolling = useOffSetTop(HEADER_DESKTOP_HEIGHT);

  return (
    <AppBar sx={{ boxShadow: 0, bgcolor: 'transparent' }}>
      <ToolbarStyle disableGutters transparent={transparent} scrolling={isScrolling}>
        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <Box sx={{ lineHeight: 0, position: 'relative' }}>
            <Logo onDark={transparent && !isScrolling} />
          </Box>

          {isDesktop && (
            <NavDesktop
              isScrolling={isScrolling}
              isTransparent={transparent}
              navConfig={navConfig}
            />
          )}

          {/*<Box sx={{flexGrow: 1}}/>*/}

          <Stack spacing={2} direction="row" alignItems="center">
            {/*<Searchbar*/}
            {/*    sx={{*/}
            {/*        ...(isScrolling && {color: 'text.primary'}),*/}
            {/*    }}*/}
            {/*/>*/}

            {/*<LanguagePopover*/}
            {/*  sx={{*/}
            {/*    ...(isScrolling && { color: 'text.primary' }),*/}
            {/*  }}*/}
            {/*/>*/}

            {/*<Divider orientation="vertical" sx={{height: 24}}/>*/}

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

                {account ? (
                  <>
                    <WalletPopover />
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => handleJoinOpen()}
                      sx={{
                        width: {
                          md: 120,
                        },
                      }}
                    >
                      SIGN UP
                    </Button>
                  </>
                )}
              </Stack>
            )}
          </Stack>

          {!isDesktop && (
            <NavMobile
              navConfig={navConfig}
              sx={{
                ml: 1,
                ...(isScrolling && { color: 'text.primary' }),
              }}
            />
          )}
        </Container>
      </ToolbarStyle>

      {isScrolling && <ToolbarShadowStyle />}

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
            <ConnectWallet onClose={handleConnectClose} />
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
            <DisconnectWallet onClose={handleDisconnectClose} />
          </Box>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={joinOpen}
        onClose={handleJoinClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={joinOpen}>
          <Box sx={modalStyle}>
            <SignUp onClose={handleJoinClose} />
          </Box>
        </Fade>
      </Modal>
    </AppBar>
  );
}
