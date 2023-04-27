import { alpha, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function Button(theme: Theme) {
  const isLight = theme.palette.mode === 'light';

  return {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            color: '#fff',
            backdropFilter: 'blur(50px)',
            background: 'rgba(0, 0, 0, 0.3)',
            '&:hover': {
              color: isLight ? 'white' : 'black',
              backgroundColor: isLight ? theme.palette.grey[700] : theme.palette.primary.main,
            },
          },
        },
        {
          props: { variant: 'vivid' },
          style: {
            color: 'black',
            backdropFilter: 'blur(50px)',
            background: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: isLight ? theme.palette.grey[700] : theme.palette.primary.light,
            },
            '&:disabled': {
              color: 'black',
              opacity: 0.5,
              background: isLight ? theme.palette.grey[700] : theme.palette.grey[300],
            },
          },
        },
      ],
      styleOverrides: {
        // 모든 버튼 Round 처리
        root: {
          borderRadius: 100,
        },
        sizeLarge: {
          height: 48,
        },
        containedInherit: {
          // color: isLight ? theme.palette.common.white : theme.palette.grey[800],
          color: isLight ? 'red' : 'blue',
          backgroundColor: isLight ? theme.palette.grey[800] : theme.palette.common.white,
          '&:hover': {
            backgroundColor: isLight ? theme.palette.grey[700] : theme.palette.grey[400],
          },
        },
        outlinedInherit: {
          color: 'red',
          borderColor: alpha(theme.palette.grey[500], 0.32),
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
            borderColor: theme.palette.text.primary,
          },
        },
        textInherit: {
          color: 'red',
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        },
      },
    },
  };
}
