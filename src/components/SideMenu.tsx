import {
  Chip,
  chipClasses,
  Stack,
  Tab,
  tabClasses,
  Tabs,
  tabsClasses,
  useTheme,
} from '@mui/material';
import React, { ReactNode } from 'react';
import Routes from 'src/routes';
import { useRouter } from 'next/router';
import { useResponsive } from 'src/hooks';

const LINKS = [
  {
    title: 'PROFILE',
    route: Routes.eternalEditions.my.account,
  },
  {
    title: ({ chipLabel }: { chipLabel?: number | string }) => (
      <Stack flexDirection="row" alignItems="center" gap={0.5} sx={{ color: 'inherit' }}>
        <span>MY ITEMS</span>
        {chipLabel ? (
          <Chip
            label={chipLabel}
            color="primary"
            sx={{
              fontWeight: 'bold',
              fontSize: 12,
              lineHeight: 13 / 12,
              color: 'black !important',
              height: 'unset',
              verticalAlign: 'center',
              [`& .${chipClasses.label}`]: {
                padding: '0px 6px',
              },
            }}
          />
        ) : null}
      </Stack>
    ),
    route: Routes.eternalEditions.my.tickets,
  },
  {
    title: 'TRANSACTION',
    route: Routes.eternalEditions.my.transaction,
  },
  {
    title: 'FAQ',
    route: Routes.eternalEditions.faq,
  },
  {
    title: 'NOTICE',
    route: Routes.eternalEditions.notice,
  },
  {
    title: 'CONTACT US',
    route: '',
  },
];

interface LinkTabProps {
  label: string | ReactNode;
  value: string;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

function LinkTab(props: LinkTabProps) {
  const theme = useTheme();

  return (
    <Tab
      component="a"
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
      }}
      sx={{
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: 12 / 14,
        minHeight: 'unset',
        alignItems: 'flex-start',
        [`&.${tabClasses.selected}`]: {
          color: theme.palette.primary.main,
        },
      }}
      {...props}
    />
  );
}

interface Props {
  chipLabel?: number | string;
}

export default function SideMenu({ chipLabel }: Props) {
  const router = useRouter();
  const isMobile = useResponsive('down', 'md');

  return (
    <Tabs
      value={router.pathname}
      variant="scrollable"
      orientation={isMobile ? 'horizontal' : 'vertical'}
      TabIndicatorProps={{ sx: { display: 'none' } }}
      sx={{
        [`& .${tabsClasses.flexContainer}`]: {
          gap: 2,
        },
      }}
    >
      {LINKS.map((link) => {
        const LinkTitle = link.title;

        return (
          <LinkTab
            key={link.route}
            label={typeof LinkTitle === 'string' ? LinkTitle : <LinkTitle chipLabel={chipLabel} />}
            value={link.route}
            href={link.route}
          />
        );
      })}
    </Tabs>
  );
}
