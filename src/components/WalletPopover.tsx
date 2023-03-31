import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
// next
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import { Box, Button, Divider, List, ListSubheader, Stack, Typography } from '@mui/material';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
// routes
// hooks
// components
import MenuPopover from './MenuPopover';
import useWallets from '../hooks/useWallets';
import {
  ClipboardCopy,
  getIconByType,
  getShotAddress,
  MATIC_VERSION,
  toChain,
  toSymbolImage,
} from '../utils/wallet';
import Image from './Image';
import Routes from '../routes';
import { Iconify } from './index';
import launchIcon from '@iconify/icons-carbon/launch';
import { useWeb3React } from '@web3-react/core';
import { WALLET_ABC, WALLET_METAMASK, WALLET_WALLECTCONNECT } from '../config';
import { useDispatch, useSelector } from 'react-redux';
import useAccount from '../hooks/useAccount';
import env from '../env';
import { delUser } from '../store/slices/user';
import profileLogo from '../../public/assets/icons/profile-logo.png';
import { styled } from '@mui/material/styles';
import palette from '../theme/palette';
import maticIcon from '../../public/assets/img/matic-token-icon.png';
import getBalances from '../utils/getBalances';

// ----------------------------------------------------------------------
WalletPopover.propTypes = {};

const MenuItem = styled(Typography)`
  color: #000;
  cursor: pointer;
  &:hover {
    opacity: 30%;
  }
`;

export default function WalletPopover({}) {
  // const {account, accountShot, type, disconnect, switchChainNetwork, chainId, balance} = useWallets();
  // const abcAccount = useSelector((state: any) => state.user);
  const { user } = useSelector((state: any) => state.webUser);
  const dispatch = useDispatch();
  const { account } = useAccount();
  const { deactivate, chainId, library } = useWeb3React();
  const logInBy = window.localStorage.getItem('loginBy');
  const [accountShot, setAccountShot] = useState('');
  const [type, setType] = useState('');
  const router = useRouter();

  const balance = getBalances(account, library);

  useEffect(() => {
    if (account) {
      setAccountShot(getShotAddress(account));
      if (logInBy == 'wallet') {
        if (library?.connection.url === 'metamask') setType(WALLET_METAMASK);
        else if (library?.connection.url === 'eip-1193:') setType(WALLET_WALLECTCONNECT);
      } else {
        setType(WALLET_ABC);
      }
    }
  }, [account, library]);
  // const {enqueueSnackbar} = useSnackbar();

  const [open, setOpen] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleDisconnect = async () => {
    try {
      await deactivate();
      window.localStorage.setItem('walletStatus', 'disconnected');
      window.localStorage.removeItem('jwtToken');
      window.localStorage.removeItem('loginBy');
      window.location.href = `${env.REACT_APP_API_URL}/auth/logout`;
      dispatch(delUser());
    } catch (e) {
      console.log(e);
      alert(e);
    }
  };

  return (
    <>
      <Button onClick={handleOpen}>
        {accountShot}
        <Image src={getIconByType(type)} sx={{ width: 23, ml: 1 }} />
      </Button>

      <MenuPopover
        open={Boolean(open!)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          bgcolor: 'common.white',
          color: 'common.black',
          width: 448,
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
        <Box sx={{ p: '24px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: '12px' }}>
              <Box>
                <Image
                  src={user.profile_image ? user.profile_image : '/assets/icons/profile-logo.png'}
                  sx={{ width: 48 }}
                />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ fontSize: '16px', fontWeight: '500' }}>{user.name}</Typography>
                <Typography>{`${account?.substring(0, 20)}...`}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: '0.5rem' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '50%',
                  backgroundColor: '#F5F5F5',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                }}
                onClick={() => ClipboardCopy(account ?? '', '지갑주소가 복사되었습니다.')}
              >
                <ContentCopyOutlinedIcon sx={{ fontSize: '14px', m: 0, p: 0 }} />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '50%',
                  backgroundColor: '#F5F5F5',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                }}
              >
                <OpenInNewOutlinedIcon sx={{ fontSize: '14px' }} />
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.7rem',
              marginTop: '24px',
              backgroundColor: '#F5F5F5',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Box sx={{ width: '20px' }}>
                  <Image src="/assets/img/ee-logo.svg" sx={{ width: '100%' }} />
                </Box>
                <Typography sx={{ fontSize: '13px', fontWeight: '700' }}>
                  {user.point ? user.point : 0} EDC
                </Typography>
              </Box>
              <Box
                sx={{
                  border: '1.5px solid',
                  width: '150px',
                  textAlign: 'center',
                  borderRadius: '12px',
                  cursor: 'pointer',
                }}
              >
                <NextLink href={Routes.eternalEditions.payment.point} passHref>
                  <Typography sx={{ fontSize: '13px', fontWeight: '700' }}>BUY POINT</Typography>
                </NextLink>
                {/*<Typography sx={{ fontSize: '13px', fontWeight: '700' }}>BUY POINT</Typography>*/}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Box sx={{ width: '20px' }}>
                  <Image src="/assets/img/matic-token-icon.png" sx={{ width: '100%' }} />
                </Box>
                <Typography sx={{ fontSize: '13px', fontWeight: '700' }}>
                  {balance.toFixed(5)} MATIC
                </Typography>
              </Box>
              {/*<Box*/}
              {/*  sx={{*/}
              {/*    border: '1.5px solid',*/}
              {/*    width: '150px',*/}
              {/*    textAlign: 'center',*/}
              {/*    borderRadius: '12px',*/}
              {/*    cursor: 'pointer',*/}
              {/*  }}*/}
              {/*>*/}
              {/*  <Typography sx={{ fontSize: '13px', fontWeight: '700' }}>*/}
              {/*    BUY SIMPLEX CREDIT*/}
              {/*  </Typography>*/}
              {/*</Box>*/}
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.7rem',
              marginTop: '24px',
              backgroundColor: '#F5F5F5',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <NextLink href={Routes.eternalEditions.my.account} passHref>
              <MenuItem>ACCOUNT</MenuItem>
            </NextLink>
            <NextLink href={Routes.eternalEditions.my.tickets} passHref>
              <MenuItem>MY TICKETS</MenuItem>
            </NextLink>
            <NextLink href={Routes.eternalEditions.my.transaction} passHref>
              <MenuItem>TRANSACTION</MenuItem>
            </NextLink>
            <NextLink href={Routes.eternalEditions.faq} passHref>
              <MenuItem>FAQ</MenuItem>
            </NextLink>
            <NextLink href={Routes.eternalEditions.notice} passHref>
              <MenuItem>NOTICE</MenuItem>
            </NextLink>
          </Box>
          <Box
            sx={{
              backgroundColor: palette.dark.primary.main,
              height: '45px',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '24px',
              cursor: 'pointer',
            }}
            onClick={handleDisconnect}
          >
            Disconnect
          </Box>
        </Box>

        {/*<Box sx={{ my: 1.5, px: 2.5, mt: 2, mb: 2 }}>*/}
        {/*  <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>*/}
        {/*    <Stack>{toSymbolImage(chainId, { height: 15, mr: 1 })}</Stack>*/}
        {/*    <Stack></Stack>*/}
        {/*  </Stack>*/}
        {/*  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>*/}
        {/*    <Box sx={{ flexGrow: 1 }}>*/}
        {/*      <Typography variant="body2" noWrap>*/}
        {/*        {toChain(MATIC_VERSION).name}*/}
        {/*      </Typography>*/}
        {/*    </Box>*/}

        {/*    <Button onClick={() => ClipboardCopy(account ?? '', '지갑주소가 복사되었습니다.')}>*/}
        {/*      Copy*/}
        {/*    </Button>*/}

        {/*    <Button target="_blank" href={'https://polygonscan.com/address/' + account}>*/}
        {/*      Explore*/}
        {/*    </Button>*/}
        {/*  </Box>*/}

        {/*  <Typography variant="body2" sx={{ fontSize: '0.8em', color: 'text.secondary' }} noWrap>*/}
        {/*    {account}*/}
        {/*  </Typography>*/}
        {/*</Box>*/}

        {/*<Divider sx={{ borderStyle: 'dashed' }} />*/}

        {/*<Stack sx={{ my: 1.5, px: 2.5, mt: 2, mb: 2 }} spacing={1}>*/}
        {/*  <Stack>*/}
        {/*    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>*/}
        {/*      <Box sx={{ flexGrow: 1 }}>*/}
        {/*        <Typography*/}
        {/*          variant="body2"*/}
        {/*          sx={{ fontSize: '0.8em', color: 'text.secondary' }}*/}
        {/*          noWrap*/}
        {/*        >*/}
        {/*          {`[EDC] : ${user.point}`}*/}
        {/*        </Typography>*/}
        {/*      </Box>*/}

        {/*      <NextLink href={Routes.eternalEditions.payment.point} passHref>*/}
        {/*        <Button>포인트 구매</Button>*/}
        {/*      </NextLink>*/}
        {/*    </Box>*/}
        {/*  </Stack>*/}
        {/*  <Stack>*/}
        {/*    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>*/}
        {/*      <Box sx={{ flexGrow: 1 }}>*/}
        {/*        <Typography*/}
        {/*          variant="body2"*/}
        {/*          sx={{ fontSize: '0.8em', color: 'text.secondary' }}*/}
        {/*          noWrap*/}
        {/*        >*/}
        {/*          [MATIC] : 1234*/}
        {/*        </Typography>*/}
        {/*      </Box>*/}

        {/*      <NextLink href={Routes.eternalEditions.payment.matic} passHref>*/}
        {/*        <Button>심플렉스 구매 (추후 진행)</Button>*/}
        {/*      </NextLink>*/}
        {/*    </Box>*/}
        {/*  </Stack>*/}
        {/*</Stack>*/}

        {/*<Divider sx={{ borderStyle: 'dashed' }} />*/}

        {/*<List*/}
        {/*  disablePadding*/}
        {/*  sx={{ mb: 2 }}*/}
        {/*  subheader={*/}
        {/*    <ListSubheader disableSticky sx={{ py: 1, px: 2, typography: 'overline' }}>*/}
        {/*      My Page*/}
        {/*    </ListSubheader>*/}
        {/*  }*/}
        {/*>*/}
        {/*  <NextLink href={Routes.eternalEditions.my.account} passHref>*/}
        {/*    <MenuItem onClick={handleClose}>*/}
        {/*      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>*/}
        {/*        <Box sx={{ flexGrow: 1 }}>*/}
        {/*          <Typography variant="subtitle1">Account</Typography>*/}
        {/*        </Box>*/}
        {/*      </Box>*/}
        {/*    </MenuItem>*/}
        {/*  </NextLink>*/}

        {/*  <NextLink href={Routes.eternalEditions.my.tickets} passHref>*/}
        {/*    <MenuItem onClick={handleClose}>*/}
        {/*      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>*/}
        {/*        <Box sx={{ flexGrow: 1 }}>*/}
        {/*          <Typography variant="subtitle1">My Tickets</Typography>*/}
        {/*        </Box>*/}
        {/*      </Box>*/}
        {/*    </MenuItem>*/}
        {/*  </NextLink>*/}

        {/*  <NextLink href={Routes.eternalEditions.my.transaction} passHref>*/}
        {/*    <MenuItem onClick={handleClose}>*/}
        {/*      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>*/}
        {/*        <Box sx={{ flexGrow: 1 }}>*/}
        {/*          <Typography variant="subtitle1">Transaction</Typography>*/}
        {/*        </Box>*/}
        {/*      </Box>*/}
        {/*    </MenuItem>*/}
        {/*  </NextLink>*/}

        {/*  <NextLink href={Routes.eternalEditions.faq} passHref>*/}
        {/*    <MenuItem onClick={handleClose}>*/}
        {/*      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>*/}
        {/*        <Box sx={{ flexGrow: 1 }}>*/}
        {/*          <Typography variant="subtitle1">FAQ</Typography>*/}
        {/*        </Box>*/}
        {/*      </Box>*/}
        {/*    </MenuItem>*/}
        {/*  </NextLink>*/}

        {/*  <NextLink href={Routes.eternalEditions.notice} passHref>*/}
        {/*    <MenuItem onClick={handleClose}>*/}
        {/*      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>*/}
        {/*        <Box sx={{ flexGrow: 1 }}>*/}
        {/*          <Typography variant="subtitle1">Notice</Typography>*/}
        {/*        </Box>*/}
        {/*      </Box>*/}
        {/*    </MenuItem>*/}
        {/*  </NextLink>*/}

        {/*  <NextLink href={Routes.eternalEditions.my.walletRegister} passHref>*/}
        {/*    <MenuItem onClick={handleClose}>*/}
        {/*      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>*/}
        {/*        <Box sx={{ flexGrow: 1 }}>*/}
        {/*          <Typography variant="subtitle1">Register External Wallet</Typography>*/}
        {/*        </Box>*/}
        {/*      </Box>*/}
        {/*    </MenuItem>*/}
        {/*  </NextLink>*/}
        {/*</List>*/}

        {/*<Divider sx={{ borderStyle: 'dashed' }} />*/}

        {/*<List disablePadding sx={{ mt: 1 }}>*/}
        {/*  /!*<MenuItem onClick={() => disconnect()} sx={{m: 0}}>*!/*/}
        {/*  <MenuItem onClick={handleDisconnect} sx={{ m: 0 }}>*/}
        {/*    <Typography variant="subtitle1">Disconnect</Typography>*/}
        {/*  </MenuItem>*/}
        {/*</List>*/}
      </MenuPopover>
    </>
  );
}
