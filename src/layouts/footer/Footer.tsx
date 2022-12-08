import { useState } from 'react';
// next
import NextLink from 'next/link';
// icons
import chevronDown from '@iconify/icons-carbon/chevron-down';
import chevronRight from '@iconify/icons-carbon/chevron-right';
// @mui
import {styled, useTheme} from '@mui/material/styles';
import Masonry from '@mui/lab/Masonry';
import {
  Box,
  Grid,
  Link,
  Stack,
  Button,
  Divider,
  Collapse,
  Container,
  LinkProps,
  Typography,
  FilledInput,
  InputAdornment,
} from '@mui/material';
// hooks
import { useResponsive } from '../../hooks';
// components
import { Logo, Iconify, SocialsButton, AppStoreButton, Image } from '../../components';
//
import { PageLinks } from '../nav/NavConfig';
import Routes from "../../routes";

const ICONS = [
  '/assets/icons/icon-instagram.svg',
  '/assets/icons/icon-gitbook.svg',
  '/assets/icons/icon-discord.svg',
  '/assets/icons/icon-twitter.svg',
]

// ----------------------------------------------------------------------

const LinkStyle = styled((props: LinkProps) => <Link target="_blank" rel="noopener" {...props} />)(
  ({ theme }) => ({
    ...theme.typography.body3,
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.text.primary,
    },
  })
);

// ----------------------------------------------------------------------

export default function Footer() {
  const theme = useTheme();
  const isDesktop = useResponsive('up', 'md');

  const lists = PageLinks.filter((list) => list.subheader !== 'Coming Soon');

  const renderLists = isDesktop
    ? lists
    : lists.sort((listA, listB) => Number(listA.order) - Number(listB.order));

  return (
    <>
      <Container
        sx={{
          py: { xs: '14px', md: '26px' },
          px: { xs: '12px', md: '24px' },
          borderRadius: '24px',
          background: theme.palette.primary.main,
          color: theme.palette.grey[800],
        }}
        maxWidth={false}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            mb: '18px',
            [theme.breakpoints.up('md')]: {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: '16px',
            }
          }}
        >
          <Image
            sx={{
              width: '122px',
              mb: '50px',
              [theme.breakpoints.up('md')]: {
                mb: 0,
              }
            }}
            src='/assets/img/footer-logo.svg'
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              'a + a': {
                ml: '22px',
              }
            }}
          >
            {ICONS.map((src, index) => (
              <Link href="#" key={index}>
                <Image sx={{ width: '20px' }} src={src} />
              </Link>
            ))}
          </Box>
        </Box>
        <Box component="p" sx={{
          typography: 'caption',
          mb: '16px',
        }}>
          Eternal Editions CEO icksoo Han<br />
          7th floor, 14, Teheran-ro 26 gil, Gangnam-gu, Seoul<br />
          Republic of Korea
        </Box>
        <Box
          component="p"
          sx={ {
            typography: 'caption',
          }}
        >COPYRIGHT ⓒ Eternal Editions. ALL RIGHTS RESERVED</Box>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

type ListProps = {
  list: {
    subheader: string;
    items?: {
      title: string;
      path: string;
    }[];
  };
};

function ListDesktop({ list }: ListProps) {
  const { subheader, items } = list;

  return (
    <Stack alignItems="flex-start" sx={{ pb: { md: 1 } }}>
      <Typography variant="h6">{subheader}</Typography>
      {items?.map((link) => (
        <LinkStyle key={link.title} href={link.path}>
          {link.title}
        </LinkStyle>
      ))}
    </Stack>
  );
}
