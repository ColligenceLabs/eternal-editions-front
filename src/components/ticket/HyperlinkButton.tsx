import { IconButton } from '@mui/material';
import React from 'react';
import LaunchIcon from '@mui/icons-material/Launch';

type Props = {
  href: string;
  styles: any;
};

export default function HyperlinkButton({ href, styles }: Props) {
  return (
    <IconButton
      href={href}
      target="_blank"
      sx={{ borderRadius: '100%', width: '32px', height: '32px', ...styles }}
      aria-label="hyperlink"
    >
      <LaunchIcon sx={{ fontSize: '16px' }} />
    </IconButton>
  );
}
