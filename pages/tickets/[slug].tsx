import React, { ReactElement, useEffect, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
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
import { getBuyersService, getTicketInfoService, registerBuy } from '../../src/services/services';
import { TicketInfoTypes, TicketItemTypes } from '../../src/@types/ticket/ticketTypes';
import axios from 'axios';
import contracts from '../../src/config/constants/contracts';
import useActiveWeb3React from '../../src/hooks/useActiveWeb3React';
import { parseEther } from 'ethers/lib/utils';
import { buyItem } from '../../src/utils/transactions';
import CSnackbar from '../../src/components/common/CSnackbar';
import { BuyerTypes } from '../../src/@types/buyer/buyer';
import { abcSendTx } from '../../src/utils/abcTransactions';
import { useSelector } from 'react-redux';
import { collectionAbi } from '../../src/config/abi/Collection';

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
  const { account, library, chainId } = useActiveWeb3React();
  const { slug } = router.query;

  const [ticketInfo, setTicketInfo] = useState<TicketInfoTypes | null>(null);
  const [selectedTicketItem, setSelectedTicketItem] = useState<TicketItemTypes | null>(null);
  const [buyers, setBuyers] = useState<BuyerTypes[] | null>(null);
  const [selectedItem, setSelectedItem] = React.useState('');
  const [klayPrice, setKlayPrice] = useState(0);
  const [maticPrice, setMaticPrice] = useState(0);
  const [isBuyingWithMatic, setIsBuyingWithMatic] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    type: '',
    message: '',
  });

  const abcUser = useSelector((state: any) => state.user);
  const [abcToken, setAbcToken] = React.useState(''); // OTP

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

  const handleItemChange = (event: SelectChangeEvent) => {
    setSelectedItem(event.target.value);
    const result = ticketInfo?.mysteryboxItems.find(
      (item: TicketItemTypes) => item.id.toString() === event.target.value.toString()
    );
    if (result) setSelectedTicketItem(result);
  };

  const handleBuyWithMatic = async () => {
    if (selectedTicketItem) {
      setIsBuyingWithMatic(true);

      const loginBy = window.localStorage.getItem('loginBy') ?? 'sns';

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

      let result;
      try {
        if (loginBy === 'wallet') {
          result = await buyItem(
            contract,
            index,
            1,
            payment!.toString(),
            quoteToken!,
            account,
            library,
            false
          );
        } else {
          const method = 'buyItemEth';
          const txArgs = [index, 1];
          result = await abcSendTx(
            abcToken,
            contract,
            collectionAbi,
            method,
            txArgs,
            abcUser,
            payment!.toString()
          );
        }

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
            buyer: '',
            buyer_address: account,
            isSent: true,
            txHash: result?.txHash,
            price: ticketInfo?.price,
            itemId: selectedTicketItem?.id,
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
      if (ticketInfoRes.data.status === SUCCESS) setTicketInfo(ticketInfoRes.data.data);
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
          console.log(klayUsd, maticUsd);
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
  }, [slug]);

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
                          account={'0x8B7B2b4F7A391b6f14A81221AE0920a9735B67Fc'}
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
                      value={`$${((ticketInfo?.price ?? 0) * maticPrice).toFixed(4)} (Ξ ${
                        ticketInfo?.price
                      })`}
                    />
                    {/*<LineItem*/}
                    {/*  icon={<></>}*/}
                    {/*  label="Location"*/}
                    {/*  value={'HQ Beercade Nashville Nashville, TN'}*/}
                    {/*/>*/}
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
                        {/*<MenuItem value={0}>*/}
                        {/*  <em>None</em>*/}
                        {/*</MenuItem>*/}
                        {/*<MenuItem value={1}>item1</MenuItem>*/}
                        {/*<MenuItem value={2}>item2</MenuItem>*/}
                        {/*<MenuItem value={3}>item3</MenuItem>*/}
                        {ticketInfo?.mysteryboxItems.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
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
                    >
                      Payment
                    </Button>
                  </Stack>

                  <Divider />

                  <Stack>구매한 유저들</Stack>
                  {buyers &&
                    buyers.map((buyer: BuyerTypes) => (
                      <Box key={buyer.id}>{buyer.buyerAddress}</Box>
                    ))}
                  <Divider />
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
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Buy NFT Ticket
              </Typography>
              <Typography
                id="modal-modal-description"
                sx={{ mt: 2, color: '#999999', width: '80%', lineHeight: '1.1em' }}
              >
                NFT tickets can be purchased as EDC points or Matic tokens.
              </Typography>
            </Stack>
            <Stack spacing={1} sx={{ pt: 3 }}>
              <Stack>
                <Box
                  onClick={() => {
                    alert('EDC 구매하기');
                  }}
                >
                  <LineItemByModal
                    icon={<Iconify icon={searchIcon} sx={{ color: 'common.black' }} />}
                    label="1,000 EDC"
                    value={'PAY WITH EDC'}
                    isBuying={false}
                  />
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
                      icon={<Iconify icon={searchIcon} sx={{ color: 'common.black' }} />}
                      label={`${ticketInfo?.price} ${ticketInfo?.quote.toUpperCase()}`}
                      value={'PAY WITH MATIC'}
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
  icon: ReactElement;
  label: string;
  value: any;
  isBuying?: boolean;
};

function LineItem({ icon, label, value }: LineItemProps) {
  return (
    <TextIconLabel
      icon={icon}
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
      icon={icon}
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
