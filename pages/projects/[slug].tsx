import React, { ReactElement, useEffect, useState } from 'react';
import { styled, useTheme, Container, Grid, Stack, Typography, Box, Modal } from '@mui/material';
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT, SUCCESS } from 'src/config';
import Layout from 'src/layouts';
import { IconButtonAnimate, Page, Scrollbar } from 'src/components';
import { useRouter } from 'next/router';
import { getProjectInfo } from 'src/services/services';
import { TicketInfoTypes, TicketItemTypes } from 'src/@types/ticket/ticketTypes';
import useActiveWeb3React from 'src/hooks/useActiveWeb3React';
import useAccount from 'src/hooks/useAccount';
import { getItemSold, getWhlBalanceNoSigner } from 'src/utils/transactions';
import CSnackbar from 'src/components/common/CSnackbar';
import { Label, Section, Value } from 'src/components/my-tickets/StyledComponents';
import CompanyInfo from 'src/components/ticket/CompanyInfo';
import ScheduleCard from 'src/components/ticket/ScheduleCard';
import TicketItemsInDrop from 'src/sections/@eternaledtions/items/TicketItemsInDrop';
import RoundedButton from 'src/components/common/RoundedButton';
import CloseIcon from 'src/assets/icons/close';
import { ProjectItemTypes, ProjectTypes } from 'src/@types/project/projectTypes';
import ProjectPostItemContent from 'src/sections/@eternaledtions/projects/ProjectPostItemContent';

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

export default function ProjectDetailPage() {
  const router = useRouter();
  const theme = useTheme();
  const { chainId } = useActiveWeb3React();
  const { account } = useAccount();
  const { slug } = router.query;
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [ticketInfo, setTicketInfo] = useState<TicketInfoTypes | null>(null);
  const [projectInfo, setProjectInfo] = useState<ProjectTypes | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    type: '',
    message: '',
  });
  const { id, mysteryboxItems, boxContractAddress, quote } = ticketInfo || {};

  const handleCloseSnackbar = () => {
    setOpenSnackbar({
      open: false,
      type: '',
      message: '',
    });
  };

  const fetchProjectInfo = async () => {
    if (slug && typeof slug === 'string') {
      const res = await getProjectInfo(slug);
      if (res.data.status === SUCCESS) {
        const curCollectionId = res.data.data.info.id;
        const curCollectionName = res.data.data.detail.projectItems.find(
          (project: ProjectItemTypes) => project.infoId === curCollectionId
        ).title;
        setProjectInfo({
          ...res.data.data.detail,
          curCollectionId: curCollectionId,
          curCollectionName: curCollectionName,
        });
        const ticketInfo = res.data.data.info;
        const contract = ticketInfo.boxContractAddress;
        const whitelist = ticketInfo.whitelistNftId;
        const whitelistAddress = ticketInfo.whitelistNftContractAddress ?? '';
        const temp =
          ticketInfo &&
          (await Promise.all(
            ticketInfo.mysteryboxItems?.map(async (item: TicketItemTypes) => {
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
              return {
                ...item,
                remain: item.issueAmount - sold,
                whlBool,
                whlBalance,
              };
            })
          ));

        setTicketInfo({ ...ticketInfo, mysteryboxItems: temp });
      }
    }
  };

  const getStatus = (projectItem: ProjectItemTypes) => {
    const today = new Date();
    const startDate = new Date(projectItem.startDate);
    if (projectItem.infoId === ticketInfo?.id) return 'minting';
    else if (startDate < today) return 'ended';
    else return 'upcoming';
  };

  useEffect(() => {
    fetchProjectInfo();
  }, [slug, account]);

  return (
    <Page title={`${projectInfo?.title.toUpperCase()} - Ticket`}>
      <RootStyle>
        <Container>
          <Grid container spacing={5} direction="row">
            <Grid item xs={12} md={5} lg={6}>
              <ProjectPostItemContent project={projectInfo} shouldHideDetail />
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
                {projectInfo?.title}
              </Typography>

              <Grid container>
                <Grid item md={6}>
                  <Section>
                    <Label>Minted by</Label>
                    <CompanyInfo
                      account={'0x8B7B2b4F7A391b6f14A81221AE0920a9735B67Fc'}
                      image={projectInfo?.featured?.company.image}
                      label={`@${projectInfo?.featured?.company.name.en || ''}`}
                      sx={{ opacity: 1 }}
                    />
                  </Section>
                </Grid>
              </Grid>

              <Section>
                <Label>Description</Label>
                <Value>{projectInfo?.description}</Value>
              </Section>

              <Section>
                <RoundedButton onClick={() => setDescriptionOpen(true)}>
                  Show Ticket Detail
                </RoundedButton>
              </Section>

              <Section>
                <Label>Mint Schedule</Label>

                <Stack gap={0.25}>
                  {projectInfo?.projectItems.map((project: ProjectItemTypes, index) => (
                    <ScheduleCard
                      key={index}
                      title={project.title}
                      status={getStatus(project)}
                      date={project.startDate}
                    />
                  ))}
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
              <img src={projectInfo?.image} alt="description" />
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
