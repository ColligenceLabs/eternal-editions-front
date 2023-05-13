// @mui
import { Box, CardProps } from '@mui/material';
// utils
import { ReactNode } from 'react';
import palette from '../theme/palette';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

interface EECardProps extends CardProps {
  bgColor?: string;
  color?: string;
  children?: ReactNode;
  width?: string;
  marginTop?: string;
}

// ----------------------------------------------------------------------
export default function EECard({ bgColor, color, children, width = '600px', marginTop = '0px', ...other }: EECardProps) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <Box
      sx={{
        backgroundColor: bgColor ?? 'common.white',
        color: color ?? isLight ? palette.dark.text.primary : palette.light.text.primary,
        borderRadius: '24px',
        p: 3,
        backdropFilter: 'blur(50px)',
        WebkitBackdropFilter: 'blur(50px)',
        width: width,
        m: `${marginTop} auto 0px`,
      }}
      {...other}
      className={'TESTTEST'}
    >
      {children}
    </Box>
  );
}
