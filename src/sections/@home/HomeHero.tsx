import {useRef} from 'react';
// icons
// @mui
import {styled} from '@mui/material/styles';
import {Container, Stack, Typography} from '@mui/material';
// hooks
import {useBoundingClientRect} from '../../hooks';
import {HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT} from "../../config";
// routes
// components

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({theme}) => ({
    overflow: 'hidden',
    position: 'relative',
    paddingTop: HEADER_MOBILE_HEIGHT,
    [theme.breakpoints.up('md')]: {
        height: '100vh',
        paddingTop: HEADER_DESKTOP_HEIGHT,
    },
}));


// ----------------------------------------------------------------------

export default function HomeHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const container = useBoundingClientRect(containerRef);

    const offsetLeft = container?.left;

    return (
        <RootStyle>
            <Container sx={{height: 1}} maxWidth={false}>
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={1}
                    sx={{width: '100%', height: '100%'}}
                >
                    <Typography >HOME HERO</Typography>

                </Stack>
            </Container>
        </RootStyle>
    );
}
