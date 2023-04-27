import React, { useState, useEffect } from 'react';
// icons
import { ToolbarStyle } from 'src/layouts/header/HeaderToolbarStyle';
import MenuIcon from 'src/assets/icons/menu';
import DiscordIcon from 'src/assets/icons/discord';
import CloseIcon from 'src/assets/icons/close';
import chevronRight from '@iconify/icons-carbon/chevron-right';
import chevronDown from '@iconify/icons-carbon/chevron-down';
// next
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import { alpha, styled } from '@mui/material/styles';
import {
  AppBar,
  Container,
  Box,
  List,
  Link,
  Stack,
  Typography,
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
import Routes from 'src/routes';
// config
import { DRAWER_WIDTH } from 'src/config';
// @types
import { NavProps, NavItemMobileProps } from 'src/@types/layout';
// components
import { Logo, Scrollbar, Iconify, NavSection } from 'src/components';
import { IconButtonAnimate } from 'src/components/animate';
import SignUp from 'src/components/user/SignUp';
import useAccount from 'src/hooks/useAccount';
import env from 'src/env';
import { delUser } from 'src/store/slices/user';
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
  maxWidth: 400,
  width: 'calc(100% - 2rem)',
  bgcolor: 'common.white',
  color: 'common.black',
  boxShadow: 24,
  py: 4,
  px: 2.5,
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
      <IconButtonAnimate
        color="inherit"
        onClick={handleDrawerOpen}
        sx={{
          ...sx,
          bgcolor: 'rgba(0,0,0,.3)',
          transition: 'all .3s',
          '&:hover': {
            bgcolor: '#454F5B',
          },
        }}
      >
        <Box
          sx={{
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <DiscordIcon />
        </Box>
      </IconButtonAnimate>
      <IconButtonAnimate
        color="inherit"
        onClick={handleDrawerOpen}
        sx={{
          ...sx,
          bgcolor: 'rgba(0,0,0,.3)',
          transition: 'all .3s',
          '&:hover': {
            bgcolor: '#454F5B',
          },
        }}
      >
        <Box
          sx={{
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MenuIcon />
        </Box>
      </IconButtonAnimate>

      <Drawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            width: DRAWER_WIDTH,
          },
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            borderRadius: 3,
            backgroundImage: `url(/assets/background/bg-main.jpg)`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          <Scrollbar>
            <AppBar sx={{ boxShadow: 0, background: 'transparent' }}>
              <ToolbarStyle disableGutters transparent>
                <Container
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ lineHeight: 0, position: 'relative' }}>
                    <Logo />
                  </Box>
                  <Box sx={{ flexGrow: 1 }} />
                  <IconButtonAnimate
                    color="inherit"
                    onClick={handleDrawerOpen}
                    sx={{
                      ...sx,
                      bgcolor: 'rgba(0,0,0,.3)',
                      transition: 'all .3s',
                      '&:hover': {
                        bgcolor: '#454F5B',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <DiscordIcon />
                    </Box>
                  </IconButtonAnimate>
                  <IconButtonAnimate
                    color="inherit"
                    onClick={handleDrawerClose}
                    sx={{
                      ...sx,
                      bgcolor: 'rgba(0,0,0,.3)',
                      transition: 'all .3s',
                      '&:hover': {
                        bgcolor: '#454F5B',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CloseIcon />
                    </Box>
                  </IconButtonAnimate>
                </Container>
              </ToolbarStyle>
            </AppBar>

            <Box sx={{ px: 2.5, py: 3, lineHeight: 0 }}>{/* <Logo isSimple /> */}</Box>

            <List sx={{ px: 0, py: 5 }}>
              {navConfig.map((link) => (
                <NavItemMobile key={link.title} item={link} />
              ))}
            </List>
          </Scrollbar>
        </Box>
        {!account ? (
          <Button onClick={() => handleJoinOpen()} variant="vivid" size="large" fullWidth>
            LOG IN / SIGN UP
          </Button>
        ) : (
          <Button onClick={() => handleDisconnect()} variant="vivid" size="large" fullWidth>
            Disconnect
          </Button>
        )}
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
      <RootLinkStyle
        active={isActiveRoot}
        sx={{
          height: 'auto',
          lineHeight: 1.1,
          background: 'transparent',

          ...(isActiveRoot
            ? {
                color: 'primary',
              }
            : {
                color: 'text.primary',
              }),
        }}
      >
        <Typography
          variant="h4"
          component="span"
          sx={{
            lineHeight: 1,
            fontSize: 48,
          }}
        >
          <ListItemText disableTypography primary={title} />
        </Typography>
      </RootLinkStyle>
    </NextLink>
  );
}
