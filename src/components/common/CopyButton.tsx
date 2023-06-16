import { ContentCopy } from '@mui/icons-material';
import { IconButton, SxProps } from '@mui/material';
import React from 'react';
import palette from 'src/theme/palette';

interface Props {
  content: string;
  styles?: SxProps;
}

function CopyButton({ content, styles, ...props }: Props) {
  const copyText = () => {
    navigator.clipboard.writeText(content);
  };

  return (
    <IconButton
      onClick={copyText}
      sx={{ borderRadius: '100%', width: '32px', height: '32px', ...styles }}
      {...props}
    >
      <ContentCopy sx={{ color: palette.dark.black.lighter, fontSize: '14px' }} />
    </IconButton>
  );
}

export default CopyButton;
