import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Fade,
  Grid,
  Input,
  Modal,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// config
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT, SUCCESS } from '../../src/config';
// @types
import { BigNumber, ethers } from 'ethers';
// layouts
import Layout from '../../src/layouts';
// components
import { Iconify, Page, TextIconLabel, TextMaxLine } from '../../src/components';
// sections
import { useRouter } from 'next/router';
import EECard from '../../src/components/EECard';
import EEAvatar from '../../src/components/EEAvatar';
import { fDate } from '../../src/utils/formatTime';
import searchIcon from '@iconify/icons-carbon/search';
import {
  getBuyersService,
  getSession,
  getTicketInfoService,
  registerBuy,
  savePoint,
} from '../../src/services/services';
import { TicketInfoTypes, TicketItemTypes } from '../../src/@types/ticket/ticketTypes';
import axios from 'axios';
import contracts from '../../src/config/constants/contracts';
import useActiveWeb3React from '../../src/hooks/useActiveWeb3React';
import { parseEther } from 'ethers/lib/utils';
import { buyItem, getItemSold, getWhlBalanceNoSigner } from '../../src/utils/transactions';
import CSnackbar from '../../src/components/common/CSnackbar';
import { BuyerTypes } from '../../src/@types/buyer/buyer';
import { abcSendTx } from '../../src/utils/abcTransactions';
import { useSelector } from 'react-redux';
import { collectionAbi } from '../../src/config/abi/Collection';
import tokenAbi from '../../src/config/abi/ERC20Token.json';
import { LoadingButton } from '@mui/lab';
import useAccount from '../../src/hooks/useAccount';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT + 30,
  paddingBottom: 30,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT + 30,
    paddingBottom: 30,
  },
  // background: 'red'
}));

// ----------------------------------------------------------------------

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
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
  const { user } = useSelector((state: any) => state.webUser);
  const { library, chainId } = useActiveWeb3React();
  const { account } = useAccount();
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
  const [open, setOpen] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    type: '',
    message: '',
  });

  const abcUser = useSelector((state: any) => state.user);
  const [abcToken, setAbcToken] = React.useState('');
  const [abcOpen, setAbcOpen] = React.useState(false);
  const [reload, setReload] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

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

  const handleAbcConfirmClick = async () => {
    setOtpLoading(true);
    console.log(`abc token : ${abcToken}`); // Google OTP

    if (selectedTicketItem) {
      setIsBuyingWithMatic(true);

      // Collection
      const contract = ticketInfo?.boxContractAddress;
      const quote = ticketInfo?.quote;
      const index = selectedTicketItem.no - 1 ?? 0;
      const amount = 1;

      let quoteToken: string;
      let payment: BigNumber;
      if (quote === 'matic' || quote === 'wmatic') {
        quoteToken = quote === 'matic' ? contracts.matic[chainId] : contracts.wmatic[chainId];
        payment = parseEther(ticketInfo?.price.toString() ?? '0').mul(amount);
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

        if (parseInt(result.status.toString(), 16) === SUCCESS) {
          // const left = await getItemAmount(
          //   contract,
          //   index,
          //   collectionItemInfo?.collectionInfo?.isCollection === true ? 2 : 1,
          //   account,
          //   library
          // );

          const data = {
            mysterybox_id: ticketInfo?.id,
            buyer: user.uid,
            buyer_address: abcUser.accounts[0].ethAddress,
            isSent: true,
            txHash: result?.txHash,
            price: ticketInfo?.price,
            itemId: selectedTicketItem?.id,
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
    setSelectedItem(event.target.value);
    const result = ticketInfo?.mysteryboxItems.find(
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
          mysterybox_id: ticketInfo?.id,
          buyer: session.data.dropsUser.uid,
          buyer_address: loginBy === 'sns' ? abcUser.accounts[0].ethAddress : account,
          isSent: false,
          txHash: '',
          // price: ticketInfo?.price,
          price: (((ticketInfo?.price ?? 0) * maticPrice) / 10).toFixed(4),
          itemId: selectedTicketItem?.id,
          usePoint: true,
        };

        console.log(data);
        let res = await registerBuy(data);
        console.log(res.data);
        if (res.data.status === SUCCESS) {
          res = await savePoint({
            order_id: res.data.data.id,
            point: ticketInfo?.price,
            type: 'USE',
          });
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
      const contract = ticketInfo?.boxContractAddress;
      const quote = ticketInfo?.quote;
      const index = selectedTicketItem.no - 1 ?? 0;
      const amount = 1;

      let quoteToken: string;
      let payment: BigNumber;
      if (quote === 'matic' || quote === 'wmatic') {
        quoteToken = quote === 'matic' ? contracts.matic[chainId] : contracts.wmatic[chainId];
        payment = parseEther(ticketInfo?.price.toString() ?? '0').mul(amount);
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
            mysterybox_id: ticketInfo?.id,
            buyer: user.uid,
            buyer_address: account,
            isSent: true,
            txHash: result?.txHash,
            price: ticketInfo?.price,
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
  };

  const fetchTicketInfo = async () => {
    if (slug && typeof slug === 'string') {
      const ticketInfoRes = await getTicketInfoService(slug);

      const contract = ticketInfoRes.data.data.boxContractAddress;
      const whitelist = ticketInfoRes.data.data.whitelistNftId;
      const whitelistAddress = ticketInfoRes.data.data.whitelistNftContractAddress ?? '';
      const temp = await Promise.all(
        ticketInfoRes.data.data.mysteryboxItems.map(async (item: TicketItemTypes) => {
          // todo getRemain
          const sold = await getItemSold(contract, item.no - 1, chainId);
          let whlBalance = 0;
          let whlBool = false;
          if (whitelist !== null && whitelist > 0) {
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
      );

      if (ticketInfoRes.data.status === SUCCESS)
        setTicketInfo({ ...ticketInfoRes.data.data, mysteryboxItems: temp });
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
    setDollarPrice((ticketInfo?.price ?? 0) * maticPrice);
  }, [ticketInfo, maticPrice]);

  return (
    <Page
      title={`${slug} - Ticket`}
      sx={{
        backgroundImage: `url(${ticketInfo?.packageImage})`,
        height: '100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <RootStyle>
        <Container>
          <Grid container spacing={8} direction="row">
            <Grid item xs={12} md={5} lg={6}>
              {/*<Image*/}
              {/*    alt="photo"*/}
              {/*    src={'https://dummyimage.com/900x900/000/fff'}*/}
              {/*    ratio="1/1"*/}
              {/*    sx={{ borderRadius: 2, cursor: 'pointer' }}*/}
              {/*/>*/}
            </Grid>

            <Grid item xs={12} md={7} lg={6}>
              <EECard>
                <Stack spacing={3}>
                  <Stack
                    justifyContent="space-between"
                    sx={{
                      height: 1,
                      zIndex: 9,
                      color: 'common.black',
                    }}
                  >
                    <Stack spacing={1}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ opacity: 0.72, typography: 'caption' }}
                      >
                        <EEAvatar
                          // account={'0x8B7B2b4F7A391b6f14A81221AE0920a9735B67Fc'}
                          image={ticketInfo?.featured?.company.image}
                          nickname={ticketInfo?.featured?.company.name.en}
                          sx={{ mr: 0, width: 24, height: 24 }}
                        />

                        <Typography>{ticketInfo?.featured?.company.name.en}</Typography>
                      </Stack>

                      <TextMaxLine variant="h3" sx={{ width: '80%' }}>
                        {ticketInfo?.title.en}
                      </TextMaxLine>

                      <Typography
                        variant="subtitle2"
                        sx={{
                          mb: 1,
                          mt: { xs: 1, sm: 0.5 },
                          color: 'common.black',
                          fontSize: '1em',
                        }}
                      >
                        {ticketInfo?.createdAt && fDate(ticketInfo?.createdAt)}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Divider />

                  <Stack>
                    <LineItem
                      icon={<></>}
                      label="Reserve Price"
                      value={`EDCP ${(dollarPrice / 10).toFixed(4)} (Ξ ${ticketInfo?.price})`}
                    />
                    {ticketInfo &&
                      ticketInfo.mysteryboxItems[0].properties &&
                      ticketInfo.mysteryboxItems[0].properties.map((item: any) => (
                        <LineItem
                          key={item.id}
                          icon={<></>}
                          label={item.type.replace(/\b[a-z]/g, (char: string) =>
                            char.toUpperCase()
                          )}
                          value={item.name}
                        />
                      ))}
                  </Stack>

                  <Stack>
                    <FormControl>
                      <Select
                        value={selectedItem}
                        onChange={handleItemChange}
                        displayEmpty
                        fullWidth
                        inputProps={{ 'aria-label': 'optione1' }}
                        sx={{ color: 'common.black' }}
                      >
                        {ticketInfo?.mysteryboxItems.map((item: TicketItemTypes) => (
                          <MenuItem key={item.id} value={item.id}>
                            <Box
                              sx={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0px 10px',
                              }}
                            >
                              <Typography>{item.name}</Typography>
                              <Typography>{`(${item.remain} / ${item.issueAmount})`}</Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>

                  <Stack sx={{ pb: 4 }}>
                    <Button
                      onClick={handleOpen}
                      size={'large'}
                      fullWidth={true}
                      variant="contained"
                      disabled={selectedTicketItem?.whlBool && selectedTicketItem?.whlBalance === 0}
                    >
                      Payment
                    </Button>
                  </Stack>

                  <Divider />

                  {/*<Stack>구매한 유저들</Stack>*/}
                  {/*{buyers &&*/}
                  {/*  buyers.map((buyer: BuyerTypes) => (*/}
                  {/*    <Box key={buyer.id}>{buyer.buyerAddress}</Box>*/}
                  {/*  ))}*/}
                  {/*<Divider />*/}
                  <Stack>
                    <Typography variant={'subtitle2'} sx={{ mb: 1 }}>
                      Description
                    </Typography>
                    <TextMaxLine line={5}>{ticketInfo?.introduction.en}</TextMaxLine>
                  </Stack>
                  <Divider />
                  {/*<Stack>*/}
                  {/*  <Typography variant={'subtitle2'} sx={{ mb: 1 }}>*/}
                  {/*    Title area 2*/}
                  {/*  </Typography>*/}
                  {/*  <TextMaxLine line={5}>*/}
                  {/*    Unleash your inner warrior and get ready to battle with Ibutsu NFT! If you're*/}
                  {/*    looking to be a part of an immersive dojo-style world, then you can't go wrong*/}
                  {/*    by having your very own Ibutsu fighter. Join our community to make friends,*/}
                  {/*    have fun and collect $APE!*/}
                  {/*  </TextMaxLine>*/}
                  {/*</Stack>*/}
                </Stack>
              </EECard>
            </Grid>
          </Grid>
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
                  {`$ ${((ticketInfo?.price ?? 0) * maticPrice).toFixed(4)}`}
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
                      // icon={<Iconify icon={searchIcon} sx={{ color: 'common.black' }} />}
                      label={`${ticketInfo?.price} ${ticketInfo?.quote.toUpperCase()}`}
                      value={`PAY WITH ${ticketInfo?.quote.toUpperCase()}`}
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
            구글 OTP 인증 :
            <Input
              sx={{ color: 'black' }}
              fullWidth={true}
              id="outlined-basic"
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
  return <Layout>{page}</Layout>;
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

function LineItem({ icon, label, value }: LineItemProps) {
  return (
    <TextIconLabel
      icon={icon!}
      value={
        <>
          <Typography sx={{ fontSize: '14px', color: 'common.black' }}>{label}</Typography>
          <Typography
            variant="subtitle2"
            sx={{
              color: 'common.black',
              flexGrow: 1,
              textAlign: 'right',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            {value}
          </Typography>
        </>
      }
      sx={{
        color: 'text.primary',
        '& svg': { mr: 1, width: 24, height: 24 },
      }}
    />
  );
}

function LineItemByModal({ icon, label, value, isBuying }: LineItemProps) {
  return (
    <TextIconLabel
      icon={icon!}
      value={
        <>
          <Typography sx={{ fontSize: '14px', color: 'common.black' }}>{label}</Typography>
          <Typography
            variant="subtitle2"
            sx={{
              flexGrow: 1,
              textAlign: 'right',
              color: 'common.black',
              fontSize: '16px',
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
