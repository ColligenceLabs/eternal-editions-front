import React, { ReactElement, useEffect, useState } from 'react';
import { styled, useTheme, Container, Grid, Stack, Typography } from '@mui/material';
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT, SUCCESS } from 'src/config';
import Layout from 'src/layouts';
import { Page } from 'src/components';
import { useRouter } from 'next/router';
import { getTicketInfoService } from 'src/services/services';
import { TicketInfoTypes, TicketItemTypes } from 'src/@types/ticket/ticketTypes';
import useActiveWeb3React from 'src/hooks/useActiveWeb3React';
import useAccount from 'src/hooks/useAccount';
import { getItemSold, getWhlBalanceNoSigner } from 'src/utils/transactions';
import CSnackbar from 'src/components/common/CSnackbar';
import TicketPostItemContent from 'src/sections/@eternaledtions/tickets/TicketPostItemContent';
import { Label, Section, Value } from 'src/components/my-tickets/StyledComponents';
import CompanyInfo from 'src/components/ticket/CompanyInfo';
import ScheduleCard from 'src/components/ticket/ScheduleCard';
import TicketItemsInDrop from 'src/sections/@eternaledtions/items/TicketItemsInDrop';

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  paddingBottom: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
    paddingBottom: HEADER_DESKTOP_HEIGHT,
  },
}));

export default function TicketDetailPage() {
  const router = useRouter();
  const theme = useTheme();
  const { chainId } = useActiveWeb3React();
  const { account } = useAccount();
  const { slug } = router.query;

  const [ticketInfo, setTicketInfo] = useState<TicketInfoTypes | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    type: '',
    message: '',
  });

  const [day, setDay] = useState('');
  const [location, setLocation] = useState('');
  const { id, title, featured, mysteryboxItems, boxContractAddress, quote } = ticketInfo || {};

  const handleCloseSnackbar = () => {
    setOpenSnackbar({
      open: false,
      type: '',
      message: '',
    });
  };

  const fetchTicketInfo = async () => {
    if (slug && typeof slug === 'string') {
      const ticketInfoRes = await getTicketInfoService(slug);
      console.log(ticketInfoRes);
      const contract = ticketInfoRes.data.data?.boxContractAddress;
      const whitelist = ticketInfoRes.data.data?.whitelistNftId;
      const whitelistAddress = ticketInfoRes.data.data?.whitelistNftContractAddress ?? '';
      const temp =
        ticketInfoRes.data.data &&
        (await Promise.all(
          ticketInfoRes.data.data.mysteryboxItems?.map(async (item: TicketItemTypes) => {
            // todo getRemain
            const sold = await getItemSold(contract, item.no - 1, chainId);
            let whlBalance = 0;
            let whlBool = false;
            if (whitelist !== null && whitelist > 0 && account !== null) {
              whlBalance = await getWhlBalanceNoSigner(whitelistAddress, account, chainId);
              console.log('!! get whitelist balance =', account, whlBalance);
              whlBool = true;
              if (whlBool && whlBalance === 0) {
                setOpenSnackbar({
                  open: true,
                  type: 'error',
                  message: 'Not in the whitelist or a wallet is not connected !!',
                });
              }
            }
            const { properties } = item;

            if (properties) {
              properties.map((property) =>
                property.type === 'day'
                  ? setDay(property.name)
                  : property.type === 'location'
                  ? setLocation(property.name)
                  : null
              );
            }
            console.log(day);
            return {
              ...item,
              remain: item.issueAmount - sold,
              whlBool,
              whlBalance,
            };
          })
        ));

      if (ticketInfoRes.data.status === SUCCESS) {
        setTicketInfo({ ...ticketInfoRes.data.data, mysteryboxItems: temp });
      }
    }
  };

  useEffect(() => {
    fetchTicketInfo();
  }, [slug, account]);

  return (
    <Page title={`${slug} - Ticket`}>
      <RootStyle>
        <Container>
          <Grid container spacing={5} direction="row">
            <Grid item xs={12} md={5} lg={6}>
              <TicketPostItemContent ticket={ticketInfo} shouldHideDetail />
            </Grid>

            <Grid
              item
              xs={12}
              md={7}
              lg={6}
              sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}
            >
              <Typography
                variant={'h1'}
                sx={{
                  color: theme.palette.primary.main,
                  whiteSpace: 'pre-line',
                  textTransform: 'uppercase',
                }}
              >
                {title?.en}
              </Typography>

              <Grid container>
                <Grid item md={6}>
                  <Section>
                    <Label>Minted by</Label>
                    <CompanyInfo
                      account={'0x8B7B2b4F7A391b6f14A81221AE0920a9735B67Fc'}
                      image={featured?.company.image}
                      label={`@${featured?.company.name.en || ''}`}
                      sx={{ opacity: 1 }}
                    />
                  </Section>
                </Grid>

                <Grid item md={6}>
                  <Section>
                    <Label>Date</Label>
                    <Stack>
                      <Value>{day}</Value>
                      <Value>{location}</Value>
                    </Stack>
                  </Section>
                </Grid>
              </Grid>

              <Section>
                <Label>Description</Label>
                {ticketInfo && <Value>{ticketInfo.introduction.en}</Value>}
              </Section>

              <Section>
                <Label>Mint Schedule</Label>

                <Stack gap={0.25}>
                  <ScheduleCard
                    title="Whitelist Mint"
                    status="ended"
                    date={new Date('02,22,2023')}
                  />
                  <ScheduleCard
                    title="Exclusive Access #1"
                    status="minting"
                    date={new Date('02,22,2023')}
                  />
                  <ScheduleCard
                    title="Public Sale"
                    status="upcoming"
                    date={new Date('02,22,2023')}
                  />
                </Stack>
              </Section>
            </Grid>
          </Grid>

          <TicketItemsInDrop
            items={mysteryboxItems}
            boxContractAddress={boxContractAddress}
            quote={quote}
            mysterybox_id={id}
            ticketInfo={ticketInfo}
          />
        </Container>
      </RootStyle>

      <CSnackbar
        open={openSnackbar.open}
        type={openSnackbar.type}
        message={openSnackbar.message}
        handleClose={handleCloseSnackbar}
      />
    </Page>
  );
}

TicketDetailPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout
      verticalAlign="top"
      // transparentHeader={false}
      // headerSx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      background={{
        backgroundImage: {
          xs: `url(/assets/background/bg-main.jpg)`,
          md: `url(/assets/background/bg-drops.jpg)`,
        },
        backgroundPosition: 'bottom center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      {page}
    </Layout>
  );
};
