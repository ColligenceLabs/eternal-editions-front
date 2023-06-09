/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import axios from 'axios';
// import fetchAdapter from '@vespaiach/axios-fetch-adapter';
import queryString from 'query-string';

import secureLocalStorage from 'react-secure-storage';

// import { dekeyStore } from '../background/init';
import { AbcLoginResponse } from '../schema/account';

import { abcTokenRefresh } from '../../services/services';
import env from '../../env';

console.log('!!!! APP_SERVER_ADDRESS = ', env.APP_SERVER_ADDRESS);
console.log('!!!! APP_SERVER_ADDRESS_PROTOCOL = ', env.APP_SERVER_ADDRESS_PROTOCOL);
export const apiClient = axios.create({
  // baseURL: `${process.env.APP_SERVER_ADDRESS_PROTOCOL}://${process.env.APP_SERVER_ADDRESS}/api/`,
  baseURL: `${env.APP_SERVER_ADDRESS_PROTOCOL}://${env.APP_SERVER_ADDRESS}/api/`,
  // timeout: 1000,
  // adapter: fetchAdapter,
});

apiClient.interceptors.request.use((cfg) => {
  console.log('--- axios-- cfg--', cfg);
  // const { abcAuth } = dekeyStore.getState();
  // const abcAuth = JSON.parse(window.localStorage.getItem('abcAuth'));
  // TODO : 가끔 못 읽는 경우가 있는 듯...
  const abcAuth = JSON.parse(<string>secureLocalStorage.getItem('abcAuth'));

  // @ts-ignore
  if (!cfg?.headers?.authorization) {
    console.log('1---------------------->>>>>', abcAuth);
    console.log('2---------------------->>>>>', abcAuth.accessToken);
    // @ts-ignore
    cfg.headers.authorization = `Bearer ${abcAuth?.accessToken}`;
  }

  return cfg;

  // 특정 api endpoint일 때만 token을 붙이도록 설정
  // if (cfg.url.startsWith(window.API_ENDPOINT)) {
  //   // request를 보낼 때 access token을 자동으로 붙이도록 함
  //   cfg.headers.authorization = `Bearer ${abcAuth.accessToken}`;
  // }
});

apiClient.interceptors.response.use(
  (response) => {
    // 응답 데이터 처리
    console.log('apiClient.interceptors.response ..... ok', response);
    return response;
  },
  async (error) => {
    // 오류 응답 처리
    let errResponseStatus = null;
    const originalRequest = error.config;

    try {
      errResponseStatus = error.response.status;
    } catch (e) {}

    if (
      (error.message === 'Network Error' || errResponseStatus === 401) &&
      !originalRequest.retry
    ) {
      originalRequest.retry = true;
      // const { abcAuth } = dekeyStore.getState();
      // const abcAuth = JSON.parse(window.localStorage.getItem('abcAuth'));
      const abcAuth = JSON.parse(<string>secureLocalStorage.getItem('abcAuth'));
      const preRefreshToken = abcAuth.refreshToken;

      if (preRefreshToken) {
        // refresh token을 이용하여 access token 재발행 받기
        // return axios
        //   .request({
        //     url: 'https://${env.ABC_SERVER_ADDRESS}/auth/auth-service/refresh',
        //     method: 'post',
        //     // adapter: fetchAdapter,
        //     headers: { 'content-type': 'application/x-www-form-urlencoded' },
        //     data: queryString.stringify({
        //       grant_type: 'refresh_token',
        //       refresh_token: preRefreshToken,
        //     }),
        //   })
        //   .then((res) => {
        //     const responseData = AbcLoginResponse.parse(res.data);
        //
        //     // dekeyStore.updateStore({
        //     //   abcAuth: {
        //     //     accessToken: responseData.access_token,
        //     //     refreshToken: responseData.refresh_token,
        //     //     tokenType: responseData.token_type,
        //     //     expiresIn: responseData.expire_in,
        //     //   },
        //     // });
        //     // window.localStorage.setItem('abcAuth', JSON.stringify(responseData));
        //     console.log('========== refresh access token ========================================');
        //     secureLocalStorage.setItem('abcAuth', JSON.stringify(responseData));
        //
        //     originalRequest.headers.authorization = `Bearer ${responseData.access_token}`;
        //     return axios(originalRequest);
        //   })
        //   .catch((error) => {
        //     // access token을 받아오지 못하는 오류 발생시 logout 처리
        //     // dekeyStore.updateStore({ abcAuth: null });
        //
        //     return false;
        //   });

        try {
          const res = await abcTokenRefresh({
            refresh_token: preRefreshToken,
          });

          const resData = AbcLoginResponse.parse(res.data);
          const responseData = {
            accessToken: resData.access_token,
            refreshToken: resData.refresh_token,
            tokenType: resData.token_type,
            expiresIn: resData.expire_in,
          };
          console.log('===== refresh token ===>', responseData);

          // dekeyStore.updateStore({
          //   abcAuth: {
          //     accessToken: responseData.access_token,
          //     refreshToken: responseData.refresh_token,
          //     tokenType: responseData.token_type,
          //     expiresIn: responseData.expire_in,
          //   },
          // });
          // window.localStorage.setItem('abcAuth', JSON.stringify(responseData));
          console.log('========== refresh access token ========================================');
          secureLocalStorage.removeItem('abcAuth');
          secureLocalStorage.setItem('abcAuth', JSON.stringify(responseData));

          originalRequest.headers.authorization = `Bearer ${responseData.accessToken}`;
          return axios(originalRequest);
        } catch (error) {
          // access token을 받아오지 못하는 오류 발생시 logout 처리
          // dekeyStore.updateStore({ abcAuth: null });

          return false;
        }
      }

      return Promise.reject(error);
    }

    return Promise.reject(error.response?.data);
  }
);

export const coingeckoClient = axios.create({
  baseURL: `https://api.coingecko.com/api/v3`,
  // adapter: fetchAdapter,
});

export const abcAdminApiClient = axios.create({
  // adapter: fetchAdapter,
  timeout: 3000,
});
abcAdminApiClient.interceptors.request.use((cfg) => {
  // const { abcAuth } = dekeyStore.getState();
  // const abcAuth = JSON.parse(window.localStorage.getItem('abcAuth'));
  const abcAuth = JSON.parse(<string>secureLocalStorage.getItem('abcAuth'));

  // @ts-ignore
  if (!cfg?.headers?.authorization) {
    // @ts-ignore
    cfg.headers.authorization = `Bearer ${abcAuth?.accessToken}`;
  }

  return cfg;
});
abcAdminApiClient.interceptors.response.use(
  (response) => {
    // 응답 데이터 처리
    return response;
  },
  (error) => {
    // 오류 응답 처리
    let errResponseStatus = null;
    const originalRequest = error.config;

    try {
      errResponseStatus = error.response.status;
    } catch (e) {}

    if (
      (error.message === 'Network Error' || errResponseStatus === 401) &&
      !originalRequest.retry
    ) {
      originalRequest.retry = true;
      // const { abcAuth } = dekeyStore.getState();
      // const abcAuth = JSON.parse(window.localStorage.getItem('abcAuth'));
      const abcAuth = JSON.parse(<string>secureLocalStorage.getItem('abcAuth'));
      const preRefreshToken = abcAuth.refreshToken;

      if (preRefreshToken) {
        // refresh token을 이용하여 access token 재발행 받기
        return axios
          .request({
            url: `https://${env.ABC_SERVER_ADDRESS}/auth/auth-service/refresh`,
            method: 'post',
            // adapter: fetchAdapter,
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: queryString.stringify({
              grant_type: 'refresh_token',
              refresh_token: preRefreshToken,
            }),
          })
          .then((res) => {
            const responseData = AbcLoginResponse.parse(res.data);

            // dekeyStore.updateStore({
            //   abcAuth: {
            //     accessToken: responseData.access_token,
            //     refreshToken: responseData.refresh_token,
            //     tokenType: responseData.token_type,
            //     expiresIn: responseData.expire_in,
            //   },
            // });
            // window.localStorage.setItem('abcAuth', JSON.stringify(responseData));
            secureLocalStorage.setItem('abcAuth', JSON.stringify(responseData));

            originalRequest.headers.authorization = `Bearer ${responseData.access_token}`;
            return axios(originalRequest);
          })
          .catch((error) => {
            // access token을 받아오지 못하는 오류 발생시 logout 처리
            // dekeyStore.updateStore({ abcAuth: null });

            return false;
          });
      }

      return Promise.reject(error);
    }

    return Promise.reject(error?.response?.data);
  }
);
