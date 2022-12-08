import React, {useRef} from 'react';
// icons
// @mui
import {styled, useTheme} from '@mui/material/styles';
import {Container, Stack, Typography, Box, Button} from '@mui/material';
// hooks
import {useBoundingClientRect} from '../../hooks';
// routes
// components
import {Swiper, SwiperSlide} from 'swiper/react';
// styles
import 'swiper/swiper.min.css';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({theme}) => ({
  overflow: 'hidden',
  position: 'relative',
  borderRadius: 24,
  [theme.breakpoints.up('md')]: {
    height: '100vh',
  },
}));

const BANNERS = [
  '/assets/background/bg-banner.jpg',
  '/assets/background/bg-banner.jpg',
  '/assets/background/bg-banner.jpg',
]


// ----------------------------------------------------------------------

export default function HomeHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const container = useBoundingClientRect(containerRef);
  const theme = useTheme();

  return (
    <RootStyle>
      <Swiper>
        {BANNERS.map((src, index) => (
          <SwiperSlide key={index}>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: `url(${src}) no-repeat center`,
                backgroundSize: 'cover',
                '&:before': {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 1,
                  height: 1,
                  content: '""',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                },
              }}
            >
              <Box sx={{ position: 'relative', textAlign: 'center' }}>
                <Box
                  component="p"
                  sx={{
                    typography: 'h5',
                    mb: {xs: '24px', lg: '34px'}
                  }}
                >
                  2023 water bomb with Etenal editons
                </Box>
                <Box
                  component="h1"
                  sx={{
                    typography: 'banner1',
                    color: theme.palette.primary.main,
                    textAlign: 'center',
                    mb: {xs: '24px', lg: '32px'}
                  }}
                >
                  Music festival
                </Box>
                <Button
                  variant="contained"
                  sx={{
                    width: 240,
                    height: 48,
                  }}
                >
                  BUY TICKET
                </Button>
            </Box>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </RootStyle>
  );
}
