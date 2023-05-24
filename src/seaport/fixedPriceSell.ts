import { Seaport } from '@colligence/seaport-js';
import env from '../env';
import { BigNumber, ethers } from 'ethers';
import contracts from 'src/config/constants/contracts';

export const fixedPriceSell = async (
  address: string,
  tokenId: string,
  price: string,
  quote: string,
  chainId: number,
  endTime: string,
  creator: string | null | undefined,
  account: string | null | undefined,
  library: any
) => {
  console.log(
    '!!!!! Seaport Setup : ',
    env.CONDUIT_KEYS_TO_CONDUIT,
    env.CROSS_CHAIN_DEFAULT_CONDUIT_KEY,
    env.TRADING_FEE,
    env.CREATOR_FEE,
    env.TREASURY
  );
  const seaport_v1_4 = new Seaport(library.getSigner(), {
    // @ts-ignore 왜 타입 오류가 발생하지 ?
    conduitKeyToConduit: env.CONDUIT_KEYS_TO_CONDUIT,
    overrides: {
      defaultConduitKey: env.CROSS_CHAIN_DEFAULT_CONDUIT_KEY,
    },
    seaportVersion: '1.4',
  });

  const priceBN = BigNumber.from(price);
  const tradingFee = priceBN.mul(env.TRADING_FEE).div(1000);
  const creatorShare = priceBN.mul(env.CREATOR_FEE).div(1000);
  const profit = priceBN.sub(tradingFee).sub(creatorShare);
  const quoteToken =
    quote === 'matic'
      ? contracts.matic[chainId]
      : quote === 'usdc'
      ? contracts.usdc[chainId]
      : contracts.usdt[chainId];
  console.log(
    '=====>',
    priceBN.toString(),
    tradingFee.toString(),
    creatorShare.toString(),
    profit.toString(),
    quoteToken
  );

  const consideration = [];
  consideration.push({
    token: quoteToken,
    amount: profit.toString(),
    endAmount: profit.toString(),
    recipient: undefined,
  });
  consideration.push({
    token: quoteToken,
    amount: tradingFee.toString(),
    endAmount: tradingFee.toString(),
    recipient: env.TREASURY,
  });
  if (creator)
    consideration.push({
      token: quoteToken,
      amount: creatorShare.toString(),
      endAmount: creatorShare.toString(),
      recipient: creator,
    });

  console.log('!! offer : ', {
    offer: [
      {
        itemType: 2, // ERC-721
        token: address,
        identifier: tokenId,
        amount: '1',
      },
    ],
    consideration,
    startTime: undefined,
    endTime,
    zone: '0x0000000000000000000000000000000000000000',
    domain: undefined,
    salt: undefined,
    restrictedByZone: false,
    allowPartialFills: true,
  });
  const { executeAllActions } = await seaport_v1_4.createOrder(
    {
      offer: [
        {
          itemType: 2, // ERC-721
          token: address,
          identifier: tokenId,
          amount: '1',
        },
      ],
      consideration,
      startTime: undefined,
      endTime,
      zone: '0x0000000000000000000000000000000000000000',
      domain: undefined,
      salt: undefined,
      restrictedByZone: false,
      allowPartialFills: true,
    },
    account!
  );

  const order = await executeAllActions();

  console.log('!! Order = ', JSON.stringify(order));
  return order;
};
