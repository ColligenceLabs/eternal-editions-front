import {alpha, Theme} from '@mui/material/styles';

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
                    props: {variant: 'contained'},
                    style: {
                        color: '#fff',
                        backdropFilter: 'blur(50px)',
                        borderRadius: '60px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        '&:hover': {
                            color: isLight ? 'white' : 'black',
                            backgroundColor: isLight ? theme.palette.grey[700] : theme.palette.primary.main,
                        },
                    },
                },
            ],
            styleOverrides: {
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
