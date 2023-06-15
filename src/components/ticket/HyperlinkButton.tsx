import { IconButton, IconButtonProps, SxProps } from '@mui/material';
import React from 'react';
import LaunchIcon from '@mui/icons-material/Launch';

interface Props extends IconButtonProps {
  href?: string;
  styles?: SxProps;
}

export default function HyperlinkButton({ styles, href, ...props }: Props) {
  return (
    <IconButton
      sx={{ borderRadius: '100%', width: '32px', height: '32px', ...styles }}
      aria-label="hyperlink"
      {...(href ? { target: '_blank' } : {})}
      {...props}
    >
      <LaunchIcon sx={{ fontSize: '16px' }} />
    </IconButton>
  );
}
