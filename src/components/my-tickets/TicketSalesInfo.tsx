import { Box, CircularProgress, Stack } from '@mui/material';
import React, { SetStateAction, useState } from 'react';
import RoundedButton from '../common/RoundedButton';
import { Hr, Label, Row, TotalValue, Value } from './StyledComponents';
import { MyTicketTypes } from 'src/@types/my/myTicket';
import { fixedPriceSell } from 'src/seaport/fixedPriceSell';
import { useWeb3React } from '@web3-react/core';
import { useSelector } from 'react-redux';
import useAccount from 'src/hooks/useAccount';
import { getSession, registerSell } from 'src/services/services';
import { ethers, utils } from 'ethers';
import { AbcWeb3Provider } from '@colligence/abc-web3-provider';
import Web3Modal from '@colligence/web3modal';
import secureLocalStorage from 'react-secure-storage';
import { fDate } from 'src/utils/formatTime';
import { englishAuctionSell } from 'src/seaport/englishAuction';
import useActiveWeb3React from 'src/hooks/useActiveWeb3React';
import CSnackbar from 'src/components/common/CSnackbar';
import OffersModal from './offers';

interface Props {
  sellTicketInfo: MyTicketTypes;
  amount: string;
  typeOfSale: string;
  creatorEarnings: string;
  startDate: Date;
  endDate: Date;
  minInc: string;
  isForSale: boolean;
  team: string;
  day: string;
  setOpenSnackbar: SetStateAction<any>;
  onCancel: () => void;
}

enum sellType {
  NONE,
  FIXED,
  AUCTION,
}

export default function TicketSalesInfo({
  sellTicketInfo,
  day,
  team,
  amount,
  typeOfSale,
  creatorEarnings,
  startDate,
  endDate,
  minInc,
  isForSale,
  setOpenSnackbar,
  onCancel,
}: Props) {
  const isAuction = typeOfSale === 'auction';
  const webUser = useSelector((state: any) => state.webUser);
  const { library, chainId } = useActiveWeb3React();
  const { account } = useAccount();
  console.log(sellTicketInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [endSubmit, setEndSubmit] = useState(false);

  const [openOffersModal, setOpenOffersModal] = useState(false);

  const typeOfSell = sellTicketInfo?.sellbook?.type;

  console.log(sellTicketInfo);
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

  const insertSellbook = async (order: any, type: number, quoteType: string) => {
    const team = sellTicketInfo.mysteryboxItem.properties.filter(
      (property: any) => property.type === 'team'
    );

    const sellOrder = {
      uid: webUser.user.uid,
      wallet: account,
      type: type, // Fixed Price Sell
      // @ts-ignore null일 수 가 없음.
      mysteryboxId: sellTicketInfo.mysteryboxInfo.id,
      // @ts-ignore null일 수 가 없음.
      mysteryboxItemId: sellTicketInfo.mysteryboxItem.id,
      sellInfo: order,
      tokenId: sellTicketInfo.tokenId,
      price: quoteType === 'crypto' ? amount : parseFloat(amount) * 10, // USDC 단위로 변환
      team: team[0].name,
      dropsId: sellTicketInfo.id,
      startDate,
      endDate,
      minInc: quoteType === 'crypto' ? minInc : parseFloat(minInc) * 10, // USDC 단위로 변환
      creatorFee: creatorEarnings,
    };
    console.log('!! sellOrder for DB = ', sellOrder);
    const result = await registerSell(sellOrder);
    console.log('!! Sell Result : ', result);
    if (result.status === 200) {
      setOpenSnackbar({
        open: true,
        type: 'success',
        message: 'Sell completed!',
      });
      setEndSubmit(true);
    } else {
      console.log('... Failed');
      setOpenSnackbar({
        open: true,
        type: 'error',
        message: 'Failed Sell!',
      });
    }
  };

  const sellByPoint = async () => {
    if (typeOfSale === 'fixed') {
      console.log('click Fixed Price');
      await insertSellbook(null, sellType.FIXED, 'point');
    } else if (typeOfSale === 'auction') {
      console.log('click English auction');
      await insertSellbook(null, sellType.AUCTION, 'point');
    }
  };

  const sellByCrypto = async () => {
    let order;
    const endTime = Math.round(endDate.getTime() / 1000);
    let price;
    if (sellTicketInfo.mysteryboxInfo?.quote === 'matic')
      price = utils.parseEther((amount ?? '0.0').toString()).toString();
    else price = utils.parseUnits(amount ?? '0.0', 6).toString();

    console.log('!! sellByCrypto typeOfSell = ', typeOfSale);
    if (typeOfSale === 'fixed') {
      console.log('click Fixed Price');

      console.log('=== account, library ===', account, library);
      try {
        if (!library) {
          const provider = await getAbcWeb3Provider();

          // TODO : CreatorFee 를 어떻게 처리할 것인지 확인이 필요함.
          order = await fixedPriceSell(
            sellTicketInfo.mysteryboxInfo?.boxContractAddress,
            sellTicketInfo.tokenId.toString(),
            price,
            sellTicketInfo.mysteryboxInfo?.quote,
            chainId,
            endTime.toString(),
            sellTicketInfo.mysteryboxInfo?.creatorAddress,
            account,
            provider
          );
        } else if (library) {
          order = await fixedPriceSell(
            sellTicketInfo.mysteryboxInfo?.boxContractAddress,
            sellTicketInfo.tokenId.toString(),
            price,
            sellTicketInfo.mysteryboxInfo?.quote,
            chainId,
            endTime.toString(),
            sellTicketInfo.mysteryboxInfo?.creatorAddress,
            account,
            library
          );
        }
      } catch (err) {
        console.log('!! fixedPriceSell error = ', err);
        return;
      }

      await insertSellbook(order, sellType.FIXED, 'crypto');
    } else if (typeOfSale === 'auction') {
      console.log('click English auction');

      console.log('=== account, library ===', account, library);
      try {
        if (!library) {
          const provider = await getAbcWeb3Provider();

          // TODO : CreatorFee 를 어떻게 처리할 것인지 확인이 필요함.
          order = await englishAuctionSell(
            sellTicketInfo.mysteryboxInfo?.boxContractAddress,
            sellTicketInfo.tokenId.toString(),
            price,
            sellTicketInfo.mysteryboxInfo?.quote,
            chainId,
            endTime.toString(),
            sellTicketInfo.mysteryboxInfo?.creatorAddress,
            account,
            provider
          );
        } else if (library) {
          order = await englishAuctionSell(
            sellTicketInfo.mysteryboxInfo?.boxContractAddress,
            sellTicketInfo.tokenId.toString(),
            price,
            sellTicketInfo.mysteryboxInfo?.quote,
            chainId,
            endTime.toString(),
            sellTicketInfo.mysteryboxInfo?.creatorAddress,
            account,
            library
          );
        }
      } catch (err) {
        console.log('!! englishAuctionSell error = ', err);
        return;
      }

      await insertSellbook(order, sellType.AUCTION, 'crypto');
    }
  };

  const handleClickConfirm = async () => {
    setIsLoading(true);
    console.log('click confirm.');
    console.log(sellTicketInfo);
    console.log(`amount : ${amount}`);
    console.log(`typeOfSale : ${typeOfSale}`);
    console.log(`creatorEarnings : ${creatorEarnings}`);

    // buyerAddress 비교 - ABC 로 산 건지, Metamask 로 산 건지 비교
    if (sellTicketInfo.buyerAddress === webUser.user.eth_address) {
      if (!library) {
        alert('Metamask 지갑으로 다시 로그인을 하세요');
        return;
      }
    } else if (sellTicketInfo.buyerAddress === webUser.user.abc_address) {
      if (library) {
        alert('SNS 계정으로 다시 로그인을 하세요');
        return;
      }
    }

    if (sellTicketInfo.usePoint) await sellByPoint();
    else await sellByCrypto();

    setIsLoading(false);
  };

  return (
    <Stack gap="24px" justifyContent="space-between" sx={{ height: '100%' }} position={'relative'}>
      <Stack gap="12px">
        <Stack gap={{ xs: 2, md: '7px' }}>
          <Row>
            <Label>Day</Label>
            <Value>{day}</Value>
          </Row>
          <Row>
            <Label>Team</Label>
            <Value>{`Team ${team}`}</Value>
          </Row>
        </Stack>
        <Hr />
        <Stack gap={{ xs: 2, md: '7px' }}>
          <Row>
            <Label>Status</Label>
            <Value>{isAuction ? 'On Auction' : 'For Sale'}</Value>
          </Row>
          <Row>
            <Label>Reserve Price</Label>
            {sellTicketInfo.usePoint ? (
              <Value>{`${sellTicketInfo.price / 10} EDCP ($ ${sellTicketInfo.price})`}</Value>
            ) : (
              <Value>{`${sellTicketInfo.price} USDC ($ ${sellTicketInfo.price})`}</Value>
            )}
          </Row>
          {isAuction ? (
            <Row>
              <Label>Current Price</Label>
              <Value>$ 74.9(Ξ 0.05742)</Value>
            </Row>
          ) : null}
          <Row>
            <Label>Duration of Listing</Label>
            <Value>
              {fDate(startDate, 'yyyy.MM.dd')} ~ {fDate(endDate, 'yyyy.MM.dd')}
            </Value>
          </Row>
          <Row>
            <Label>Creator Earnings</Label>
            <Value>{creatorEarnings}%</Value>
          </Row>
        </Stack>
        <Label sx={{ mt: '15px' }}>Summary</Label>
        <Hr />
        <Stack gap={{ xs: 2, md: '7px' }}>
          <Row>
            <Label>Listing Price</Label>
            <Value>
              {amount} {sellTicketInfo.usePoint ? 'EDCP' : 'USDC'}
            </Value>
          </Row>
          <Row>
            <Label>Service fee</Label>
            <Value>2.5%</Value>
          </Row>{' '}
          <Row>
            <Label>Creator earnings</Label>
            <Value>{creatorEarnings}%</Value>
          </Row>
        </Stack>
        <Hr />
        <Row>
          <Label>Potential earning</Label>
          <TotalValue>
            {parseFloat(amount) - parseFloat(amount) / 10}{' '}
            {sellTicketInfo.usePoint ? 'EDCP' : 'USDC'}
          </TotalValue>
        </Row>
      </Stack>

      {!isForSale ? (
        <>
          {isLoading ? (
            <Box
              sx={{
                // width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'fixed',
                bottom: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <CircularProgress size={'2rem'} />
            </Box>
          ) : endSubmit ? null : (
            <RoundedButton variant="withImage" onClick={handleClickConfirm}>
              CONFIRM
            </RoundedButton>
          )}
        </>
      ) : (
        <Stack gap={0.25}>
          <RoundedButton onClick={onCancel} variant="withImage">
            CANCEL SALES
          </RoundedButton>
          {typeOfSell === sellType.AUCTION ? (
            <RoundedButton onClick={() => setOpenOffersModal(true)}>CHECK OFFERS</RoundedButton>
          ) : (
            ''
          )}
        </Stack>
      )}

      <OffersModal
        open={openOffersModal}
        onClose={() => setOpenOffersModal(false)}
        sellbookId={sellTicketInfo?.sellbook?.id}
        reservePrice={sellTicketInfo.price}
      />

      {/*{isAuction ? <RoundedButton variant="withImage">CONFIRM</RoundedButton> : null}*/}
    </Stack>
  );
}
