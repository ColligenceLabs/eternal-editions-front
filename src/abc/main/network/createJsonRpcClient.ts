/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import {mergeMiddleware} from 'json-rpc-engine';
// import {
//   createFetchMiddleware,
//   createBlockRefRewriteMiddleware,
//   createBlockCacheMiddleware,
//   createInflightCacheMiddleware,
//   createBlockTrackerInspectorMiddleware,
// } from 'eth-json-rpc-middleware';
import {
  createFetchMiddleware,
  createBlockRefRewriteMiddleware,
  createBlockCacheMiddleware,
  createInflightCacheMiddleware,
  createBlockTrackerInspectorMiddleware,
  createFetchKlaytnMiddleware,
  providerFromMiddleware,
} from 'dekey-eth-json-rpc-middleware';
// import {providerFromMiddleware} from 'dekey-eth-json-rpc-middleware';
import {PollingBlockTracker} from 'eth-block-tracker';
import {isKlaytn} from '../../utils/network';

const SECOND = 10000;

// const inTest = process.env.IN_TEST === 'true';
// const blockTrackerOpts = inTest ? {pollingInterval: SECOND} : {};
const blockTrackerOpts = {pollingInterval: SECOND};

export default function createJsonRpcClient({
  rpcUrl,
  chainId,
}: {
  rpcUrl: string;
  chainId: number;
}) {
  const fetchMiddleware = isKlaytn(chainId)
    ? createFetchKlaytnMiddleware({
        rpcUrl,
        chainId,
        encodedAuth: process.env.KLAYTN_AUTH_TOKEN,
      })
    : createFetchMiddleware({rpcUrl});

  const blockProvider = providerFromMiddleware(fetchMiddleware);
  const blockTracker = new PollingBlockTracker({
    ...blockTrackerOpts,
    provider: blockProvider as any,
  });

  const networkMiddleware = mergeMiddleware([
    createChainIdMiddleware(chainId),
    createBlockRefRewriteMiddleware({blockTracker}),
    createBlockCacheMiddleware({blockTracker}),
    createInflightCacheMiddleware(),
    createBlockTrackerInspectorMiddleware({blockTracker}),
    fetchMiddleware,
  ]);

  return {networkMiddleware, blockTracker};
}

function createChainIdMiddleware(chainId) {
  return (req, res, next, end) => {
    if (req.method === 'eth_chainId') {
      res.result = '0x' + chainId.toString(16);
      return end();
    }
    return next();
  };
}
