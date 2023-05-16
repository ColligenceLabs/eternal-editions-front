import { ReactElement, useEffect, useState } from 'react';
import Layout from 'src/layouts';
import { Page } from 'src/components';
import { Container, useTheme } from '@mui/material';
import MyTicketSell from 'src/sections/@my/MyTicketSell';
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT, SUCCESS } from 'src/config';
import { useRouter } from 'next/router';
import { getSellItemInfo } from 'src/services/services';
import { MyTicketTypes } from 'src/@types/my/myTicket';
import FixedBackground from 'src/components/common/FixedBackground';

// ----------------------------------------------------------------------

export default function MyTicketSellPage() {
  const theme = useTheme();
  const router = useRouter();
  const [sellTicketInfo, setSellTicketInfo] = useState<MyTicketTypes | null>(null);

  const fetchSellItemInfo = async (id: string) => {
    const res = await getSellItemInfo(id);
    if (res.data.status === SUCCESS) {
      setSellTicketInfo(res.data.data);
    }
    console.log(res);
  };
  useEffect(() => {
    if (router.query.slug) {
      console.log(router);
      fetchSellItemInfo(router.query.slug as string);
    }
  }, [router]);

  return (
    <Page title="Sell">
      {sellTicketInfo && (
        <>
          {/*<FixedBackground url={`url(/assets/background/bg-my-items-sell.jpg)`} />*/}
          <FixedBackground url={`url(${sellTicketInfo.mysteryboxItem.itemImage})`} />
          <Container
            sx={{
              paddingTop: `${HEADER_MOBILE_HEIGHT}px`,
              paddingBottom: '32px',
              [theme.breakpoints.up('md')]: {
                paddingTop: `${HEADER_DESKTOP_HEIGHT}px`,
                paddingBottom: '45px',
                height: '100vh',
              },
            }}
          >
            <MyTicketSell sellTicketInfo={sellTicketInfo} />
          </Container>
        </>
      )}
    </Page>
  );
}

// ----------------------------------------------------------------------

MyTicketSellPage.getLayout = function getLayout(page: ReactElement) {
  console.log(page);
  return (
    <Layout verticalAlign="top" disabledFooter>
      {page}
    </Layout>
  );
};
