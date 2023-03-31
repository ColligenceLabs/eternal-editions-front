/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import axios from 'axios';
import queryString from 'query-string';
// import fetchAdapter from '@vespaiach/axios-fetch-adapter';
import {
  AbcAddUserDto,
  AbcChangePasswordDto,
  AbcGetUserDto,
  AbcInitPasswordDto,
  AbcLoginDto,
  AbcLoginResult,
  AbcRefreshDto,
  AbcSearchBlackDomainDto,
  AbcSearchBlacklistDto,
  AbcSendEmailAuthCodeDto,
  AbcSnsAddUserDto,
  AbcVerifyEmailAuthCodeDto,
} from '../../../main/abc/interface';
import {
  AbcCreateSecureChannelResponse,
  AbcGetUrgentNoticeResponse,
  AbcLoginResponse,
  AbcSearchBlackDomainResopnse,
  AbcSearchBlacklistResopnse,
} from '../../../schema/account';
import { abcAdminApiClient } from '../../../utils/axios';
import { AbcLanguage, AbcMobileService } from '../../../schema/abc';
import env from '../../../../env';

// 인증서버 : https://dev-api.id.myabcwallet.com/auth
// 회원서버 : https://dev-api.id.myabcwallet.com/member

const memberBaseURL = `https://${env.ABC_SERVER_ADDRESS}/member`;
const authBaseURL = `https://${env.ABC_SERVER_ADDRESS}/auth`;

export class AbcRestApi {
  addUser = async (dto: AbcAddUserDto, channelid: string): Promise<any> => {
    try {
      const res = await axios.request({
        url: memberBaseURL + '/user-management/users/adduser',
        method: 'post',
        // adapter: fetchAdapter,
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Secure-Channel': channelid,
        },
        data: queryString.stringify(dto),
      });

      if (res.status !== 201) {
        throw new Error();
      }

      return res.data;
    } catch (error: any) {
      throw error?.response?.data;
    }
  };

  snsAddUser = async (dto: AbcSnsAddUserDto): Promise<any> => {
    try {
      const res = await axios.request({
        url: memberBaseURL + '/user-management/join',
        method: 'post',
        // adapter: fetchAdapter,
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        data: queryString.stringify(dto),
      });
      console.log('=== snsAdduser ===>', res.data);
      if (res.status !== 201) {
        throw new Error();
      }
      console.log('=== snsAdduser ===>', res.data);
      return res.data;
    } catch (error: any) {
      throw error?.response?.data;
    }
  };

  getUser = async (dto: { email: string }): Promise<any> => {
    try {
      const { email } = dto;

      const res = await axios.request({
        url:
          memberBaseURL + `/user-management/users/${email}?serviceid=${process.env.ABC_SERVICE_ID}`,
        method: 'get',
        // adapter: fetchAdapter,
      });

      if (res.status !== 200) {
        throw new Error();
      }

      return res.data;
    } catch (error: any) {
      throw error?.response?.data;
    }
  };

  sendEmailAuthCode = async (dto: AbcSendEmailAuthCodeDto): Promise<any> => {
    try {
      const { email, lang } = dto;

      const res = await axios.request({
        url:
          memberBaseURL +
          `/mail-service/${email}/sendcode?serviceid=${process.env.ABC_SERVICE_ID}&lang=${lang}`,
        method: 'get',
        // adapter: fetchAdapter,
      });

      if (res.status !== 200) {
        throw new Error();
      }

      return res.data;
    } catch (error: any) {
      throw error?.response?.data;
    }
  };

  verifyEmailAuthCode = async (dto: AbcVerifyEmailAuthCodeDto): Promise<boolean> => {
    try {
      const { email, code } = dto;

      const res = await axios.request({
        url: memberBaseURL + `/mail-service/${email}/verifycode`,
        method: 'post',
        // adapter: fetchAdapter,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: queryString.stringify({ code }),
      });

      if (res.status !== 200) {
        // throw new Error();
        return false;
      }

      // return res.data;
      return true;
    } catch (error: any) {
      // throw error?.response?.data;
      return false;
    }
  };

  changePassword = async (dto: AbcChangePasswordDto, channelid: string): Promise<any> => {
    try {
      const res = await axios.request({
        url: memberBaseURL + `/user-management/users/changepassword`,
        method: 'patch',
        // adapter: fetchAdapter,
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Secure-Channel': channelid,
        },
        data: queryString.stringify(dto),
      });

      if (res.status !== 200) {
        throw new Error();
      }

      return res.data;
    } catch (error: any) {
      throw error?.response?.data;
    }
  };

  initPassword = async (dto: AbcInitPasswordDto, channelid: string): Promise<any> => {
    try {
      const res = await axios.request({
        url: memberBaseURL + `/user-management/users/initpassword`,
        method: 'patch',
        // adapter: fetchAdapter,
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Secure-Channel': channelid,
        },
        data: queryString.stringify({
          ...dto,
          serviceid: process.env.ABC_SERVICE_ID,
        }),
      });

      if (res.status !== 200) {
        throw new Error();
      }

      return res.data;
    } catch (error: any) {
      throw error?.response?.data;
    }
  };

  login = async (dto: AbcLoginDto, channelid: string): Promise<AbcLoginResult> => {
    try {
      const { username, password } = dto;
      const res = await axios.request({
        url: authBaseURL + `/auth-service/login`,
        method: 'post',
        // adapter: fetchAdapter,
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Secure-Channel': channelid,
        },
        data: queryString.stringify({
          grant_type: 'password',
          username,
          password,
          audience: process.env.ABC_SERVICE_ID,
        }),
      });

      if (res.status !== 200) {
        throw new Error();
      }

      const resData = AbcLoginResponse.parse(res.data);

      return {
        accessToken: resData.access_token,
        refreshToken: resData.refresh_token,
        tokenType: resData.token_type,
        expiresIn: resData.expire_in,
      };
    } catch (error: any) {
      // throw error?.response?.data;
      return error?.response?.data;
    }
  };

  snsLogin = async (token: string, service: string): Promise<AbcLoginResult> => {
    try {
      const res = await axios.request({
        url: authBaseURL + `/auth-service/token/login`,
        method: 'post',
        // adapter: fetchAdapter,
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        data: queryString.stringify({
          token,
          service,
          audience: process.env.ABC_SERVICE_ID,
        }),
      });
      if (res.status !== 200) {
        throw new Error();
      }

      const resData = AbcLoginResponse.parse(res.data);
      return {
        accessToken: resData.access_token,
        refreshToken: resData.refresh_token,
        tokenType: resData.token_type,
        expiresIn: resData.expire_in,
      };
    } catch (error: any) {
      throw error?.response?.data;
    }
  };

  createSecureChannel = async (dto: { pubkey: string; plain: string }) => {
    try {
      const { pubkey, plain } = dto;

      const res = await axios.request({
        url: `https://${env.ABC_SERVER_ADDRESS}/secure/channel/create`,
        method: 'post',
        // adapter: fetchAdapter,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: queryString.stringify({
          pubkey,
          plain,
        }),
      });

      if (res.status !== 200) {
        throw new Error();
      }

      return AbcCreateSecureChannelResponse.parse(res.data);
    } catch (error: any) {
      throw error?.response?.data;
    }
  };

  searchBlacklist = async (dto: AbcSearchBlacklistDto, abcToken: string) => {
    try {
      const res = await abcAdminApiClient.request({
        url: `https://${env.ABC_SERVER_ADDRESS}/query/v1/filter/address`,
        method: 'post',
        // adapter: fetchAdapter,
        headers: {
          'content-type': 'application/json',
        },
        data: dto,
      });

      if (res.status !== 200) {
        throw new Error();
      }

      return AbcSearchBlacklistResopnse.parse(res.data);
    } catch (error: any) {
      throw error?.response?.data;
    }
  };

  searchBlackDomain = async (dto: AbcSearchBlackDomainDto) => {
    try {
      const res = await abcAdminApiClient.request({
        url: `https://${env.ABC_SERVER_ADDRESS}/query/v1/filter/domain`,
        method: 'post',
        // adapter: fetchAdapter,
        headers: {
          'content-type': 'application/json',
        },
        data: dto,
      });

      if (res.status !== 200) {
        throw new Error();
      }

      return AbcSearchBlackDomainResopnse.parse(res.data);
    } catch (error: any) {
      throw error?.response?.data;
    }
  };

  getUrgentNotice = async (service: AbcMobileService, language: AbcLanguage) => {
    try {
      const res = await abcAdminApiClient.request({
        url: `https://${env.ABC_SERVER_ADDRESS}/query/v1/urgent-notice`,
        method: 'get',
        headers: {
          'content-type': 'application/json',
        },
        params: {
          service,
          language,
        },
      });

      if (res.status !== 200) {
        throw new Error();
      }

      return AbcGetUrgentNoticeResponse.parse(res.data);
    } catch (error: any) {
      throw error?.response?.data;
    }
  };
}
