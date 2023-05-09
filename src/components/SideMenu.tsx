import { Tab, tabClasses, Tabs, tabsClasses, useTheme } from '@mui/material';
import React from 'react';
import Routes from 'src/routes';
import { useRouter } from 'next/router';
import { useResponsive } from 'src/hooks';

const LINKS = [
  {
    title: 'PROFILE',
    route: Routes.eternalEditions.my.account,
  },
  {
    title: 'MY ITEMS',
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
  label: string;
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

export default function SideMenu() {
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
      {LINKS.map((link) => (
        <LinkTab key={link.title} label={link.title} value={link.route} href={link.route} />
      ))}
    </Tabs>
  );
}
