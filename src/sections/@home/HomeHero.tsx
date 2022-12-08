import React from 'react';
// icons
// @mui
import {styled, useTheme} from '@mui/material/styles';
import {Box, Button} from '@mui/material';
// components
import {Swiper, SwiperSlide} from 'swiper/react';
// styles
import 'swiper/swiper.min.css';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({theme}) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 24,
  [theme.breakpoints.up('md')]: {
    height: '100vh',
  },
}));

const BgCover = styled('div')(() => ({
  position: 'relative',
  '&:before': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    content: '""',
    backgroundColor: 'rgba(0,0,0,0.34)',
  },
}));

const BANNERS = [
  '/assets/background/bg-banner.jpg',
  '/assets/background/bg-banner.jpg',
  '/assets/background/bg-banner.jpg',
]


// ----------------------------------------------------------------------

export default function HomeHero() {
  const theme = useTheme();

  return (
    <RootStyle>
      <Swiper>
        {BANNERS.map((src, index) => (
          <SwiperSlide key={index}>
            <BgCover
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: `url(${src}) no-repeat center`,
                backgroundSize: 'cover',
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
            </BgCover>
          </SwiperSlide>
        ))}
      </Swiper>
    </RootStyle>
  );
}
