import { Stack, Typography, styled } from '@mui/material';
import { useState } from 'react';
import { ModalCustomProps } from 'src/components/common/ModalCustom';
import { Label, Section, Value } from '../../StyledComponents';
import RoundedButton from 'src/components/common/RoundedButton';
import palette from 'src/theme/palette';
import TransferContent from './TransferContent';
import HyperlinkButton from 'src/components/ticket/HyperlinkButton';
import { getShotAddress } from 'src/utils/wallet';
import { OfferType } from './OffersContent';
import useActiveWeb3React from 'src/hooks/useActiveWeb3React';
import useAccount from 'src/hooks/useAccount';
import { getSession } from 'src/services/services';
import { AbcWeb3Provider } from '@colligence/klip-web3-provider';
import Web3Modal from '@colligence/web3modal';
import secureLocalStorage from 'react-secure-storage';
import { ethers } from 'ethers';
import { fullfillment } from 'src/seaport/fullfillment';
import { useRouter } from 'next/router';

interface Props extends Omit<ModalCustomProps, 'children'> {
  offer: OfferType | undefined;
}

function WinningBidContent({ offer, ...props }: Props) {
  const { library, chainId } = useActiveWeb3React();
  const { account } = useAccount();
  const router = useRouter();

  const [openTransfer, setOpenTransfer] = useState(false);
  const [isVerifided, setIsVerified] = useState(false);
  const [txid, setTxid] = useState('');

  if (!offer) {
    return null;
  }

  const onTransferSuccess = () => {
    setTxid('0x033c5e2f3059b57b6a91de1cb5ad0697023ea83a');
    setIsVerified(true);
    setOpenTransfer(false);
  };

  const onClose = () => {
    setTxid('');
    setIsVerified(false);
    setOpenTransfer(false);
  };

  const onConfirm = () => {
    if (typeof props.onClose === 'function') {
      props.onClose();
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

  const handleWinningBid = async () => {
    console.log('!! handleWinningBid : offer = ', offer);

    // Deaport Fulfillment
    // TODO : Seaport 호출
    let result;

    if (!library) {
      const provider = await getAbcWeb3Provider();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      result = await fullfillment(offer?.sellInfo, account!, provider);
    } else if (library) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      result = await fullfillment(offer?.sellInfo, account!, library);
    }
    // todo result 후 처리
    console.log('result 후 처리');
    if (result?.status === SUCCESS) {
      // setOpenSnackbar({
      //   open: true,
      //   type: 'success',
      //   message: 'Success BUY!',
      // });
      router.push('/my/tickets');
    } else {
      // setOpenSnackbar({
      //   open: true,
      //   type: 'error',
      //   message: 'Failed BUY!',
      // });
    }

    console.log('!! fullfillment result = ', result);

    // if (result) {
    //   const data = {
    //     buyer: webUser.user.uid,
    //     buyerAddress: account,
    //     price: sellbookInfo?.price,
    //     txHash: result?.transactionHash,
    //   };
    //
    //   await registerSellbookBuy(data, sellbookInfo?.id!);
    // }
  };

  if (openTransfer) {
    return (
      <TransferContent open={props.open} onClose={onClose} onSubmitSuccess={onTransferSuccess} />
    );
  }

  return (
    <Stack gap={3}>
      <Typography variant="h3">WINNING BID</Typography>

      <Section>
        <StyledLabel>PRICE</StyledLabel>
        <StyledValue>{offer.price}</StyledValue>
      </Section>

      <Section>
        <StyledLabel>USD PRICE</StyledLabel>
        <StyledValue>{offer.usdPrice}</StyledValue>
      </Section>

      <Section>
        <StyledLabel>FLOOR DIFFERENCE</StyledLabel>
        <StyledValue>{offer.floorDifference}</StyledValue>
      </Section>

      <Section>
        <StyledLabel>FROM</StyledLabel>
        <StyledValue>홍길동</StyledValue>
      </Section>

      {txid ? (
        <Section>
          <StyledLabel>TXID</StyledLabel>
          <Stack flexDirection="row" alignItems="center" gap="12px">
            <StyledValue>{getShotAddress(offer.address)}</StyledValue>
            <HyperlinkButton href={''} styles={{ backgroundColor: '#F5F5F5' }} />
          </Stack>
        </Section>
      ) : null}

      {isVerifided ? (
        <RoundedButton onClick={onConfirm}>confirm</RoundedButton>
      ) : (
        // <RoundedButton onClick={() => setOpenTransfer(true)}>winning bid</RoundedButton>
        <RoundedButton onClick={handleWinningBid}>winning bid</RoundedButton>
      )}
    </Stack>
  );
}

export default WinningBidContent;

// ----------------------------------------------------------------------

const StyledLabel = styled(Label)(() => ({
  color: palette.dark.black.lighter,
}));

const StyledValue = styled(Value)(() => ({
  color: palette.dark.common.black,
}));
