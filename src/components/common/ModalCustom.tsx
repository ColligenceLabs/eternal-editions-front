// icons
import closeIcon from '@iconify/icons-carbon/close';
import { Backdrop, Box, Modal, ModalProps, SxProps, styled } from '@mui/material';
import React from 'react';
import { IconButtonAnimate } from '../animate';
import Iconify from '../Iconify';

export interface ModalCustomProps extends ModalProps {
  containerStyles?: SxProps;
  onClose?: VoidFunction;
}

const Container = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'calc(100% - 2rem)',
  backgroundColor: theme.palette.common.white,
  color: theme.palette.common.black,
  border: 'none',
  borderRadius: '24px',
  paddingTop: '16px',
  paddingBottom: '16px',
  [theme.breakpoints.up('md')]: {
    paddingTop: '24px',
    paddingBottom: '24px',
  },
}));

const Content = styled(Box)(({ theme }) => ({
  maxHeight: 'calc(100vh - 6rem)',
  position: 'relative',
  overflowY: 'auto',
  marginTop: 1,
  paddingLeft: '16px',
  paddingRight: '16px',
  [theme.breakpoints.up('md')]: {
    paddingLeft: '24px',
    paddingRight: '24px',
  },
}));

export default function ModalCustom({
  open,
  children,
  containerStyles,
  onClose,
  ...props
}: ModalCustomProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      {...props}
    >
      {/* <Fade in={open}> */}
      <Container sx={{ width: 'min(95%, 400px)', ...containerStyles }} tabIndex="">
        <Box
          sx={{
            position: 'absolute',
            right: '0.5rem',
            top: '0.5rem',
            zIndex: 1,
          }}
        >
          <IconButtonAnimate color="inherit" onClick={onClose}>
            <Iconify icon={closeIcon} sx={{ width: 20, height: 20 }} />
          </IconButtonAnimate>
        </Box>

        <Content>{children}</Content>
      </Container>
      {/* </Fade> */}
    </Modal>
  );
}
