import { ReactNode } from 'react';
// next
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';
//
const Header = dynamic(() => import('./header/Header'), { ssr: false });
const HeaderSimple = dynamic(() => import('./header/HeaderSimple'), { ssr: false });
const Footer = dynamic(() => import('./footer/Footer'), { ssr: false });
const FooterSimple = dynamic(() => import('./footer/FooterSimple'), { ssr: false });

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
  transparentHeader?: boolean;
  disabledHeader?: boolean;
  disabledFooter?: boolean;
  simpleHeader?: boolean;
  simpleFooter?: boolean;
  verticalAlign?: 'top' | 'center' | 'bottom';
  headerSx?: object;
  background?: object;
};

export default function Layout({
  children,
  transparentHeader,
  disabledHeader,
  disabledFooter,
  simpleHeader,
  simpleFooter,
  verticalAlign = 'center',
  background,
  headerSx,
}: Props) {
  return (
    <Box sx={{ ...background }}>
      {disabledHeader ? null : (
        <>
          {simpleHeader ? (
            <HeaderSimple transparent={transparentHeader} />
          ) : (
            <Header sx={headerSx} transparent={transparentHeader} />
          )}
        </>
      )}

      <Box className="ORIGIN" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {['center', 'bottom'].includes(verticalAlign) && <Box sx={{ flexGrow: 1 }} />}
        {children}
        {['center', 'top'].includes(verticalAlign) && <Box sx={{ flexGrow: 1 }} />}
      </Box>
      {disabledFooter ? null : <>{simpleFooter ? <FooterSimple /> : <Footer />}</>}
    </Box>
  );
}
