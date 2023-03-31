import {memo} from 'react';
// next
import NextLink from 'next/link';
// @mui
import {useTheme} from '@mui/material/styles';
import {Box, BoxProps} from '@mui/material';
import HeaderLogo from "../assets/logo/HeaderLogo";
import SimpleLogo from "../assets/logo/SimpleLogo";
import useResponsive from "../hooks/useResponsive";

// ----------------------------------------------------------------------

interface LogoProps extends BoxProps {
    onDark?: boolean;
    isSimple?: boolean;
}

function Logo({onDark = false, isSimple = false, sx}: LogoProps) {
    const theme = useTheme();
    const isDesktop = useResponsive('up', 'md');
    const isLight = theme.palette.mode === 'light';

    return (
        <NextLink href="/" passHref>
            <Box
                sx={{
                    width: isSimple ? 40 : isDesktop ? 230 : 44,
                    height: 40,
                    cursor: 'pointer',
                    ...sx,
                }}
            >
                {isSimple ? (
                    <SimpleLogo />
                ) : (
                    <HeaderLogo light={isLight}/>
                )}
            </Box>
        </NextLink>
    );
}

export default memo(Logo);
