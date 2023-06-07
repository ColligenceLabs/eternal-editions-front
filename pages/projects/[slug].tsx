import React, { ReactElement, useEffect, useState } from 'react';
import { styled, useTheme, Container, Grid, Stack, Typography, Box, Modal } from '@mui/material';
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT, SUCCESS } from 'src/config';
import Layout from 'src/layouts';
import { IconButtonAnimate, Page, Scrollbar } from 'src/components';
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
import RoundedButton from 'src/components/common/RoundedButton';
import CloseIcon from 'src/assets/icons/close';

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  paddingBottom: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
    paddingBottom: HEADER_DESKTOP_HEIGHT,
  },
}));

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 400,
  width: 'calc(100% - 2rem)',
  bgcolor: 'common.white',
  color: 'common.black',
  border: 'none',
  borderRadius: '24px',
  boxShadow: 24,
  pt: 2,
  pb: 2,
  pl: 3,
  pr: 3,
};

const data = [
  {
    collectionId: 6,
    description: '1111',
    id: 640,
    projectImage: 'asdf',
    startDate: '2023-06-01T03:13:12.299Z',
    title: 'TEST1-1',
  },
  {
    collectionId: 6,
    description: '1111',
    id: 642,
    projectImage: 'asdf',
    startDate: '2023-06-02T03:13:12.299Z',
    title: 'TEST1-1',
  },
  {
    collectionId: 6,
    description: '1111',
    id: 647,
    projectImage: 'asdf',
    startDate: '2023-06-03T03:13:12.299Z',
    title: 'TEST1-1',
  },
];

export default function ProjectDetailPage() {
  const router = useRouter();
  const theme = useTheme();
  const { chainId } = useActiveWeb3React();
  const { account } = useAccount();
  const { slug } = router.query;
  const [curCollection, setCurCollection] = useState<number | null>(null);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
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

            // if (properties) {
            //   properties.map((property) =>
            //     property.type === 'day'
            //       ? setDay(property.name)
            //       : property.type === 'location'
            //       ? setLocation(property.name)
            //       : null
            //   );
            // }
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

  useEffect(() => {
    const today = new Date(); // Get today's date
    const filteredData = data.filter((item) => {
      const startDate = new Date(item.startDate);
      return startDate >= today;
    });

    if (filteredData.length > 0) {
      const closestData = filteredData.reduce((closest, current) => {
        const closestDate = new Date(closest.startDate);
        const currentDate = new Date(current.startDate);
        return currentDate < closestDate ? current : closest;
      });

      setCurCollection(closestData.id);
      console.log(closestData.id);
    }
  }, [data]);

  useEffect(() => {
    return () => {
      console.log(curCollection);
    };
  }, [curCollection]);

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
              </Grid>

              <Section>
                <Label>Description</Label>
                {ticketInfo && <Value>{ticketInfo.introduction.en}</Value>}
              </Section>

              <Section>
                <RoundedButton onClick={() => setDescriptionOpen(true)}>
                  Show Ticket Detail
                </RoundedButton>
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

      <Modal
        open={descriptionOpen}
        onClose={() => setDescriptionOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            ...modalStyle,
            maxWidth: 1200,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              right: '2rem',
              top: '2rem',
              zIndex: 1,
            }}
          >
            <IconButtonAnimate
              color="inherit"
              onClick={() => setDescriptionOpen(false)}
              sx={{
                bgcolor: 'rgba(0,0,0,.3)',
                transition: 'all .3s',
                '&:hover': {
                  bgcolor: '#454F5B',
                },
              }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CloseIcon />
              </Box>
            </IconButtonAnimate>
          </Box>

          <Box
            sx={{
              overflow: 'scroll',
              maxHeight: 'calc(100vh - 6rem)',
              position: 'relative',
              img: { width: 1 },
            }}
          >
            <Scrollbar sx={{ py: { xs: 3, md: 0 } }}>
              {ticketInfo?.bannerImage && <img src={ticketInfo?.bannerImage} alt="description" />}
              {/*{ticketInfo.bannerImage && <img src={ticketInfo.bannerImage} alt="description" />}*/}
            </Scrollbar>
          </Box>
        </Box>
      </Modal>
    </Page>
  );
}

ProjectDetailPage.getLayout = function getLayout(page: ReactElement) {
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
