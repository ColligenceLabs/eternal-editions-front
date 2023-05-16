import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';
// @mui
import {
  styled,
  useTheme,
  Backdrop,
  Box,
  CircularProgress,
  Container,
  Fade,
  Grid,
  TextField,
  Modal,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from 'src/assets/icons/close';
import { IconButtonAnimate } from 'src/components/animate';
// config
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT, SUCCESS } from 'src/config';
// @types
import { BigNumber, ethers } from 'ethers';
// layouts
import Layout from 'src/layouts';
// components
import { Page, Scrollbar, TextIconLabel } from 'src/components';
// sections
import { useRouter } from 'next/router';
import { fDate } from 'src/utils/formatTime';
import {
  getBuyersService,
  getSession,
  getTicketInfoService,
  getUser,
  registerBuy,
} from 'src/services/services';
import { TicketInfoTypes, TicketItemTypes } from 'src/@types/ticket/ticketTypes';
import axios from 'axios';
import contracts from 'src/config/constants/contracts';
import useActiveWeb3React from 'src/hooks/useActiveWeb3React';
import useAccount from 'src/hooks/useAccount';
import { useResponsive } from 'src/hooks';

import { parseEther } from 'ethers/lib/utils';
import { buyItem, getItemSold, getWhlBalanceNoSigner } from 'src/utils/transactions';
import CSnackbar from 'src/components/common/CSnackbar';
import { BuyerTypes } from 'src/@types/buyer/buyer';
import { abcSendTx } from 'src/utils/abcTransactions';
import { useDispatch, useSelector } from 'react-redux';
import { collectionAbi } from 'src/config/abi/Collection';
import { LoadingButton } from '@mui/lab';
import { setWebUser } from 'src/store/slices/webUser';
import TicketPostItemContent from 'src/sections/@eternaledtions/tickets/TicketPostItemContent';
import { Label, Section, Value } from 'src/components/my-tickets/StyledComponents';
import CompanyInfo from 'src/components/ticket/CompanyInfo';
import ScheduleCard from 'src/components/ticket/ScheduleCard';
import TicketItems from 'src/sections/@eternaledtions/items/TicketItems';
import TicketItemsInDrop from 'src/sections/@eternaledtions/items/TicketItemsInDrop';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  paddingBottom: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
    paddingBottom: HEADER_DESKTOP_HEIGHT,
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
  const router = useRouter();
  const theme = useTheme();
  const { user } = useSelector((state: any) => state.webUser);
  const { library, chainId } = useActiveWeb3React();
  const { account } = useAccount();
  const dispatch = useDispatch();
  const { slug } = router.query;

  const [ticketInfo, setTicketInfo] = useState<TicketInfoTypes | null>(null);
  const [selectedTicketItem, setSelectedTicketItem] = useState<TicketItemTypes | null>(null);
  const [buyers, setBuyers] = useState<BuyerTypes[] | null>(null);
  const [selectedItem, setSelectedItem] = React.useState('');
  const [klayPrice, setKlayPrice] = useState(0);
  const [maticPrice, setMaticPrice] = useState(0);
  const [dollarPrice, setDollarPrice] = useState(0);
  const [isBuyingWithMatic, setIsBuyingWithMatic] = useState(false);
  const [isBuyingWithPoint, setIsBuyingWithPoint] = useState(false);
  const [open, setOpen] = useState(false);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    type: '',
    message: '',
  });

  const abcUser = useSelector((state: any) => state.user);
  const [abcToken, setAbcToken] = useState('');
  const [abcOpen, setAbcOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const {
    id,
    title,
    packageImage,
    categoriesStr,
    featured,
    createdAt,
    whitelistNftId,
    mysteryboxItems,
    price,
    boxContractAddress,
    quote,
  } = ticketInfo || {};

  const handleAbcClose = () => {
    setAbcToken('');
    setAbcOpen(false);
  };
  const handleAbcTokenChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { value } = event.target;
    setAbcToken(value);
    // console.log(value);
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar({
      open: false,
      type: '',
      message: '',
    });
  };

  const handleOpen = () => {
    if (selectedTicketItem) setOpen(true);
    else {
      setOpenSnackbar({
        open: true,
        type: 'error',
        message: 'Item not selected',
      });
    }
  };
  const handleClose = () => setOpen(false);

  function hexToAddress(hexVal: any) {
    return '0x' + hexVal.substr(-40);
  }

  const handleAbcConfirmClick = async () => {
    setOtpLoading(true);
    console.log(`abc token : ${abcToken}`); // Google OTP

    if (selectedTicketItem) {
      setIsBuyingWithMatic(true);

      // Collection
      const contract = boxContractAddress;
      const index = selectedTicketItem.no - 1 ?? 0;
      const amount = 1;

      let quoteToken: string;
      let payment: BigNumber;
      if (quote === 'matic' || quote === 'wmatic') {
        quoteToken = quote === 'matic' ? contracts.matic[chainId] : contracts.wmatic[chainId];
        payment = parseEther(price?.toString() ?? '0').mul(amount);
      }
      try {
        const method = 'buyItemEth';
        const txArgs = [index, amount];
        const result = await abcSendTx(
          abcToken,
          contract,
          collectionAbi,
          method,
          txArgs,
          abcUser,
          payment!.toHexString()
        );

        // TODO: Get tokenId in the receipt and save into DB drops ?
        const events = result.logs;
        const recipient = hexToAddress(events[1].topics[2]);
        const tokenIdHex = ethers.utils.defaultAbiCoder.decode(['uint256'], events[1].topics[3]);
        const tokenId = parseInt(tokenIdHex.toString());
        console.log('== ABC buyItem event ==>', recipient, tokenId);

        if (parseInt(result.status.toString(), 16) === SUCCESS) {
          // const left = await getItemAmount(
          //   contract,
          //   index,
          //   collectionItemInfo?.collectionInfo?.isCollection === true ? 2 : 1,
          //   account,
          //   library
          // );

          const data = {
            mysterybox_id: id,
            buyer: user.uid,
            buyer_address: abcUser.accounts[0].ethAddress,
            isSent: true,
            txHash: result?.transactionHash,
            price: price,
            itemId: selectedTicketItem?.id,
            tokenId: tokenId,
          };

          const res = await registerBuy(data);
          console.log('== call backend : registerBuy ==>', res.data);
          if (res.data.status === SUCCESS) {
            // setOpenSnackbar({
            //   open: true,
            //   type: 'success',
            //   message: 'Success',
            // });
            console.log('success');
            setOpenSnackbar({
              open: true,
              type: 'success',
              message: 'Purchase completed!',
            });
            // return true;
          } else {
            // setIsBuyingWithMatic(false);
            // return false;
          }
        } else {
          // setIsBuyingWithMatic(false);
          // return false;
          setOpenSnackbar({
            open: true,
            type: 'error',
            message: `Purchase failed! TX Hash = ${result.transactionHash}`,
          });
        }
      } catch (e: any) {
        setIsBuyingWithMatic(false);
        console.log(e);
        // if (e.code == '-32603') setErrMsg('Not sufficient Klay balance!');
        // return false;
        setOpenSnackbar({
          open: true,
          type: 'error',
          message: 'Purchase faield!',
        });
      }
      setIsBuyingWithMatic(false);
    } else {
      console.log('Item not selected');
    }
    setAbcToken('');
    setAbcOpen(false);
    setOtpLoading(false);
  };

  const handleItemChange = (event: SelectChangeEvent) => {
    console.log('handleItemChange', event.target.value);
    setSelectedItem(event.target.value);

    const result = mysteryboxItems?.find(
      (item: TicketItemTypes) => item.id.toString() === event.target.value.toString()
    );

    if (result) setSelectedTicketItem(result);
  };

  const handleBuyWithPoint = async () => {
    if (isBuyingWithPoint) {
      console.log('in progress');
      return;
    }
    if (selectedTicketItem) {
      try {
        const session = await getSession();
        if (!session.data.dropsUser) throw new Error('session expired.');
        const loginBy = window.localStorage.getItem('loginBy') ?? 'sns';
        setIsBuyingWithPoint(true);
        const data = {
          mysterybox_id: id,
          buyer: session.data.dropsUser.uid,
          buyer_address: loginBy === 'sns' ? abcUser.accounts[0].ethAddress : account,
          isSent: false,
          txHash: '',
          // price: ticketInfo?.price,
          price: (((price ?? 0) * maticPrice) / 10).toFixed(4),
          itemId: selectedTicketItem?.id,
          usePoint: true,
        };

        console.log(data);
        const res = await registerBuy(data);
        console.log(res.data);
        if (res.data.status === SUCCESS) {
          const userRes = await getUser();
          console.log(userRes);
          if (userRes.status === 200 && userRes.data.status != 0)
            dispatch(setWebUser(userRes.data.user));
          // res = await savePoint({
          //   order_id: res.data.data.id,
          //   point: ticketInfo?.price,
          //   type: 'USE',
          // });
          console.log('success');
          setOpenSnackbar({
            open: true,
            type: 'success',
            message: 'Purchase completed!',
          });
          setReload((cur) => !cur);
        } else {
          console.log('Item not selected', res.data.message);
          setOpenSnackbar({
            open: true,
            type: 'error',
            message: `Purchase faield! ${res.data.message}`,
          });
        }
      } catch (e) {
        setIsBuyingWithMatic(false);
        console.log(e);
        setOpenSnackbar({
          open: true,
          type: 'error',
          message: 'Purchase faield!',
        });
      } finally {
        setOpen(false);
        setIsBuyingWithPoint(false);
      }
    }
  };

  const handleBuyWithMatic = async () => {
    if (selectedTicketItem) {
      setIsBuyingWithMatic(true);

      const loginBy = window.localStorage.getItem('loginBy') ?? 'sns';
      if (loginBy === 'sns') {
        setAbcOpen(true);
        return;
      }
      // Collection
      const contract = boxContractAddress;
      const index = selectedTicketItem.no - 1 ?? 0;
      const amount = 1;

      let quoteToken: string;
      let payment: BigNumber;
      if (quote === 'matic' || quote === 'wmatic') {
        quoteToken = quote === 'matic' ? contracts.matic[chainId] : contracts.wmatic[chainId];
        payment = parseEther(price?.toString() ?? '0').mul(amount);
      }

      try {
        const result = await buyItem(
          contract,
          index,
          1,
          payment!.toString(),
          quoteToken!,
          account,
          library,
          false
        );

        if (result.status === SUCCESS) {
          // const left = await getItemAmount(
          //   contract,
          //   index,
          //   collectionItemInfo?.collectionInfo?.isCollection === true ? 2 : 1,
          //   account,
          //   library
          // );

          const data = {
            mysterybox_id: id,
            buyer: user.uid,
            buyer_address: account,
            isSent: true,
            txHash: result?.txHash,
            price: price,
            itemId: selectedTicketItem?.id,
            tokenId: result.tokenId,
          };

          const res = await registerBuy(data);
          if (res.data.status === SUCCESS) {
            // setOpenSnackbar({
            //   open: true,
            //   type: 'success',
            //   message: 'Success',
            // });
            console.log('success');
            setOpenSnackbar({
              open: true,
              type: 'success',
              message: 'Purchase completed!',
            });
            setReload((cur) => !cur);
            // return true;
          } else {
            // setIsBuyingWithMatic(false);
            // return false;
          }
        } else {
          // setIsBuyingWithMatic(false);
          // return false;
          // 구입 실패
          setOpenSnackbar({
            open: true,
            type: 'error',
            message: `Purchase failed! Tx Hash = ${result.txHash}`,
          });
        }
      } catch (e: any) {
        setIsBuyingWithMatic(false);
        console.log(e);
        // if (e.code == '-32603') setErrMsg('Not sufficient Klay balance!');
        // return false;
        setOpenSnackbar({
          open: true,
          type: 'error',
          message: 'Purchase faield!',
        });
      }
      setOpen(false);
      setIsBuyingWithMatic(false);
    } else {
      console.log('Item not selected');
    }
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
            return { ...item, remain: item.issueAmount - sold, whlBool, whlBalance };
          })
        ));

      if (ticketInfoRes.data.status === SUCCESS) {
        setTicketInfo({ ...ticketInfoRes.data.data, mysteryboxItems: temp });

        // if (temp.length) {
        //   setTimeout(() => handleItemChange({ target: { value: `${temp[0].id}` } }), 200);
        // }
      }
    }
  };

  const fetchBuyersList = async () => {
    if (slug && typeof slug === 'string') {
      const buyersListRes = await getBuyersService(slug);
      if (buyersListRes.data.status === SUCCESS) setBuyers(buyersListRes.data.data);
    }
  };

  const getCoinPrice = () => {
    const url = 'https://bcn-api.talken.io/coinmarketcap/cmcQuotes?cmcIds=4256,3890';
    try {
      if (klayPrice === 0 || maticPrice === 0) {
        axios(url).then((response) => {
          const klayUsd = response.data.data[4256].quote.USD.price;
          const klayKrw = response.data.data[4256].quote.KRW.price;
          const maticUsd = response.data.data[3890].quote.USD.price;
          const maticKrw = response.data.data[3890].quote.KRW.price;
          setKlayPrice(parseFloat(klayUsd));
          setMaticPrice(parseFloat(maticUsd));
        });
      }
    } catch (error: any) {
      console.log(new Error(error));
    }
  };

  useEffect(() => {
    getCoinPrice();
  }, []);

  useEffect(() => {
    fetchTicketInfo();
    fetchBuyersList();
  }, [slug, reload, account]);

  useEffect(() => {
    setDollarPrice((price ?? 0) * maticPrice);
  }, [ticketInfo, maticPrice]);

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
                      {createdAt && <Value>{fDate(createdAt, 'EEEE (MMMM dd, yyyy)')}</Value>}
                      {mysteryboxItems && (
                        <Value>
                          {mysteryboxItems[0].properties &&
                            mysteryboxItems[0].properties[0].type.toLowerCase() === 'location' &&
                            mysteryboxItems[0].properties[0].name}
                        </Value>
                      )}
                    </Stack>
                  </Section>
                </Grid>
              </Grid>

              <Section>
                <Label>Description</Label>
                <Value sx={{ color: 'red' }}>
                  Welcome to Grumbies! The Grumbies Eternal Entry is dropping exclusively on
                  OpenSea. After the mint a snapshot will be announced and holders of the Eternal
                  Entry will bnesis Battle. In addition to the Grumbies Genesis Battle, the Grumbies
                  Eternal Entry will give holders access to all future endeavors in the Grumbies
                  universe. 
                </Value>
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
          />
        </Container>
      </RootStyle>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Stack spacing={2}>
            <Stack sx={{ pr: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography id="modal-modal-title" variant="h4">
                  Buy NFT Ticket
                </Typography>
                <Typography id="modal-modal-title" variant="h6">
                  {`$ ${((price ?? 0) * maticPrice).toFixed(4)}`}
                </Typography>
              </Box>
              <Typography
                id="modal-modal-description"
                sx={{ mt: 2, color: '#999999', width: '80%', lineHeight: '1.1em' }}
              >
                NFT tickets can be purchased as EDC points or Matic tokens.
              </Typography>
            </Stack>
            <Stack spacing={1} sx={{ pt: 3 }}>
              <Stack>
                <Box onClick={handleBuyWithPoint}>
                  {isBuyingWithPoint ? (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'text.primary',
                        cursor: 'pointer',
                        // '& svg': { mr: 1, width: 24, height: 24 },
                        mb: 1,
                        padding: '14px 24px',
                        borderRadius: '50px',
                        bgcolor: '#F5F5F5',
                        '&:hover': {
                          bgcolor: 'primary.main',
                        },
                      }}
                    >
                      <CircularProgress size={25} color="secondary" />
                    </Box>
                  ) : (
                    <LineItemByModal
                      sx={{ whiteSpace: 'nowrap' }}
                      // icon={<Iconify icon={searchIcon} sx={{ color: 'common.black' }} />}
                      label={`${(dollarPrice / 10).toFixed(4)} EDCP`}
                      value={'PAY WITH EDCP'}
                      isBuying={isBuyingWithPoint}
                    />
                  )}
                </Box>
                <Box onClick={handleBuyWithMatic}>
                  {isBuyingWithMatic ? (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'text.primary',
                        cursor: 'pointer',
                        // '& svg': { mr: 1, width: 24, height: 24 },
                        mb: 1,
                        padding: '14px 24px',
                        borderRadius: '50px',
                        bgcolor: '#F5F5F5',
                        '&:hover': {
                          bgcolor: 'primary.main',
                        },
                      }}
                    >
                      <CircularProgress size={25} color="secondary" />
                    </Box>
                  ) : (
                    <LineItemByModal
                      sx={{ whiteSpace: 'nowrap' }}
                      // icon={<Iconify icon={searchIcon} sx={{ color: 'common.black' }} />}
                      label={`${price} ${quote?.toUpperCase()}`}
                      value={`PAY WITH ${quote?.toUpperCase()}`}
                      isBuying={isBuyingWithMatic}
                    />
                  )}
                </Box>
              </Stack>

              {/*<Button onClick={() => {alert('EDC 구매하기')}} size={"large"} fullWidth={true}*/}
              {/*        variant="contained">Payment</Button>*/}
              {/*<Button onClick={() => {alert('MATIC 구매하기')}} size={"large"} fullWidth={true}*/}
              {/*        variant="contained">Payment</Button>*/}
            </Stack>
          </Stack>
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
              onChange={handleAbcTokenChange}
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
                onClick={handleAbcConfirmClick}
                loading={otpLoading}
                disabled={otpLoading}
              >
                확인
              </LoadingButton>
            </Box>
          </Box>
        </Fade>
      </Modal>

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
              <img src="/assets/img/WATERBOMB_SEOUL_2023.jpeg" alt="description" />
            </Scrollbar>
          </Box>
        </Box>
      </Modal>

      <CSnackbar
        open={openSnackbar.open}
        type={openSnackbar.type}
        message={openSnackbar.message}
        handleClose={handleCloseSnackbar}
      />
    </Page>
  );
}

// ----------------------------------------------------------------------

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
};

function LineItemByModal({ icon, label, value, isBuying }: LineItemProps) {
  const isXs = useResponsive('down', 'sm');
  return (
    <TextIconLabel
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
