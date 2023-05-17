import { Stack } from '@mui/material';
import React from 'react';
import RoundedButton from '../common/RoundedButton';
import { Hr, Label, Row, TotalValue, Value } from './StyledComponents';
import { MyTicketTypes } from 'src/@types/my/myTicket';
import { fixedPriceSell } from 'src/seaport/fixedPriceSell';
import { useWeb3React } from '@web3-react/core';
import { useSelector } from 'react-redux';
import useAccount from 'src/hooks/useAccount';
import { getSession, registerSell } from 'src/services/services';
import { ethers, utils } from 'ethers';
import { AbcWeb3Provider } from '@colligence/klip-web3-provider';
import Web3Modal from '@colligence/web3modal';
import secureLocalStorage from 'react-secure-storage';

interface Props {
  sellTicketInfo: MyTicketTypes;
  amount: string;
  typeOfSale: string;
  creatorEarnings: string;
  duration: string;
}

export default function TicketSalesInfo({
  sellTicketInfo,
  amount,
  typeOfSale,
  creatorEarnings,
  duration,
}: Props) {
  const isAuction = typeOfSale === 'auction';

  const { account: wallet, library } = useWeb3React();
  const user = useSelector((state: any) => state.user);
  const { account } = useAccount();

  const handleClickConfirm = async () => {
    console.log('click confirm.');
    console.log(sellTicketInfo);
    console.log(`amount : ${amount}`);
    console.log(`typeOfSale : ${typeOfSale}`);
    console.log(`creatorEarnings : ${creatorEarnings}`);
    console.log(`duration : ${duration}`); // unit : month

    if (typeOfSale === 'fixed') {
      const endTime = Math.round(Date.now() / 1000 + 60 * 60 * 24 * 30 * parseInt(duration));

      // if (account && (library || abcProvider)) {
      let order;
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

          const provider = new ethers.providers.Web3Provider(instance);
          // await provider.enable();
          const signer = provider.getSigner();
          console.log('=============>', signer);

          order = await fixedPriceSell(
              sellTicketInfo.mysteryboxInfo?.boxContractAddress,
              sellTicketInfo.tokenId.toString(),
              utils.parseEther((amount ?? '0.0').toString()).toString(), // TODO : what is default price ?
              endTime.toString(),
              sellTicketInfo.mysteryboxInfo?.creatorAddress,
              wallet,
              provider
          );
        }
      }

      // const order = await fixedPriceSell(
      //     sellTicketInfo.mysteryboxInfo?.boxContractAddress,
      //     sellTicketInfo.tokenId.toString(),
      //     utils.parseEther((amount ?? '0.0').toString()).toString(), // TODO : what is default price ?
      //     endTime.toString(),
      //     sellTicketInfo.mysteryboxInfo?.creatorAddress,
      //     wallet,
      //     library ? library : abcProvider.abcProvider
      // );

      const sellOrder = {
        uid: user.user.uid,
        // wallet: account,
        wallet,
        type: 1, // Fixed Price Sell
        // @ts-ignore null일 수 가 없음.
        mysteryboxId: sellTicketInfo.mysteryboxInfo.id,
        // @ts-ignore null일 수 가 없음.
        mysteryboxItemId: sellTicketInfo.mysteryboxItem.id,
        sellInfo: order,
        tokenId: sellTicketInfo.tokenId,
        price: amount,
      };
      const result = await registerSell(sellOrder);
      console.log('!! Sell Result : ', result);
      if (result.status === 200) {
        console.log('... Success');
      } else {
        console.log('... Failed');
      }
      // }
    }
    // else if (methodId === 1) {
    //   console.log('click English auction');
    // } else {
    //   console.log('click Dutch auction');
    // }
  };
  return (
    <Stack gap="24px" justifyContent="space-between" sx={{ height: '100%' }}>
      <Stack gap="12px">
        <Stack gap={{ xs: 2, md: '7px' }}>
          <Row>
            <Label>Day</Label>
            <Value>Wednesday (November 11,2023)</Value>
          </Row>
          <Row>
            <Label>Team</Label>
            <Value>Team Yellow</Value>
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
            <Value>$ 37.45(Ξ 0.02871)</Value>
          </Row>
          {isAuction ? (
            <Row>
              <Label>Current Price</Label>
              <Value>$ 74.9(Ξ 0.05742)</Value>
            </Row>
          ) : null}
          <Row>
            <Label>Duration of Listing</Label>
            <Value>2022.11.16 ~ 2022.12.16</Value>
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
            <Value>-- EDCP</Value>
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
          <TotalValue>-- EDCP</TotalValue>
        </Row>
      </Stack>

      {/*{isAuction ? <RoundedButton variant="withImage">CONFIRM</RoundedButton> : null}*/}
      <RoundedButton variant="withImage" onClick={handleClickConfirm}>
        CONFIRM
      </RoundedButton>
    </Stack>
  );
}
