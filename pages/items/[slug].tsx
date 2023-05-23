import React, { ChangeEvent, PropsWithChildren, ReactElement, useEffect, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
  Divider,
  Fade,
  Grid,
  TextField,
  Modal,
  SelectChangeEvent,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  accordionSummaryClasses,
  AccordionDetails,
  useTheme,
  outlinedInputClasses,
} from '@mui/material';
// config
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT, SUCCESS } from 'src/config';
// @types
import { BigNumber, ethers } from 'ethers';
// layouts
import Layout from 'src/layouts';
// components
import { Page, TextIconLabel } from 'src/components';
// sections
import { useRouter } from 'next/router';
import { getSellbookInfoByID } from 'src/services/services';
import { TicketInfoTypes, TicketItemTypes } from 'src/@types/ticket/ticketTypes';
import { useResponsive } from 'src/hooks';

import CSnackbar from 'src/components/common/CSnackbar';

import { useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import CompanyInfo from 'src/components/ticket/CompanyInfo';
import Badge from 'src/components/ticket/Badge';
import { TicketName } from 'src/components/ticket/TicketName';
import { CardWrapper } from 'src/components/ticket/CardWrapper';
import { CardInner } from 'src/components/ticket/CardInner';
import { Label, Row, TotalValue, Value } from 'src/components/my-tickets/StyledComponents';
import Timer from 'src/components/Timer';
import { RoundedSelect, RoundedSelectOption } from 'src/components/common/Select';
import RoundedButton from 'src/components/common/RoundedButton';
import { ArrowDropDown } from '@mui/icons-material';
import moment from 'moment';
import FixedBackground from 'src/components/common/FixedBackground';

const PAY_TYPE = [
  {
    label: 'PAY WITH EDCP',
    value: 'edcp',
  },
  {
    label: 'PAY WITH USDC',
    value: 'usdc',
  },
];

type SellBookTypes = {
  id: number;
  infoId: number;
  itemId: number;
  mysteryboxInfo: TicketInfoTypes;
  mysteryboxItem: TicketItemTypes;
  type: number;
  uid: string;
  wallet: string;
  sellInfo: any;
  price: number;
  createdAt: Date;
  updatedAt: Date;
};

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  paddingBottom: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
    paddingBottom: HEADER_DESKTOP_HEIGHT,
    minHeight: '100vh',
  },
  // background: 'red'
}));

// ----------------------------------------------------------------------

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

export default function TicketDetailPage() {
  const theme = useTheme();
  const router = useRouter();
  const { slug } = router.query;
  const isMobile = useResponsive('down', 'md');
  const abcUser = useSelector((state: any) => state.user);
  const [dollarPrice, setDollarPrice] = useState(0);
  const [payType, setPayType] = useState('default');
  const [abcToken, setAbcToken] = useState('');
  const [abcOpen, setAbcOpen] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [sellbookInfo, setSellbookInfo] = useState<SellBookTypes>();
  const [day, setDay] = useState('');
  const [team, setTeam] = useState('');
  const [isOnAuction, setIsOnAuction] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    type: '',
    message: '',
  });
  const handleCloseSnackbar = () => {
    setOpenSnackbar({
      open: false,
      type: '',
      message: '',
    });
  };

  const handleAbcClose = () => {
    setAbcToken('');
    setAbcOpen(false);
  };

  const fetchSellbookInfo = async () => {
    if (typeof slug === 'string') {
      const res = await getSellbookInfoByID(slug);
      console.log(res);
      setSellbookInfo(res.data.data.sellbook);
      if (res.data.data.sellbook.type === 1) setIsOnAuction(false);
      else setIsOnAuction(true);
      if (
        res.data.data.sellbook.mysteryboxItem &&
        res.data.data.sellbook.mysteryboxItem.properties
      ) {
        const { properties } = res.data.data.sellbook.mysteryboxItem;
        if (properties) {
          properties.map((property: any) =>
            property.type === 'team'
              ? setTeam(property.name)
              : property.type === 'day'
              ? setDay(property.name)
              : null
          );
        }
      }
    }
  };

  const handleClickBuy = async () => {
    console.log('buy now');
    console.log(`pay type :: ${payType}`);
  };

  const handleClickBid = async () => {
    console.log('click bid');
  };

  useEffect(() => {
    if (slug) fetchSellbookInfo();
  }, [slug]);

  return (
    <Page title={`${slug} - Ticket`}>
      {/* background */}

      {sellbookInfo && (
        <>
          <FixedBackground url={`url(${sellbookInfo.mysteryboxItem.itemImage})`} />
          <RootStyle>
            <Container>
              <Grid
                container
                spacing={8}
                direction="row"
                sx={{ [theme.breakpoints.down('md')]: { pt: '480px' } }}
              >
                <Grid
                  item
                  xs={12}
                  md={7}
                  lg={6}
                  sx={{
                    ml: {
                      md: 'auto',
                    },
                  }}
                >
                  <CardWrapper>
                    <CardInner>
                      <Stack flexDirection="row" justifyContent="space-between">
                        <CompanyInfo
                          account={'0x8B7B2b4F7A391b6f14A81221AE0920a9735B67Fc'}
                          image={''}
                          label={`by @${sellbookInfo.mysteryboxInfo.featuredId}`}
                        />

                        {isOnAuction ? (
                          <Badge
                            label="On Auction"
                            style={{
                              background: 'linear-gradient(180deg, #08FF0C 0%, #4ADEFF 76.56%)',
                              '-webkit-background-clip': 'text',
                              '-webkit-text-fill-color': 'transparent',
                              backgroundClip: 'text',
                              textFillColor: 'transparent',
                              border: '1px solid',
                            }}
                          />
                        ) : (
                          <Badge label="For Sale" />
                        )}
                      </Stack>

                      <TicketName>{sellbookInfo.mysteryboxItem.name}</TicketName>

                      <Stack gap={{ xs: '16px', md: '7px' }}>
                        <Row>
                          <Label>Day</Label>
                          <Value>{day}</Value>
                        </Row>
                        <Row>
                          <Label>Team</Label>
                          <Value>{team}</Value>
                        </Row>
                        {moment(sellbookInfo.mysteryboxInfo.releaseDatetime).diff(moment()) /
                          1000 >=
                          0 && (
                          <Row>
                            <Label>Auction ends in</Label>
                            <Timer
                              as={Value}
                              releasedDate={sellbookInfo.mysteryboxInfo.releaseDatetime}
                            />
                          </Row>
                        )}
                      </Stack>

                      <Divider />

                      <Stack gap={{ xs: '24px', md: '12px' }}>
                        {isOnAuction ? (
                          <Row>
                            <Label>Starting Price</Label>
                            <Stack flexDirection="row" gap={0.5} sx={{ color: 'red' }}>
                              {/*<TotalValue>{`${(dollarPrice / 10).toFixed(4)} EDCP`}</TotalValue>*/}
                              {/*<TotalValue*/}
                              {/*  sx={{ opacity: 0.6 }}*/}
                              {/*>{`(~$${sellbookInfo.price})`}</TotalValue>*/}
                              <TotalValue>{`${sellbookInfo.price} EDCP`}</TotalValue>
                              <TotalValue sx={{ opacity: 0.6 }}>{`(~$${'0'})`}</TotalValue>
                            </Stack>
                          </Row>
                        ) : null}

                        <Row>
                          <Label>Current Price</Label>
                          <Stack flexDirection="row" gap={0.5}>
                            <TotalValue>{`${sellbookInfo.price} EDCP`}</TotalValue>
                            <TotalValue sx={{ opacity: 0.6 }}>{`(~$${'0'})`}</TotalValue>
                          </Stack>
                        </Row>
                      </Stack>

                      <Stack gap={0.25} mt={{ xs: 0, md: '142px' }}>
                        {isOnAuction ? (
                          <>
                            <TextField
                              variant="outlined"
                              placeholder="Please enter your offer"
                              sx={{
                                [`.${outlinedInputClasses.notchedOutline}`]: {
                                  borderRadius: '60px',
                                },
                                [`.${outlinedInputClasses.root}:not(.Mui-focused) .${outlinedInputClasses.notchedOutline}`]:
                                  {
                                    border: '1px solid #F5F5F5',
                                  },
                                [`.${outlinedInputClasses.input}`]: {
                                  textAlign: 'center',
                                  fontSize: '14px',
                                  lineHeight: 12 / 14,
                                  letterSpacing: '0.08em',
                                  fontWeight: 'bold',
                                  [theme.breakpoints.down('md')]: {
                                    fontSize: 12,
                                    lineHeight: 13 / 12,
                                  },
                                },
                                [`.${outlinedInputClasses.input}::placeholder`]: {
                                  color: 'rgba(255, 255, 255, 0.4)',
                                  textTransform: 'uppercase',
                                },
                              }}
                            />
                            <RoundedButton
                              onClick={handleClickBid}
                              fullWidth
                              variant={isMobile ? 'inactive' : 'default'}
                            >
                              PLACE BID
                            </RoundedButton>
                          </>
                        ) : (
                          <>
                            <RoundedSelect
                              value={payType}
                              onChange={(event) => setPayType(event.target.value as string)}
                            >
                              <RoundedSelectOption value="default" hidden>
                                Select pay type
                              </RoundedSelectOption>
                              {PAY_TYPE.map((option) => (
                                <RoundedSelectOption key={option.value} value={option.value}>
                                  {option.label}
                                </RoundedSelectOption>
                              ))}
                            </RoundedSelect>

                            <RoundedButton
                              onClick={handleClickBuy}
                              fullWidth
                              sx={{ backgroundColor: theme.palette.primary.main }}
                            >
                              Buy Now
                            </RoundedButton>
                          </>
                        )}
                      </Stack>

                      <Stack gap={2}>
                        <DetailAccordion title={'Description'}>
                          {sellbookInfo.mysteryboxInfo.introduction.en}
                        </DetailAccordion>

                        <DetailAccordion title={'About new Reality Now'} sx={{ color: 'red' }}>
                          Our mission is to cultivate and incentivize a space for collective
                          wellness. A utopia where holders can access live coaches and specialists
                          to grow the mind, body, and spirit all within a safe community.
                        </DetailAccordion>
                      </Stack>
                    </CardInner>
                  </CardWrapper>
                </Grid>
              </Grid>
            </Container>
          </RootStyle>

          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={abcOpen}
            onClose={handleAbcClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={abcOpen}>
              <Box sx={modalStyle}>
                Google OTP :
                <Typography variant="body3">
                  Please check the 6-digit code in Google Authenticator and enter it.
                </Typography>
                <TextField
                  sx={{ mt: 2 }}
                  inputProps={{ style: { color: '#999999' } }}
                  fullWidth
                  variant="standard"
                  label="Verification code"
                  placeholder="Please Enter"
                  value={abcToken}
                  // onChange={handleAbcTokenChange}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: '10px' }}>
                  <LoadingButton
                    variant="outlined"
                    size="medium"
                    sx={{
                      width: '100% !important',
                      height: '36px',
                      fontSize: 12,
                      backgroundColor: '#f1f2f5',
                      borderColor: '#f1f2f5',
                      color: '#000000',
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: '#08FF0C',
                        borderColor: '#08FF0C',
                        color: '#ffffff',
                        boxShadow: 'none',
                      },
                      '&:active': {
                        boxShadow: 'none',
                        backgroundColor: 'background.paper',
                        borderColor: 'background.paper',
                        color: '#ffffff',
                      },
                    }}
                    // onClick={handleAbcConfirmClick}
                    loading={otpLoading}
                    disabled={otpLoading}
                  >
                    확인
                  </LoadingButton>
                </Box>
              </Box>
            </Fade>
          </Modal>

          <CSnackbar
            open={openSnackbar.open}
            type={openSnackbar.type}
            message={openSnackbar.message}
            handleClose={handleCloseSnackbar}
          />
        </>
      )}
    </Page>
  );
}

// ----------------------------------------------------------------------

TicketDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout verticalAlign="top">{page}</Layout>;
};

// ----------------------------------------------------------------------

type Params = {
  params: {
    slug: string;
  };
};

type LineItemProps = {
  icon?: ReactElement;
  label: string;
  value: any;
  isBuying?: boolean;
  style: any;
};

function LineItemByModal({ icon, label, value, isBuying, style }: LineItemProps) {
  const isXs = useResponsive('down', 'sm');
  return (
    <TextIconLabel
      style={style}
      icon={icon!}
      value={
        <>
          <Typography
            sx={{
              fontSize: isXs ? '12px' : '14px',
              color: 'common.black',
            }}
          >
            {label}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              flexGrow: 1,
              textAlign: 'right',
              color: 'common.black',
              fontSize: isXs ? '14px' : '16px',
              fontWeight: 'bold',
            }}
          >
            {value}
          </Typography>
        </>
      }
      sx={{
        color: 'text.primary',
        cursor: 'pointer',
        '& svg': { mr: 1, width: 24, height: 24 },
        mb: 1,
        padding: '14px 24px',
        borderRadius: '50px',
        bgcolor: '#F5F5F5',
        '&:hover': {
          bgcolor: 'primary.main',
        },
      }}
    />
  );
}

const DetailAccordion = ({ title, children, sx }: PropsWithChildren<{ title: string }>) => (
  <Accordion
    sx={{
      ...sx,
      '&:before': {
        content: 'none',
      },
      '&:last-of-type': {
        border: 'none',
      },
    }}
  >
    <AccordionSummary
      sx={{
        fontWeight: 'bold',
        fontSize: 12,
        lineHeight: 13 / 12,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        width: 'max-content',
        [`&.${accordionSummaryClasses.root}`]: {
          minHeight: 'unset',
        },
        [`.${accordionSummaryClasses.content}`]: {
          margin: 0,
        },
        [`.${accordionSummaryClasses.content}.Mui-expanded`]: {
          margin: 0,
        },
      }}
      expandIcon={<ArrowDropDown sx={{ color: 'white', fontSize: 16 }} />}
    >
      {title}
    </AccordionSummary>
    <AccordionDetails
      sx={{ fontSize: 14, lineHeight: 20 / 14, paddingTop: '8px', paddingBottom: 0 }}
    >
      {children}
    </AccordionDetails>
  </Accordion>
);
