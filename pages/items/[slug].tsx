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
import CompanyInfo from 'src/components/ticket/CompanyInfo';
import Badge from 'src/components/ticket/Badge';
import { TicketName } from 'src/components/ticket/TicketName';
import { CardWrapper } from 'src/components/ticket/CardWrapper';
import { CardInner } from 'src/components/ticket/CardInner';
import { Label, Row, Section, TotalValue, Value } from 'src/components/my-tickets/StyledComponents';
import Timer from 'src/components/Timer';
import { RoundedSelect, RoundedSelectOption } from 'src/components/common/Select';
import RoundedButton from 'src/components/common/RoundedButton';
import { ArrowDropDown } from '@mui/icons-material';

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
  const [payType, setPayType] = useState('default');

  const abcUser = useSelector((state: any) => state.user);
  const [abcToken, setAbcToken] = useState('');
  const [abcOpen, setAbcOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const isOnAuction = router.query.status === 'auction'; // TODO: Update value

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
            mysterybox_id: ticketInfo?.id,
            buyer: user.uid,
            buyer_address: abcUser.accounts[0].ethAddress,
            isSent: true,
            txHash: result?.transactionHash,
            price: ticketInfo?.price,
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

      const contract = ticketInfoRes.data.data.boxContractAddress;
      const whitelist = ticketInfoRes.data.data.whitelistNftId;
      const whitelistAddress = ticketInfoRes.data.data.whitelistNftContractAddress ?? '';
      const temp = await Promise.all(
        ticketInfoRes.data.data.mysteryboxItems.map(async (item: TicketItemTypes) => {
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
      );

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
    setDollarPrice((ticketInfo?.price ?? 0) * maticPrice);
  }, [ticketInfo, maticPrice]);

  return (
    <Page title={`${slug} - Ticket`}>
      {/* background */}
      <Box
        sx={{
          backgroundImage: `url(${ticketInfo?.packageImage})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          zIndex: -1,
        }}
      />
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
              <CardWrapper>
                <CardInner>
                  <Stack flexDirection="row" justifyContent="space-between">
                    <CompanyInfo
                      account={'0x8B7B2b4F7A391b6f14A81221AE0920a9735B67Fc'}
                      image={ticketInfo?.featured?.company.image}
                      name={ticketInfo?.featured?.company.name.en || ''}
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
                          borderImageSource: 'linear-gradient(180deg, #08FF0C 0%, #4ADEFF 76.56%)',
                        }}
                      />
                    ) : (
                      <Badge label="For Sale" />
                    )}
                  </Stack>

                  <TicketName>{ticketInfo?.title.en}</TicketName>

                  <Stack gap="7px">
                    <Row>
                      <Label>Day</Label>
                      <Value>{ticketInfo?.createdAt && fDate(ticketInfo?.createdAt)}</Value>
                    </Row>
                    <Row>
                      <Label>Team</Label>
                      <Value>Team Yellow</Value>
                    </Row>
                    <Row>
                      <Label>Auction ends in</Label>
                      <Timer as={Value} releasedDate={ticketInfo?.releaseDatetime} />
                    </Row>
                  </Stack>

                  <Divider />

                  <Section>
                    {isOnAuction ? (
                      <Row>
                        <Label>Starting Price</Label>
                        <Stack flexDirection="row" gap={0.5}>
                          <TotalValue>{`${(dollarPrice / 10).toFixed(4)} EDCP`}</TotalValue>
                          <TotalValue
                            sx={{ opacity: 0.6 }}
                          >{`(~$${ticketInfo?.price})`}</TotalValue>
                        </Stack>
                      </Row>
                    ) : null}

                    <Row>
                      <Label>Current Price</Label>
                      <Stack flexDirection="row" gap={0.5}>
                        <TotalValue>{`${(dollarPrice / 10).toFixed(4)} EDCP`}</TotalValue>
                        <TotalValue sx={{ opacity: 0.6 }}>{`(~$${ticketInfo?.price})`}</TotalValue>
                      </Stack>
                    </Row>
                  </Section>

                  <Stack gap={0.25} mt="142px">
                    {isOnAuction ? (
                      <>
                        <RoundedButton
                          onClick={handleOpen}
                          fullWidth
                          disabled={
                            selectedTicketItem?.whlBool && selectedTicketItem?.whlBalance === 0
                          }
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
                          onClick={handleOpen}
                          fullWidth
                          disabled={
                            selectedTicketItem?.whlBool && selectedTicketItem?.whlBalance === 0
                          }
                          sx={{ backgroundColor: theme.palette.primary.main }}
                        >
                          Buy Now
                        </RoundedButton>
                      </>
                    )}
                  </Stack>

                  <Stack gap={2}>
                    <DetailAccordion title={'Description'}>
                      As we enter a world of metaverses and remote work, we recognize a common
                      problem - nobody touches grass anymore. The Healing Hippies are a collection
                      of 8,888 generated Hippies with the power to heal. Each NFT comes with an aura
                      that unlocks portions of the HippieVerse and features to The Heal App. Holders
                      will benefit from YouTube content royalties and Prosper Points. Holders will
                      also have token-gated access to The Heal App, where you can work with Coaches,
                      Nutritionists, Therapists, and Specialists.
                      {/* <Stack
                        sx={{
                          width: 1,
                          overflow: 'scroll',
                          // maxHeight: 'calc(100vh - 6rem)',
                          position: 'relative',
                          img: { width: 1 },
                        }}
                      >
                        <Scrollbar sx={{ py: { xs: 3, md: 0 } }}>
                          <img src="/assets/img/WATERBOMB_SEOUL_2023.jpeg" alt="description" />
                        </Scrollbar>
                      </Stack> */}
                    </DetailAccordion>

                    <DetailAccordion title={'About new Reality Now'}>
                      Our mission is to cultivate and incentivize a space for collective wellness. A
                      utopia where holders can access live coaches and specialists to grow the mind,
                      body, and spirit all within a safe community.
                    </DetailAccordion>
                  </Stack>

                  {/* <Stack>
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
                  </Stack> */}

                  {/* <Stack>
                    <FormControl>
                      <Select
                        value={selectedItem}
                        onChange={handleItemChange}
                        displayEmpty
                        fullWidth
                        inputProps={{ 'aria-label': 'optione1' }}
                        sx={{ color: 'common.black' }}
                      >
                        <MenuItem value="" disabled>
                          <span style={{ color: '#9E9E9E' }}>Choose an option</span>
                        </MenuItem>
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
                  </Stack> */}

                  {/*<Stack>구매한 유저들</Stack>*/}
                  {/*{buyers &&*/}
                  {/*  buyers.map((buyer: BuyerTypes) => (*/}
                  {/*    <Box key={buyer.id}>{buyer.buyerAddress}</Box>*/}
                  {/*  ))}*/}
                  {/*<Divider />*/}

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
                </CardInner>
              </CardWrapper>
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

const DetailAccordion = ({ title, children }: PropsWithChildren<{ title: string }>) => (
  <Accordion
    sx={{
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
