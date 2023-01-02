/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import axios from 'axios';
import fetchAdapter from '@vespaiach/axios-fetch-adapter';

export async function jsonRpcRequest(rpcUrl, rpcMethod, rpcParams = []) {
  let fetchUrl = rpcUrl;
  const headers: {
    'Content-Type': string;
    Authorization?: string;
  } = {
    'Content-Type': 'application/json',
  };
  // Convert basic auth URL component to Authorization header
  const {origin, pathname, username, password, search} = new URL(rpcUrl);
  // URLs containing username and password needs special processing
  if (username && password) {
    const encodedAuth = Buffer.from(`${username}:${password}`).toString(
      'base64'
    );
    headers.Authorization = `Basic ${encodedAuth}`;
    fetchUrl = `${origin}${pathname}${search}`;
  }

  const jsonRpcResponse = await axios.request({
    url: fetchUrl,
    method: 'post',
    adapter: fetchAdapter,
    data: {
      id: Date.now().toString(),
      jsonrpc: '2.0',
      method: rpcMethod,
      params: rpcParams,
    },
    headers,
  });

  // const jsonRpcResponse = await axios.post(
  //   fetchUrl,
  //   {
  //     id: Date.now().toString(),
  //     jsonrpc: '2.0',
  //     method: rpcMethod,
  //     params: rpcParams,
  //   },
  //   {
  //     headers,
  //   }
  // );
  // console.log(jsonRpcResponse);

  if (
    !jsonRpcResponse ||
    Array.isArray(jsonRpcResponse) ||
    typeof jsonRpcResponse !== 'object'
  ) {
    throw new Error(`RPC endpoint ${rpcUrl} returned non-object response.`);
  }
  const {status, data} = jsonRpcResponse;

  // if (error) {
  //   throw new Error(error?.message || error);
  // }
  return data.result;
}
