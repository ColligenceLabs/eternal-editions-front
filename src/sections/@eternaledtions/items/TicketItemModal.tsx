import { Stack, Typography, Divider, CircularProgress, Fade, TextField } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { TicketItemTypes } from 'src/@types/ticket/ticketTypes';
import RoundedButton from 'src/components/common/RoundedButton';
import { fDate } from 'src/utils/formatTime';
import QuantityControl from './QuantityControl';
import Radio from 'src/components/common/Radio';
import palette from 'src/theme/palette';
import axios from 'axios';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CSnackbar from 'src/components/common/CSnackbar';
import { getSession, getUser, registerBuy } from 'src/services/services';
import { SUCCESS } from 'src/config';
import { BigNumber, ethers } from 'ethers';
import contracts from 'src/config/constants/contracts';
import { parseEther } from 'ethers/lib/utils';
import useActiveWeb3React from 'src/hooks/useActiveWeb3React';
import useAccount from 'src/hooks/useAccount';
import { setWebUser } from 'src/store/slices/webUser';
import { buyItem } from 'src/utils/transactions';
import { useRouter } from 'next/router';
import { Modal } from '@mui/material';
import { Backdrop } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { abcSendTx } from 'src/utils/abcTransactions';
import { collectionAbi } from 'src/config/abi/Collection';
import Routes from 'src/routes';

type Props = {
  ticket: TicketItemTypes;
  boxContractAddress: any;
  quote: string | undefined;
  mysterybox_id: number | undefined;
  setIsTicketItemModalOpen: (value: boolean) => void;
};

const ticketLabel = {
  day: 'day',
  team: 'team',
  price: 'price',
  limit: 'limit',
  total: 'total',
  qty: 'qty',
  totalPrice: 'total price',
  transaction: 'transaction',
  paymentDate: 'payment date',
  location: 'location',
};

const methodType = {
  edcp: 'edcp',
  usdc: 'usdc',
};

const TicketItemModal = ({
  ticket,
  boxContractAddress,
  quote,
  mysterybox_id,
  setIsTicketItemModalOpen,
}: Props) => {
  const { price, createdAt, name } = ticket;
  const [quantity, setQuantity] = useState<number>(1);
  const [method, setMethod] = useState<string>(methodType.edcp);
  const [isCompleteModal, setIsCompleteModal] = useState<boolean>(false);
  const [klayPrice, setKlayPrice] = useState(0);
  const [maticPrice, setMaticPrice] = useState(0);
  const [dollarPrice, setDollarPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
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
  const { library, chainId } = useActiveWeb3React();
  const { account } = useAccount();
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: any) => state.webUser);

  const edcpPrice = dollarPrice / 10;
  const totalPriceEDCP = edcpPrice * quantity;
  const totalPriceUSDC = price * quantity;
  const totalPriceString =
    method === methodType.edcp
      ? `${totalPriceEDCP.toFixed(4)} EDCP`
      : `${totalPriceUSDC.toFixed(3)} USDC`;
  const fullTotalPriceString = `${totalPriceString} (~$${totalPriceUSDC.toFixed(3)})`;

  const handleAbcClose = () => {
    setAbcToken('');
    setAbcOpen(false);
  };

  const handleAbcTokenChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { value } = event.target;
    setAbcToken(value);
  };

  function hexToAddress(hexVal: any) {
    return '0x' + hexVal.substr(-40);
  }

  const handleAbcConfirmClick = async () => {
    setOtpLoading(true);
    console.log(`abc token : ${abcToken}`); // Google OTP

    // Collection
    const contract = boxContractAddress;
    const index = ticket.no - 1 ?? 0;
    const amount = 1;

    let quoteToken: string;
    let payment: BigNumber;
    if (quote === 'matic' || quote === 'wmatic') {
      quoteToken = quote === 'matic' ? contracts.matic[chainId] : contracts.wmatic[chainId];
      payment = parseEther(ticket?.price.toString() ?? '0').mul(amount);
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
          mysterybox_id,
          buyer: user.uid,
          buyer_address: abcUser.accounts[0].ethAddress,
          isSent: true,
          txHash: result?.transactionHash,
          price: ticket?.price,
          itemId: ticket?.id,
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
      console.log(e);
      // if (e.code == '-32603') setErrMsg('Not sufficient Klay balance!');
      // return false;
      setOpenSnackbar({
        open: true,
        type: 'error',
        message: 'Purchase faield!',
      });
    }

    setAbcToken('');
    setAbcOpen(false);
    setOtpLoading(false);
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

  const handleBuyWithPoint = async () => {
    if (isLoading) {
      console.log('in progress');
      return;
    }

    try {
      const session = await getSession();
      if (!session.data.dropsUser) throw new Error('session expired.');
      const loginBy = window.localStorage.getItem('loginBy') ?? 'sns';
      const data = {
        mysterybox_id,
        buyer: session.data.dropsUser.uid,
        buyer_address: loginBy === 'sns' ? abcUser.accounts[0].ethAddress : account,
        isSent: false,
        txHash: '',
        // price: ticketInfo?.price,
        price: (((ticket?.price ?? 0) * maticPrice) / 10).toFixed(4),
        itemId: ticket?.id,
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
      console.log(e);
      setOpenSnackbar({
        open: true,
        type: 'error',
        message: 'Purchase faield!',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyWithMatic = async () => {
    const loginBy = window.localStorage.getItem('loginBy') ?? 'sns';
    if (loginBy === 'sns') {
      setAbcOpen(true);
      return;
    }
    // Collection
    const contract = boxContractAddress;
    const index = ticket.no - 1 ?? 0;
    const amount = 1;

    let quoteToken: string;
    let payment: BigNumber;
    if (quote === 'matic' || quote === 'wmatic') {
      quoteToken = quote === 'matic' ? contracts.matic[chainId] : contracts.wmatic[chainId];
      payment = parseEther(ticket?.price.toString() ?? '0').mul(amount);
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
          mysterybox_id,
          buyer: user.uid,
          buyer_address: account,
          isSent: true,
          txHash: result?.txHash,
          price: ticket?.price,
          itemId: ticket?.id,
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
        }
      } else {
        setOpenSnackbar({
          open: true,
          type: 'error',
          message: `Purchase failed! Tx Hash = ${result.txHash}`,
        });
      }
    } catch (e: any) {
      console.log(e);
      // if (e.code == '-32603') setErrMsg('Not sufficient Klay balance!');
      // return false;
      setOpenSnackbar({
        open: true,
        type: 'error',
        message: 'Purchase faield!',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar({
      open: false,
      type: '',
      message: '',
    });
  };

  useEffect(() => {
    getCoinPrice();
  }, []);

  useEffect(() => {
    setDollarPrice((price ?? 0) * maticPrice);
  }, [price, maticPrice]);

  const onSubmit = () => {
    setIsCompleteModal(true);
  };

  const onRedirectBack = () => {
    router.push(Routes.eternalEditions.my.tickets);
  };

  const onComplete = () => {
    method === methodType.edcp ? handleBuyWithPoint() : handleBuyWithMatic();
    setIsTicketItemModalOpen(false);
  };

  return (
    <>
      <Stack gap={3}>
        <Typography
          sx={{
            fontSize: { xs: '24px', md: '32px' },
            fontWeight: 'bold',
            lineHeight: { xs: '28px', md: '36px' },
          }}
        >
          {isCompleteModal ? 'Complete' : 'Mint'}
        </Typography>
        <Stack>
          <Typography
            sx={{
              fontSize: { xs: '16px', md: '24px' },
              fontWeight: 'bold',
              lineHeight: { xs: '24px', md: '28px' },
              marginBottom: '4px',
            }}
          >
            {name}
          </Typography>
          {createdAt && (
            <Typography
              sx={{
                fontSize: { xs: '12px', md: '16px' },
                lineHeight: { xs: '16px', md: '20px' },
                fontWeight: '400',
              }}
            >
              {fDate(createdAt, 'MMMM dd')} -{' '}
              <span
                style={{
                  fontSize: '16px',
                  lineHeight: '20px',
                  color: 'red',
                }}
              >
                31, 2022
              </span>
            </Typography>
          )}
          {ticket.properties && (
            <Typography
              sx={{
                fontSize: { xs: '12px', md: '16px' },
                lineHeight: { xs: '16px', md: '20px' },
                fontWeight: '400',
              }}
            >
              {ticket.properties[0].type.toLowerCase() === ticketLabel.location &&
                ticket.properties[0].name}
            </Typography>
          )}
        </Stack>
        <Stack>
          <Divider sx={{ marginBottom: '12px' }} />
          <Stack gap={0.5}>
            {ticketinfo(ticketLabel.day, fDate(createdAt, 'EEEE (MMMM dd, yyyy)'))}
            {ticketinfo(ticketLabel.team, 'Team Yellow', true)}
            {isCompleteModal ? (
              <>
                {/* setDollarPrice((ticketInfo?.price ?? 0) * maticPrice); */}
                {ticketinfo(ticketLabel.qty, quantity)}
                {ticketinfo(ticketLabel.totalPrice, fullTotalPriceString)}
                {ticketinfo(
                  ticketLabel.transaction,
                  '0x1234as5d4as8dsdasdas23da5dasdasdas25123',
                  true
                )}
                {ticketinfo(ticketLabel.paymentDate, '2022.10.11 13:00:25', true)}
              </>
            ) : (
              <>
                {ticketinfo(ticketLabel.price, `${edcpPrice.toFixed(4)} EDCP (~$${price})`)}
                {ticketinfo(ticketLabel.limit, '5 per wallet', true)}
              </>
            )}
          </Stack>
        </Stack>
        {!isCompleteModal && <QuantityControl quantity={quantity} setQuantity={setQuantity} />}
        {!isCompleteModal && (
          <Stack gap={3}>
            <Typography sx={{ color: '#999999', fontSize: '12px' }}>PAYMENT METHOD</Typography>
            <Radio
              checked={method === methodType.edcp}
              value="edcp"
              label={
                <Typography
                  fontWeight={700}
                  fontSize={14}
                  lineHeight="12px"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                >
                  {methodType.edcp.toUpperCase()}
                </Typography>
              }
              onClick={() => setMethod('edcp')}
            />
            <Radio
              checked={method === methodType.usdc}
              value="usdc"
              label={
                <Typography
                  fontWeight={700}
                  fontSize={14}
                  lineHeight="12px"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                >
                  {methodType.usdc.toUpperCase()}
                </Typography>
              }
              onClick={() => setMethod('usdc')}
            />
          </Stack>
        )}
        {!isCompleteModal && <Divider />}
      </Stack>
      {isCompleteModal ? (
        <Stack gap={0.25} sx={{ marginTop: '12px' }}>
          <RoundedButton
            onClick={onRedirectBack}
            variant="inactive"
            sx={{ color: palette.dark.common.black }}
          >
            MY ITEM
          </RoundedButton>
          <RoundedButton onClick={onComplete}>CONFIRM</RoundedButton>
        </Stack>
      ) : (
        <Stack gap={3} sx={{ marginTop: '12px' }}>
          {ticketinfo(ticketLabel.total, fullTotalPriceString)}
          <RoundedButton onClick={onSubmit}>COMPLETE PURCHASE</RoundedButton>
        </Stack>
      )}

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
    </>
  );
};

export default TicketItemModal;

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

const ticketinfo = (label: string, data: string | number | null, isMissingData = false) => (
  <Stack
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'row',
      marginBottom: '5px',
    }}
  >
    <Typography
      sx={{
        fontSize: {
          xs: '12px',
          md: '14px',
        },
        fontWeight: '400',
        lineHeight: '16.52px',
        textTransform: 'uppercase',
        color: '#999999',
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        fontSize: {
          xs: '12px',
          md: '14px',
        },
        fontWeight: '400',
        lineHeight: '16.52px',
        wordBreak: 'break-all',
        width: '50%',
        textAlign: 'right',
        color: isMissingData ? '#FF0000' : '#000000',
      }}
    >
      {data || ''}
    </Typography>
  </Stack>
);

const Loading = () => (
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
);
