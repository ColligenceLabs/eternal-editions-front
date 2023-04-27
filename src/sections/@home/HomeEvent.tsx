// icons
// @mui
import { styled } from '@mui/material/styles';
import { Box, Chip, Container, Typography, Link } from '@mui/material';
import React from 'react';
import { useTheme } from '@mui/system';
import { Image } from '../../components';
// hooks
import useResponsive from '../../hooks/useResponsive';
// routes
// components

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 24,
  [theme.breakpoints.up('md')]: {},
}));

const EventSection = styled('section')(({ theme }) => ({
  position: 'relative',
  background: 'url(/assets/background/bg-event.jpg) no-repeat top center',
  backgroundSize: 'cover',
  '&:before': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    content: '""',
    backgroundColor: 'rgba(0,0,0,0.34)',
  },
  padding: '32px 0',
  [theme.breakpoints.up('md')]: {
    padding: '80px 0',
  },
}));

const EventContents = styled('div')(() => ({
  position: 'relative',
}));

const TagBox = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  mb: '14px',
}));

const TagThumbnail = styled('figure')(() => ({
  width: '24px',
  height: '24px',
  marginBottom: 0,
  marginRight: '8px',
  borderRadius: '50%',
  overflow: 'hidden',
  img: {
    width: '100%',
  },
}));

const LinkLine = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '12px',
}));

const EventInfoBox = styled('div')(({ theme }) => ({
  maxWidth: '270px',
  fontSize: '16px',
  color: theme.palette.grey[0],
}));

// ----------------------------------------------------------------------

export default function HomeEvent() {
  const theme = useTheme();
  const isDesktop = useResponsive('up', 'sm');

  return (
    <RootStyle>
      <EventSection>
        <Container maxWidth={false} sx={{ px: { xs: '12px', lg: '80px' } }}>
          <EventContents>
            <Box
              component="h1"
              sx={{
                typography: 'banner1',
                color: theme.palette.primary.main,
                mb: { xs: '24px', lg: '64px' },
              }}
            >
              {isDesktop ? (
                <span>
                  UPCOMING
                  <br />
                  EVENT
                </span>
              ) : (
                <span>
                  UPCOM-
                  <br />
                  ING
                  <br />
                  EVENT
                </span>
              )}
            </Box>
            <LinkLine>
              <TagBox>
                <TagThumbnail>
                  <Image src="/assets/img/img-thumbnail.jpg" />
                </TagThumbnail>
                <Link
                  href="#"
                  sx={{
                    fontSize: '16px',
                    color: theme.palette.grey[0],
                  }}
                >
                  @iloveseoul
                </Link>
              </TagBox>
              <Chip label="ART" variant="outlined" />
            </LinkLine>

            <Box
              component="h2"
              sx={{
                fontSize: { xs: '48px', lg: '80px' },
                lineHeight: { xs: '44px', lg: '76px' },
                textTransform: 'uppercase',
                color: theme.palette.grey[0],
                mb: '12px',
              }}
            >
              General
              <br />
              Admission
              <br />
              NFT.London
            </Box>
            <Typography
              variant="subtitle1"
              sx={{
                color: theme.palette.grey[0],
                pb: { xs: '263px', lg: '412px' },
              }}
            >
              November 11 - 13, 2023
            </Typography>

            <EventInfoBox>
              <Box
                sx={{
                  borderBottom: '1px solid rgba(255,255,255,.2)',
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    lineHeight: 1,
                    mb: '6px',
                  }}
                >
                  Reserve Price
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: '12px',
                  }}
                >
                  $ 37.45(Ξ 0.02871)
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    lineHeight: 1,
                    mt: '12px',
                    mb: '6px',
                  }}
                >
                  Location
                </Typography>
                <Typography variant="subtitle1">HQ Beercade Nashville Nashville, TN</Typography>
              </Box>
            </EventInfoBox>
          </EventContents>
        </Container>
      </EventSection>
    </RootStyle>
  );
}
