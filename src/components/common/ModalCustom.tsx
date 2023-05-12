// icons
import closeIcon from '@iconify/icons-carbon/close';
import { Backdrop, Box, Modal, ModalProps, styled } from '@mui/material';
import React from 'react';
import { IconButtonAnimate } from '../animate';
import Iconify from '../Iconify';

export interface Props extends ModalProps {
  onClose?: VoidFunction;
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 400,
  width: 'calc(100% - 2rem)',
  bgcolor: 'common.white',
  color: 'common.black',
  border: 'none',
  borderRadius: '24px',
  boxShadow: 24,
  pt: 2,
  pb: 2,
  pl: 3,
  pr: 3,
};

export default function ModalCustom({ open, children, onClose, ...props }: Props) {
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
      <Box sx={modalStyle}>
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

        <Box
          sx={{
            maxHeight: 'calc(100vh - 6rem)',
            position: 'relative',
            img: { width: 1 },
            marginTop: 1,
          }}
        >
          {children}
        </Box>
      </Box>
    </Modal>
  );
}
