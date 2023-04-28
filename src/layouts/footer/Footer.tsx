// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Link as MLink, Stack, Container, LinkProps, Typography } from '@mui/material';
import Link from 'next/link';
// hooks
import { useResponsive } from '../../hooks';
// components
import { Image } from 'src/components';
//
import { PageLinks } from '../nav/NavConfig';

const ICONS = [
  {
    link: 'https://www.instagram.com/ee_dao_official/',
    icon: '/assets/icons/icon-instagram.svg',
  },
  {
    link: 'https://eternaledtions.gitbook.io/kor/introduction',
    icon: '/assets/icons/icon-gitbook.svg',
  },
  {
    link: 'https://discord.com/invite/eternaleditions',
    icon: '/assets/icons/icon-discord.svg',
  },
  {
    link: 'https://twitter.com/ee_dao_official',
    icon: '/assets/icons/icon-twitter.svg',
  },
];

// ----------------------------------------------------------------------

const LinkStyle = styled((props: LinkProps) => <MLink target="_blank" rel="noopener" {...props} />)(
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
            },
          }}
        >
          <Image
            sx={{
              width: '122px',
              mb: '50px',
              [theme.breakpoints.up('md')]: {
                mb: 0,
              },
            }}
            src="/assets/img/footer-logo.svg"
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              'a + a': {
                ml: '22px',
              },
            }}
          >
            {ICONS.map((item, index) => (
              <MLink href={item.link} target="_blank" key={index}>
                <Image sx={{ width: '20px' }} src={item.icon} />
              </MLink>
            ))}
          </Box>
        </Box>
        <Box
          component="p"
          sx={{
            typography: 'caption',
            mb: '16px',
          }}
        >
          Representative Director : Joon Young Lim
          <br />
          Biz. Number : 353-88-02481
          <br />
          Registration No. : 제 2017-서울마포-2244호
          <br />
          Address : 7th floor, 14, Teheran-ro 26 gil, Gangnam-gu, Seoul, Republic of Korea
          <br />
          CS Email : eternaleditions@gmail.com
        </Box>
        <Box>
          <Link href="/privacy" color="black">
            <span style={{ fontWeight: 'bold' }}>개인정보처리방침</span>
          </Link>{' '}
          |{' '}
          <Link href="/service_terms" color="black">
            <span>서비스 이용약관</span>
          </Link>
        </Box>
        <Box
          component="p"
          sx={{
            typography: 'caption',
          }}
        >
          COPYRIGHT ⓒ Eternal Editions. ALL RIGHTS RESERVED
        </Box>
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
