import {
  Backdrop,
  Box,
  Divider,
  Fade,
  FormControl,
  Input,
  inputClasses,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import React, { ChangeEvent, useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import RoundedButton from 'src/components/common/RoundedButton';
import { Label, Section, Value } from 'src/components/my-tickets/StyledComponents';
import { useResponsive } from 'src/hooks';
import palette from 'src/theme/palette';
import { MyTicketTypes } from 'src/@types/my/myTicket';
import { abcSendTx } from 'src/utils/abcTransactions';
import { collectionAbi } from 'src/config/abi/Collection';
import useActiveWeb3React from 'src/hooks/useActiveWeb3React';
import useAccount from 'src/hooks/useAccount';
import { useSelector } from 'react-redux';
import { nftTransferFrom } from 'src/utils/transactions';
import contracts from 'src/config/constants/contracts';
import { SUCCESS } from 'src/config';
import { LoadingButton } from '@mui/lab';
import CSnackbar from 'src/components/common/CSnackbar';

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

interface Props {
  ticketInfo: MyTicketTypes;
  onClose: () => void;
}

export default function SaveTicketContent({ ticketInfo, onClose }: Props) {
  const { library, chainId } = useActiveWeb3React();
  const { account } = useAccount();
  const webUser = useSelector((state: any) => state.webUser);
  const abcUser = useSelector((state: any) => state.user);

  const isMobile = useResponsive('down', 'md');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [qrTimestamp, setQrTimestamp] = useState(0);
  const [address, setAddress] = useState('');
  const [abcToken, setAbcToken] = useState('');
  const [abcOpen, setAbcOpen] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [isAbc, setIsAbc] = useState(false);
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

  useEffect(() => {
    if (account === webUser.user.abc_address) {
      setIsAbc(true);
      console.log('!! isAbc ? ', true);
    } else {
      setIsAbc(false);
      console.log('!! isAbc ? ', false);
    }
  }, [account, webUser]);

  const handleChangeAddress = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAddress(value);
  };
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
  const saveTicket = () => setIsSaved(true);
  const transfer = async () => {
    console.log('click transfer');
    console.log(ticketInfo);
    console.log(`address : ${address}`);

    setOtpLoading(true);
    const contract = ticketInfo.mysteryboxInfo.boxContractAddress;
    const tokenId = ticketInfo.tokenId;
    const quote = ticketInfo?.quote;
    let quoteToken: string;
    if (quote === 'matic' || quote === 'wmatic') {
      // TODO : Quote 가 MATIC 이 아닌 경우는 어떻하지 ?
      quoteToken = quote === 'matic' ? contracts.matic[chainId] : contracts.wmatic[chainId];
    }

    // TODO : 버튼 로딩 시작
    if (isAbc) {
      const method = 'transferFrom';
      const txArgs = [account, address, tokenId];

      try {
        const result = await abcSendTx(abcToken, contract, collectionAbi, method, txArgs, abcUser);

        if (parseInt(result.status.toString(), 16) === SUCCESS) {
          setOpenSnackbar({
            open: true,
            type: 'success',
            message: `Success Transfer.`,
          });
          // TODO : DB drops 테이블에서 삭제 ?
        } else {
          setOpenSnackbar({
            open: true,
            type: 'error',
            message: `Field Transfer.`,
          });
        }
      } catch (e: any) {}
    } else {
      // Metamask
      const result = await nftTransferFrom(
        contract,
        address,
        tokenId.toString(),
        account!,
        library,
        false
      );
      console.log(result);
      if (result === SUCCESS) {
        setOpenSnackbar({
          open: true,
          type: 'success',
          message: `Success Transfer.`,
        });
        // TODO : DB drops 테이블에서 삭제 ?
      } else {
        setOpenSnackbar({
          open: true,
          type: 'error',
          message: `Field Transfer.`,
        });
      }
    }
    // TODO : 버튼 로딩 끝
    setOtpLoading(false);
    onClose();
  };

  useEffect(() => {
    const now = new Date();
    setQrTimestamp(now.setMinutes(now.getMinutes() + 5));
  }, []);

  return (
    <Box
      sx={{
        pt: {
          xs: '48px',
          md: '24px',
        },
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <QRCode
          style={{}}
          value={`https://entrance.eternaleditions.io/admin-e-ticket?type=2&tokenId=${ticketInfo.tokenId}&nftid=${ticketInfo.mysteryBoxId}&expireTime=${qrTimestamp}`}
          size={160}
        />
      </Box>

      <Stack gap="12px" mt="48px" mb="24px">
        <Stack gap={0.5}>
          <Typography
            sx={{
              fontSize: 24,
              lineHeight: 28 / 24,
            }}
          >
            {ticketInfo.location}
          </Typography>

          <Stack>
            <Typography variant="body2">{ticketInfo.duration}</Typography>
            <Typography variant="body2">{ticketInfo.mysteryboxInfo.boxContractAddress}</Typography>
          </Stack>
        </Stack>
        <Divider />
        <Section>
          <Stack direction="row" justifyContent="space-between">
            <Label sx={{ color: palette.dark.black.darker }}>DAY</Label>
            <Value sx={{ color: palette.dark.black.main }}> {ticketInfo.day} </Value>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Label sx={{ color: palette.dark.black.darker }}>TEAM</Label>
            <Label sx={{ color: palette.dark.black.main }}> {`Team ${ticketInfo.team}`} </Label>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Label sx={{ color: palette.dark.black.darker }}>QTY</Label>
            <Value sx={{ color: 'red' }}> 1 </Value>
          </Stack>
        </Section>
        <Divider />
        <Typography variant="caption" sx={{ color: palette.dark.black.lighter }}>
          Please show the QR image to the ticket entrance manager.
        </Typography>
      </Stack>

      {isSaved && (
        <>
          <FormControl variant="standard" fullWidth>
            <Label sx={{ color: palette.dark.black.darker, mb: '12px' }}>ADDRESS</Label>
            <Input
              value={address}
              onChange={handleChangeAddress}
              placeholder="e.g. 1234..."
              inputProps={{
                style: {
                  color: 'black',
                },
              }}
              sx={{
                fontSize: 14,
                lineHeight: 20 / 14,
                [`.${inputClasses.input}::placeholder`]: {
                  color: '#BBBBBB',
                },
              }}
            />
          </FormControl>
          <Typography variant="body2" sx={{ textAlign: 'center', paddingY: 3 }}>
            Kansas City, KS Silver Editio will be transferred to...
          </Typography>
        </>
      )}

      <RoundedButton
        variant="default"
        size={isMobile ? 'small' : 'large'}
        fullWidth
        onClick={isSaved ? (isAbc ? () => setAbcOpen(true) : transfer) : saveTicket}
      >
        {isSaved ? 'Transfer' : 'Save the ticket'}
      </RoundedButton>

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
                onClick={transfer}
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
    </Box>
  );
}
