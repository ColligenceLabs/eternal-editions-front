import React, { PropsWithChildren, ReactElement, useEffect, useState } from 'react';
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
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  accordionSummaryClasses,
  AccordionDetails,
  useTheme,
  outlinedInputClasses,
} from '@mui/material';
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT, SUCCESS } from 'src/config';
import { ethers } from 'ethers';
import Layout from 'src/layouts';
import { Page, TextIconLabel, Scrollbar } from 'src/components';
import { getSellbookInfoByID, getSession, registerSellbookBuy } from 'src/services/services';
import { TicketInfoTypes, TicketItemTypes } from 'src/@types/ticket/ticketTypes';
import { useResponsive } from 'src/hooks';
import { useRouter } from 'next/router';
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
import useAccount from 'src/hooks/useAccount';
import { AbcWeb3Provider } from '@colligence/klip-web3-provider';
import Web3Modal from '@colligence/web3modal';
import secureLocalStorage from 'react-secure-storage';
import { fullfillment } from 'src/seaport/fullfillment';
import CloseIcon from 'src/assets/icons/close';
import { IconButtonAnimate } from 'src/components/animate';
import useActiveWeb3React from 'src/hooks/useActiveWeb3React';
import { bidOffer } from 'src/seaport/bidOffer';
import { fixedPriceSell } from 'src/seaport/fixedPriceSell';

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
  tokenId: number;
  endDate: string;
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
  const [offer, setOffer] = useState('');
  const [payType, setPayType] = useState('default');
  const [abcToken, setAbcToken] = useState('');
  const [abcOpen, setAbcOpen] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [sellbookInfo, setSellbookInfo] = useState<SellBookTypes>();
  const [day, setDay] = useState('');
  const [team, setTeam] = useState('');
  const [isOnAuction, setIsOnAuction] = useState(false);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    type: '',
    message: '',
  });

  const webUser = useSelector((state: any) => state.webUser);
  const { library, chainId } = useActiveWeb3React();
  const { account } = useAccount();
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
      if (res.data.data.sellbook.drop && res.data.data.sellbook.drop.usePoint) setPayType('edcp');
      else setPayType('usdc');
    }
  };

  const getAbcWeb3Provider = async () => {
    console.log('!!!!!!!!!! USE ABC-WEB3-PROVIDER !!!!!!!!!!');

    let provider: any = null;
    const rlt = await getSession();

    if (rlt.data?.providerAuthInfo) {
      // TODO: abc-web3-provider 초기화
      const id_token = rlt.data?.providerAuthInfo?.provider_token;
      const service = rlt.data?.providerAuthInfo?.provider;
      const data = JSON.parse(rlt.data?.providerAuthInfo?.provider_data);
      const email = data.email;
      console.log(service, id_token, data.email);

      const providerOptions = {
        abc: {
          package: AbcWeb3Provider, //required
          options: {
            bappName: 'web3Modal Example App', //required
            chainId: '0x13881',
            rpcUrl: 'https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78', //required
            email,
            id_token,
            serv: service,
          },
        },
      };
      const web3Modal = new Web3Modal({
        providerOptions: providerOptions, //required
      });

      // Connect Wallet
      const instance = await web3Modal.connect();

      if (instance) {
        const abcUser = JSON.parse(secureLocalStorage.getItem('abcUser') as string);
        console.log('==========================', abcUser);
        console.log(
          '=============>',
          abcUser && abcUser?.accounts ? abcUser?.accounts[0].ethAddress : 'No ethAddress'
        );

        provider = new ethers.providers.Web3Provider(instance);
        // await provider.enable();
        const signer = provider.getSigner();
        console.log('=============>', signer);
      }
    }
    return provider;
  };

  const buyWithPoint = async () => {
    // TODO : Banckend API 호출 (Fixed Price Sell Buy)
    const data = {
      buyer: webUser.user.uid,
      buyerAddress: account,
      price: sellbookInfo?.price,
      txHash: null,
    };
    console.log('!! buyWithPoint data = ', data);

    const result = await registerSellbookBuy(data, sellbookInfo?.id!);
    console.log('!! buyWithPoint result = ', result);
    if (result.data.status === SUCCESS) {
      setOpenSnackbar({
        open: true,
        type: 'success',
        message: 'Success BUY!',
      });
      router.push('/my/tickets');
    } else {
      setOpenSnackbar({
        open: true,
        type: 'error',
        message: 'Failed BUY!',
      });
    }
  };

  const offerWithPoint = async () => {
    if (parseFloat(offer) <= sellbookInfo?.price) {
      alert('Input bigger price than current price');
      return;
    }

    // TODO : Banckend API 호출 (English Auction Offer)
    const data = {
      buyer: webUser.user.uid,
      buyerAddress: account,
      price: offer,
      txHash: null,
    };
    console.log('!! offerWithPoint data = ', data);

    // const result = await registerSellbookOffer(data, sellbookInfo?.id!);
    // console.log('!! offerWithPoint result = ', result);
    // if (result.data.status === SUCCESS) {
    //   setOpenSnackbar({
    //     open: true,
    //     type: 'success',
    //     message: 'Success OFFER!',
    //   });
    //   router.push('/my/tickets');
    // } else {
    //   setOpenSnackbar({
    //     open: true,
    //     type: 'error',
    //     message: 'Failed OFFER!',
    //   });
    // }
  };

  const buyWithCrypto = async () => {
    // TODO : Seaport 호출
    let result;

    if (!library) {
      const provider = await getAbcWeb3Provider();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      result = await fullfillment(sellbookInfo?.sellInfo, account!, provider);
    } else if (library) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      result = await fullfillment(sellbookInfo?.sellInfo, account!, library);
    }
    // todo result 후 처리
    console.log('result 후 처리');
    if (result?.status === SUCCESS) {
      setOpenSnackbar({
        open: true,
        type: 'success',
        message: 'Success BUY!',
      });
      router.push('/my/tickets');
    } else {
      setOpenSnackbar({
        open: true,
        type: 'error',
        message: 'Failed BUY!',
      });
    }

    console.log('!! fullfillment result = ', result);

    if (result) {
      const data = {
        buyer: webUser.user.uid,
        buyerAddress: account,
        price: sellbookInfo?.price,
        txHash: result?.transactionHash,
      };

      await registerSellbookBuy(data, sellbookInfo?.id!);
    }
  };

  const offerWithCrypto = async () => {
    if (parseFloat(offer) <= sellbookInfo?.price) {
      alert('Input bigger price than current price');
      return;
    }

    // TODO : Seaport 호출
    let order;

    console.log('!! offerWithCrypto : sellbookInfo =', sellbookInfo);
    const endTime = Math.round(new Date(sellbookInfo?.endDate).getTime() / 1000);
    if (!library) {
      const provider = await getAbcWeb3Provider();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      order = await bidOffer(
        sellbookInfo?.mysteryboxInfo?.boxContractAddress,
        sellbookInfo?.tokenId ? sellbookInfo?.tokenId.toString() : '',
        offer,
        sellbookInfo?.mysteryboxInfo?.quote,
        chainId,
        endTime.toString(),
        sellbookInfo?.mysteryboxInfo?.creatorAddress,
        account,
        provider
      );
    } else if (library) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      order = await bidOffer(
        sellbookInfo?.mysteryboxInfo?.boxContractAddress,
        sellbookInfo?.tokenId ? sellbookInfo?.tokenId.toString() : '',
        offer,
        sellbookInfo?.mysteryboxInfo?.quote,
        chainId,
        endTime.toString(),
        sellbookInfo?.mysteryboxInfo?.creatorAddress,
        account,
        library
      );
    }

    console.log('!! auction offer result = ', order);

    // if (result) {
    //   const data = {
    //     buyer: webUser.user.uid,
    //     buyerAddress: account,
    //     price: sellbookInfo?.price,
    //     txHash: result?.transactionHash,
    //   };
    //
    //   await registerSellbookOffer(data, sellbookInfo?.id!);
    // }
  };

  const handleClickBuy = async () => {
    setIsLoading(true);
    console.log('buy now');
    console.log(`pay type :: ${payType}`);
    if (payType === 'edcp') await buyWithPoint();
    else await buyWithCrypto();
    setIsLoading(false);
  };

  const handleClickBid = async () => {
    console.log('click bid', offer);
    setIsLoading(true);
    console.log('offer now');
    console.log(`pay type :: ${payType}`);
    if (payType === 'edcp') await offerWithPoint();
    else await offerWithCrypto();
    setIsLoading(false);
  };

  const handleInputOffer = async (event: any) => {
    setOffer(event.target.value);
  };

  useEffect(() => {
    if (slug) fetchSellbookInfo();
  }, [slug]);

  console.log('------------------------', sellbookInfo);
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
                              <TotalValue>{`${
                                sellbookInfo.price
                              } ${payType.toUpperCase()}`}</TotalValue>
                              <TotalValue sx={{ opacity: 0.6 }}>{`(~$${'0'})`}</TotalValue>
                            </Stack>
                          </Row>
                        ) : null}

                        <Row>
                          <Label>Current Price</Label>
                          <Stack flexDirection="row" gap={0.5}>
                            {payType === 'edcp' ? (
                              <>
                                <TotalValue>{`${
                                  sellbookInfo.price / 10
                                } ${payType.toUpperCase()}`}</TotalValue>
                                <TotalValue
                                  sx={{ opacity: 0.6 }}
                                >{`(~$${sellbookInfo.price})`}</TotalValue>
                              </>
                            ) : (
                              <>
                                <TotalValue>{`${
                                  sellbookInfo.price
                                } ${payType.toUpperCase()}`}</TotalValue>
                                <TotalValue sx={{ opacity: 0.6 }}>{`(~$${
                                  payType === 'edcp' ? sellbookInfo.price / 10 : sellbookInfo.price
                                })`}</TotalValue>
                              </>
                            )}
                          </Stack>
                        </Row>
                      </Stack>

                      <Stack gap={0.25} mt={{ xs: 0, md: '142px' }}>
                        {isOnAuction ? (
                          <>
                            <TextField
                              variant="outlined"
                              placeholder="Please enter your offer"
                              value={offer}
                              onChange={handleInputOffer}
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
                              {/*<RoundedSelectOption value={payType} hidden>*/}
                              {/*  Select pay type*/}
                              {/*</RoundedSelectOption>*/}
                              {PAY_TYPE.filter((type) => type.value === payType).map((option) => (
                                <RoundedSelectOption key={option.value} value={option.value}>
                                  {option.label}
                                </RoundedSelectOption>
                              ))}
                            </RoundedSelect>

                            {isLoading ? (
                              <Box
                                sx={{
                                  // width: '100%',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  mt: '10px',
                                }}
                              >
                                <CircularProgress size={'2rem'} />
                              </Box>
                            ) : (
                              <RoundedButton
                                onClick={handleClickBuy}
                                fullWidth
                                sx={{ backgroundColor: theme.palette.primary.main }}
                              >
                                Buy Now
                              </RoundedButton>
                            )}
                          </>
                        )}
                      </Stack>

                      <Stack gap={2}>
                        <DetailAccordion title={'Description'}>
                          {sellbookInfo.mysteryboxInfo.introduction.en}
                        </DetailAccordion>

                        <DetailAccordion title={'About new Reality Now'}>
                          {sellbookInfo.mysteryboxInfo.bannerImage && (
                            <Box onClick={() => setDescriptionOpen(true)}>
                              <img
                                width="100%"
                                src={sellbookInfo.mysteryboxInfo.bannerImage}
                                alt={'image'}
                              />
                            </Box>
                          )}
                        </DetailAccordion>
                      </Stack>
                    </CardInner>
                  </CardWrapper>
                </Grid>
              </Grid>
            </Container>
          </RootStyle>

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
                  {sellbookInfo.mysteryboxInfo.bannerImage && (
                    <img src={sellbookInfo.mysteryboxInfo.bannerImage} alt="description" />
                  )}
                </Scrollbar>
              </Box>
            </Box>
          </Modal>

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
