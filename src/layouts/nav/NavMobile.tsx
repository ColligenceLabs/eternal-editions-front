import React, { useState, useEffect } from 'react';
// icons
import menuIcon from '@iconify/icons-carbon/menu';
import chevronRight from '@iconify/icons-carbon/chevron-right';
import chevronDown from '@iconify/icons-carbon/chevron-down';
// next
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import { alpha, styled } from '@mui/material/styles';
import {
  Box,
  List,
  Link,
  Stack,
  Button,
  Drawer,
  Collapse,
  ListItemText,
  ListItemButton,
  ListItemButtonProps,
  Backdrop,
  Fade,
  Modal,
} from '@mui/material';
// routes
import Routes from '../../routes';
// config
import { DRAWER_WIDTH } from '../../config';
// @types
import { NavProps, NavItemMobileProps } from '../../@types/layout';
// components
import { Logo, Scrollbar, Iconify, NavSection } from '../../components';
import { IconButtonAnimate } from '../../components/animate';
import SignUp from '../../components/user/SignUp';
import useAccount from '../../hooks/useAccount';
import env from '../../env';
import { delUser } from '../../store/slices/user';
import { useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';

// ----------------------------------------------------------------------

interface RootLinkStyleProps extends ListItemButtonProps {
  active?: boolean;
}

const RootLinkStyle = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})<RootLinkStyleProps>(({ active, theme }) => ({
  ...theme.typography.body2,
  height: 48,
  textTransform: 'capitalize',
  paddingLeft: theme.spacing(2.5),
  paddingRight: theme.spacing(2.5),
  color: theme.palette.text.secondary,
  ...(active && {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
  }),
}));

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

export default function NavMobile({ navConfig, sx }: NavProps) {
  const { pathname } = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [joinOpen, setJoinOpen] = React.useState(false);
  const dispatch = useDispatch();
  const { account } = useAccount();
  const { deactivate, chainId, library } = useWeb3React();

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleJoinOpen = async () => {
    setJoinOpen(true);
  };

  const handleJoinClose = () => setJoinOpen(false);

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
    if (drawerOpen) {
      handleDrawerClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <IconButtonAnimate color="inherit" onClick={handleDrawerOpen} sx={sx}>
        <Iconify icon={menuIcon} />
      </IconButtonAnimate>

      <Drawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: { width: DRAWER_WIDTH },
        }}
      >
        <Scrollbar>
          <Box sx={{ px: 2.5, py: 3, lineHeight: 0 }}>
            <Logo />
          </Box>

          <List sx={{ px: 0 }}>
            {navConfig.map((link) => (
              <NavItemMobile key={link.title} item={link} />
            ))}
          </List>

          <Stack spacing={2} sx={{ p: 2.5, pb: 5 }}>
            {!account ? (
              <Button onClick={() => handleJoinOpen()} fullWidth variant="outlined">
                SIGN UP
              </Button>
            ) : (
              <Button onClick={() => handleDisconnect()} fullWidth variant="outlined">
                Disconnect
              </Button>
            )}

            {/*<NextLink href={Routes.registerIllustration} passHref>*/}
            {/*  <Button fullWidth variant="contained" color="inherit">*/}
            {/*    Join Us*/}
            {/*  </Button>*/}
            {/*</NextLink>*/}
          </Stack>
        </Scrollbar>
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
              <SignUp hideSns={false} onClose={handleJoinClose} />
            </Box>
          </Fade>
        </Modal>
      </Drawer>
    </>
  );
}

// ----------------------------------------------------------------------

function NavItemMobile({ item }: NavItemMobileProps) {
  const { pathname } = useRouter();

  const { title, path, children } = item;
  const rootPath = pathname.split('/')[1];
  const isActiveRoot = pathname === path;
  const isActiveRootWithChild = pathname.includes(`/${rootPath}/`);

  const [open, setOpen] = useState(isActiveRootWithChild);

  const handleOpen = () => {
    setOpen(!open);
  };

  if (children) {
    return (
      <>
        <RootLinkStyle onClick={handleOpen} active={isActiveRootWithChild}>
          <ListItemText disableTypography primary={title} />
          <Iconify icon={open ? chevronDown : chevronRight} sx={{ width: 16, height: 16, ml: 1 }} />
        </RootLinkStyle>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ display: 'flex', flexDirection: 'column-reverse' }}>
            <NavSection
              navConfig={children}
              sx={{
                // Root
                position: 'relative',
                '&:before': {
                  top: 0,
                  bottom: 0,
                  height: 0.96,
                  my: 'auto',
                  left: 20,
                  width: '1px',
                  content: "''",
                  bgcolor: 'divider',
                  position: 'absolute',
                },
                '& .MuiListSubheader-root': { mb: 1 },
                '& .MuiListItemButton-root': {
                  backgroundColor: 'transparent',
                  '&:before': { display: 'none' },
                },
                // Sub
                '& .MuiCollapse-root': {
                  '& .MuiList-root': {
                    '&:before': {
                      top: 0,
                      bottom: 0,
                      left: 40,
                      my: 'auto',
                      height: 0.82,
                      width: '1px',
                      content: "''",
                      bgcolor: 'divider',
                      position: 'absolute',
                    },
                  },
                  '& .MuiListItemButton-root': {
                    pl: 8,
                    '& .MuiListItemIcon-root, .MuiTouchRipple-root': {
                      display: 'none',
                    },
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  },
                },
              }}
            />
          </Box>
        </Collapse>
      </>
    );
  }

  if (title === 'Documentation') {
    return (
      <Link href={path} underline="none" target="_blank" rel="noopener">
        <RootLinkStyle>
          <ListItemText disableTypography primary={title} />
        </RootLinkStyle>
      </Link>
    );
  }

  return (
    <NextLink key={title} href={path} passHref>
      <RootLinkStyle active={isActiveRoot}>
        <ListItemText disableTypography primary={title} />
      </RootLinkStyle>
    </NextLink>
  );
}
