import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Button, Typography, Stack } from '@mui/material';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import MenuPopover from './MenuPopover';
import { ClipboardCopy, getIconByType, getShotAddress } from '../utils/wallet';
import Image from './Image';
import Routes from '../routes';
import { useWeb3React } from '@web3-react/core';
import { WALLET_ABC, WALLET_METAMASK, WALLET_WALLECTCONNECT } from '../config';
import { useDispatch, useSelector } from 'react-redux';
import useAccount from '../hooks/useAccount';
import env from '../env';
import { delUser } from '../store/slices/user';
import { styled } from '@mui/material/styles';
import palette from '../theme/palette';
import getBalances from '../utils/getBalances';
// import { isMobile } from 'react-device-detect';
import { useResponsive } from '../hooks';

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
  const isMobile = useResponsive('down', 'sm');

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
      window.localStorage.removeItem('loginType');
      window.location.href = `${env.REACT_APP_API_URL}/auth/logout`;
      dispatch(delUser());
    } catch (e) {
      console.log(e);
      alert(e);
    }
  };

  useEffect(() => {
    handleClose();
  }, [router]);

  return (
    <>
      <Button onClick={handleOpen}>
        <Typography>{accountShot}</Typography>
        <Image src={getIconByType(type)} sx={{ width: 23, ml: 1 }} />
      </Button>

      <MenuPopover
        open={Boolean(open!)}
        anchorEl={open}
        onClose={handleClose}
        disabledArrow
        sx={{
          bgcolor: 'common.white',
          color: 'common.black',
          width: isMobile ? '100%' : '448px',
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
            <Stack spacing={2} direction="row" sx={{ width: 1 }}>
              <Box sx={{ width: 48 }}>
                <Image
                  src={user.profile_image ? user.profile_image : '/assets/icons/profile-logo.png'}
                />
              </Box>
              <Box sx={{ flexGrow: 1, width: '10px' }}>
                <Typography sx={{ fontSize: '16px', fontWeight: '500' }}>{user.name}</Typography>
                <Typography noWrap>{isMobile ? accountShot : account}</Typography>
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
                  onClick={() => {
                      if(account) {
                          window.open(`https://polygonscan.com/address/${account}`);
                      }
                  }}
                >
                  <OpenInNewOutlinedIcon sx={{ fontSize: '14px' }} />
                </Box>
              </Box>
            </Stack>
          </Box>

          <Stack sx={{ mt: 2 }} spacing={2}>
            <Stack
              spacing={2}
              sx={{
                backgroundColor: '#F5F5F5',
                borderRadius: 1.5,
                p: 3,
              }}
            >
              <Stack
                spacing={2}
                direction={isMobile ? 'column' : 'row'}
                justifyContent={isMobile ? 'space-between' : 'space-between'}
                alignItems={isMobile ? 'stretch' : 'center'}
              >
                <Stack spacing={2} justifyContent={isMobile ? 'space-around' : 'space-around'}>
                  <Stack direction="row">
                    <Box sx={{ width: 20, mr: 1 }}>
                      <Image src="/assets/img/ee-logo.svg" />
                    </Box>
                    <Typography sx={{ fontSize: '13px', fontWeight: '700' }}>
                      {user.point ? user.point : 0} EDCP
                    </Typography>
                  </Stack>
                  <Stack direction="row">
                    <Box sx={{ width: 20, mr: 1 }}>
                      <Image src="/assets/img/matic-token-icon.png" sx={{ width: '100%' }} />
                    </Box>
                    <Typography sx={{ fontSize: '13px', fontWeight: '700' }}>
                      {balance.toFixed(5)} MATIC
                    </Typography>
                  </Stack>
                </Stack>
                <NextLink href={Routes.eternalEditions.payment.point} passHref>
                  <Button variant="outlined" color={'black'}>
                    BUY POINT
                  </Button>
                </NextLink>
              </Stack>
            </Stack>

            <Stack
              spacing={1}
              sx={{
                backgroundColor: '#F5F5F5',
                borderRadius: 1.5,
                padding: '20px',
              }}
            >
              <NextLink href={Routes.eternalEditions.my.account} passHref>
                <MenuItem>ACCOUNT</MenuItem>
              </NextLink>
              <NextLink href={Routes.eternalEditions.my.tickets} passHref>
                <MenuItem>MY ITEMS</MenuItem>
              </NextLink>
              <NextLink href={Routes.eternalEditions.my.transaction} passHref>
                <MenuItem>TRANSACTION</MenuItem>
              </NextLink>
              <NextLink href={Routes.eternalEditions.faq} passHref>
                <MenuItem>FAQ</MenuItem>
              </NextLink>
              {/*<NextLink href={Routes.eternalEditions.notice} passHref>*/}
              {/*  <MenuItem>NOTICE</MenuItem>*/}
              {/*</NextLink>*/}
            </Stack>
            <Button
              variant="vivid"
              color="primary"
              size="large"
              onClick={handleDisconnect}
              fullWidth
            >
              Disconnect
            </Button>
          </Stack>
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
