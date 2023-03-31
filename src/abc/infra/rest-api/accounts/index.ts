/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import log from 'loglevel';
import EventEmitter from 'events';

import {
  AbcAuth,
  GetChallengeMessageRes,
  GetNewSessionJwtRes,
  RegisterUserResult,
  RestAddAccountDto,
  SaveKeyGenResultDto,
  UserModel,
  VerifyRecoverServiceDto,
  VerifySelfSign,
} from '../../../main/accounts/interface';
import { apiClient, coingeckoClient } from '../../../utils/axios';
import { CustomError } from '../../../utils/error';
import { DekeyError } from '../../../utils/errorTypes';
import { MNEMONIC_IS_NOT_FROM_DEKEY_ERROR } from '../../../errorTypes';
import {
  GetChallengeMessageDto,
  GetTwofaResetcodeResponse,
  TwofaGenResponse,
  TwofaGenVerifyDto,
  TwofaGenVerifyResponse,
  TwofaResetDto,
  TwofaVerifyMpcDto,
  TwofaVerifyMpcResponse,
  UnlockDto,
  UnlockResponse,
} from '../../../schema/account';
import { AbcLoginResult } from '../../../main/abc/interface';

export class AccountRestApi extends EventEmitter {
  getNewSessionJwt = async (accessToken: string): Promise<GetNewSessionJwtRes> => {
    try {
      const res = await apiClient.post(
        '/v1/user/accessToken/regen',
        {},
        {
          headers: {
            authorization: 'Bearer ' + accessToken,
          },
        }
      );
      return res.data;
    } catch (error) {
      //log.error(error);
      throw new Error();
    }
  };

  // @ts-ignore
  registerUser = async (): Promise<RegisterUserResult> => {
    console.log('###########################');
    try {
      const res = await apiClient.post('/v1/user/register');
      if (res.status === 200 || !res.data) {
        return res.data;
      }
    } catch (error) {
      throw error;
    }
  };

  saveKeyGenResult = async (
    dto: SaveKeyGenResultDto,
    abcAuth: AbcAuth
  ): Promise<{ user: UserModel; wallet: any; accessToken: any; expiresIn: any }> => {
    try {
      const { address, pubKey, ucPubkey, accountName, uid, wid, email, iss } = dto;

      const res = await apiClient.post(
        '/v1/user/register',
        {
          ucPubkey,
          email,
          pubkey: pubKey,
          address,
          accountName,
          uid,
          wid,
          iss,
        },
        {
          headers: {
            authorization: 'Bearer ' + abcAuth.accessToken,
          },
        }
      );
      if (res.status !== 200) {
        throw new Error();
      }
      return res.data;
    } catch (error: any) {
      throw new CustomError(DekeyError.saveKeygenResult(error.message));
    }
  };

  addAccount = async (dto: RestAddAccountDto): Promise<UserModel> => {
    try {
      const { accessToken, accountId, accountName, address } = dto;
      const res = await apiClient.post(
        '/v1/address/add-child',
        { accountId, accountName, address },
        {
          headers: {
            authorization: 'Bearer ' + accessToken,
          },
        }
      );
      if (res.status !== 200 || res.data.error) {
        throw new Error(res.data.error);
      }
      return res.data.user;
    } catch (error) {
      //log.error(error);
      throw error;
    }
  };

  generateTwoFactor = async (dto: { reset: boolean }) => {
    try {
      const res = await apiClient.post('/v1/user/twofactor/gen', dto);

      return TwofaGenResponse.parse(res.data);
    } catch (error: any) {
      throw new CustomError(DekeyError.genTwofa(error.message));
    }
  };

  getTwofaResetcode = async () => {
    try {
      const res = await apiClient.post('/v1/user/twofactor/resetcode', {});

      return GetTwofaResetcodeResponse.parse(res.data);
    } catch (error: any) {
      throw new CustomError(DekeyError.getTwofaResetcode(error.message));
    }
  };

  verifyTwofactorGen = async (
    // payload: {token: string; resetTwofa?: boolean},
    dto: TwofaGenVerifyDto
  ) => {
    try {
      const res = await apiClient.post('/v1/user/twofactor/gen/verify', dto);

      return TwofaGenVerifyResponse.parse(res.data);
    } catch (error: any) {
      throw error;
    }
  };

  verifyTwoFactorResetGenVerify = async (dto: any) => {
    try {
      const res = await apiClient.post(
        '/v1/user/twofactor/reset/gen/verify',
        {
          token: dto.token,
        },
        {
          headers: {
            authorization: 'Bearer ' + dto.twofaResetAccessToken,
          },
        }
      );

      return res.data;
    } catch (error: any) {
      throw error;
    }
  };

  verifyTwofactor = async (token: string): Promise<{ verified: boolean }> => {
    try {
      const res = await apiClient.post('/v1/user/twofactor/verify', { token });

      return res.data;
    } catch (error: any) {
      throw error;
    }
  };

  verifyTwofactorForMpcSign = async (dto: TwofaVerifyMpcDto) => {
    try {
      const res = await apiClient.post('/v1/user/twofactor/verify/mpc', dto);

      return TwofaVerifyMpcResponse.parse(res.data);
    } catch (error: any) {
      throw error;
    }
  };

  resetTwofactor = async (dto: TwofaResetDto) => {
    try {
      const res = await apiClient.post('/v1/user/twofactor/reset', dto);

      return res.data;
    } catch (error: any) {
      throw error;
    }
  };

  disableTwoFactor = async (): Promise<UserModel> => {
    try {
      log.debug('disableTwoFactor');
      const res = await apiClient.post('/v1/user/twofactor/disable', {});
      log.debug('disableTwoFactor response', res.data);
      if (res.status !== 200) {
        throw new Error('');
      }
      return res.data.user;
    } catch (error: any) {
      //log.error(error);
      throw error;
    }
  };

  unlock = async (dto: UnlockDto) => {
    try {
      const res = await apiClient.post('/v1/user/unlock', dto);

      return UnlockResponse.parse(res.data);
    } catch (error: any) {
      throw new CustomError(DekeyError.unlock(error.message));
    }
  };

  verifySelfSign = async (
    dto: VerifySelfSign
  ): Promise<{ accessToken: string; expiresIn: string }> => {
    try {
      const { r, s, hashMessage, aaid } = dto;
      const res = await apiClient.post('/v1/user/self-sign/verify', {
        r,
        s,
        hashMessage,
        aaid,
      });

      if (res.status !== 200 || res.data.error) {
        throw new Error(res.data.error);
      }

      return res.data;
    } catch (error: any) {
      //log.error(error);
      throw error;
    }
  };

  getChallengeMessage = async (dto: GetChallengeMessageDto) => {
    try {
      const res = await apiClient.post('/v1/user/challenge-message', dto);

      return res.data;
    } catch (error: any) {
      throw new CustomError(DekeyError.getChallengeMessage(error.message));
    }
  };

  getUser = async (): Promise<{
    user: UserModel;
  }> => {
    try {
      const res = await apiClient.post('/v1/user/get', {});
      return res.data;
    } catch (error: any) {
      throw error;
    }
  };

  // verifyRecover = async (
  //   dto: VerifyRecoverServiceDto
  // ): Promise<{accessToken: string; mpcToken: string; expiresIn: string}> => {
  //   try {
  //     const {r, s, json} = dto;
  //     const res = await apiClient.post('/v1/user/recover/verify', {r, s, json});
  //     if (res.status !== 200) {
  //       throw new Error();
  //     }
  //     return res.data;
  //   } catch (error) {
  //     //log.error(error);
  //     throw new Error(MNEMONIC_IS_NOT_FROM_DEKEY_ERROR);
  //   }
  // };

  // getMpcJwt = async token => {
  //   try {
  //     const genRes = await apiClient.post(
  //       '/v1/address/auth/gen',
  //       {},
  //       {
  //         headers: {
  //           authorization: 'Bearer ' + token,
  //         },
  //       }
  //     );
  //     if (genRes.status !== 200) {
  //       throw new CustomError(errorTypes.GET_MPC_JWT, genRes.data.message);
  //     }
  //     return genRes.data.mpcJwt;
  //   } catch (error) {
  //     //log.error(error);
  //     throw error;
  //   }
  // };

  getUIdAndWIdWithSId = async (dto: any): Promise<{ uid: string; wid: string }> => {
    log.debug('getUIdAndWIdWithSId', dto);
    try {
      const { sid } = dto;

      const res = await apiClient.post('/v1/user/uid-wid', { sid });

      if (res.status !== 200 || res.data.error) {
        throw new Error(res.data.error);
      }

      return res.data;
    } catch (error) {
      //log.error(error);
      throw error;
    }
  };

  fetchUserAndAccessTokenWithSid = async (
    dto: any
  ): Promise<{ accessToken: string; user: UserModel; expiresIn: string }> => {
    log.debug('fetchUserAndAccessTokenWithSid', dto);
    try {
      const { sid } = dto;
      const res = await apiClient.post('/v1/user/get-with-sid', {
        sid,
      });
      if (res.status !== 200 || res.data.error) {
        throw new Error(res.data.error);
      }
      return res.data;
    } catch (error) {
      //log.error(error);
      throw error;
    }
  };

  updateAccountName = async (
    dto: any
  ): Promise<{
    user: UserModel;
  }> => {
    try {
      const res = await apiClient.post('/v1/address/account-name', dto);
      return res.data;
    } catch (error: any) {
      throw new CustomError(DekeyError.updateAccountName(error.message));
    }
  };

  // getTwoFactorEnabledInServer = async (): Promise<{
  //   twoFactorEnabled: boolean;
  // }> => {
  //   log.debug('getTwoFactorEnabledInServer');
  //   try {
  //     const res = await apiClient.post('/v1/user/twofactor-enabled', {});
  //     if (res.status !== 200) {
  //       throw new CustomError(DekeyError.APP_SERVER_GET_TWOFA_ENABLED);
  //     }
  //     return res.data;
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  getWalletsAndUserByAbcUid = async (
    abcAuth: AbcLoginResult
  ): Promise<{
    user: any;
    wallets: any;
  }> => {
    try {
      const res = await apiClient.post('/v1/user/wallets', {});
      if (res.status !== 200) {
        throw new Error();
      }
      console.log('=====', res.data);
      return res.data;
    } catch (error: any) {
      console.log(error);
      throw new CustomError(DekeyError.getWallets(error.message));
    }
  };

  recover = async (dto: any) => {
    try {
      const res = await apiClient.post('/v1/user/recover', dto);
      if (res.status !== 200) {
        throw new Error();
      }
      return res.data;
    } catch (error: any) {
      throw new CustomError(DekeyError.saveRecoverResult(error.message));
    }
  };

  coingeckoSimplePrice = async ({
    ids,
    vsCurrencies,
  }: {
    ids: string; // 'beacon,uniswap'
    vsCurrencies: string; // 'usd,krw'
  }): Promise<CoingeckoSimplePriceResponse> => {
    try {
      const res = await coingeckoClient.get(
        `/simple/price?ids=${encodeURIComponent(ids)}&vs_currencies=${encodeURIComponent(
          vsCurrencies
        )}`
      );

      return res.data;
    } catch (error) {
      throw error;
    }
  };
}

export interface CoingeckoSimplePriceResponse {
  [key: string]: { usd: number; krw: number; jpy: number };
}
