import { Seaport } from '@colligence/seaport-js';
import env from '../env';
import { ethers } from 'ethers';

export const fullfillment = async (
  order: any,
  account: string,
  library: any
) => {
  const seaport_v1_4 = new Seaport(library.getSigner(), {
    // @ts-ignore 왜 타입 오류가 발생하지 ?
    conduitKeyToConduit: env.CONDUIT_KEYS_TO_CONDUIT,
    overrides: {
      defaultConduitKey: env.CROSS_CHAIN_DEFAULT_CONDUIT_KEY,
    },
    seaportVersion: '1.4',
  });

  const { executeAllActions: executeAllFulfillActions } =
    await seaport_v1_4.fulfillOrder({
      order,
      accountAddress: account,
    });

  const transaction = await executeAllFulfillActions();
  const receipt = await transaction.wait();

  console.log('!! Receipt = ', receipt);
  return receipt;
};
