/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import {z} from 'zod';
import {User} from './model';

/**
 * Controller dto
 */
export const RegisterDto = z.object({
  address: z.string(),
  email: z.string().email(),
  accountName: z.string(),
  pubkey: z.string(),
  ucPubkey: z.string(),
  sid: z.string(),
  uid: z.string(),
  wid: z.number(),
});
export const UnlockDto = z.object({
  r: z.string(),
  s: z.string(),
  hashMessage: z.string(),
  sid: z.string(),
  wid: z.number(),
});
export const TwofaGenVerifyDto = z.object({
  token: z.string(),
});
export const TwofaVerifyDto = z.object({
  token: z.string(),
});
export const TwofaVerifyMpcDto = z.object({
  token: z.string(),
  jsonUnsignedTx: z.string(),
});
export const TwofaResetDto = z.object({
  resetCode: z.string(),
});
export const GetChallengeMessageDto = z.object({
  sid: z.string(),
});
export const AuthGenDto = z.object({
  signType: z.string(),
  jsonMessage: z.string(),
});
export const RecoverDto = z.object({
  ucPubkey: z.string(),
});
export const UpdateAccountNameDto = z.object({
  accountId: z.number(),
  accountName: z.string(),
});
export const AddAutoconfirmDto = z.object({
  contractAddress: z.string(),
  funcName: z.string(),
  funcHash: z.string(),
  domainName: z.string(),
  chainId: z.number(),
});
export const DeleteAutoconfirmDto = z.object({
  autoConfirmId: z.string(),
});
export const AddFavoriteDto = z.object({
  chainId: z.number(),
  nickname: z.string(),
  address: z.string(),
});
export const UpdateFavoriteDto = z.object({
  nickname: z.string(),
  favoriteId: z.string(),
  address: z.string(),
  chainId: z.number(),
});

export const DeleteFavoriteDto = z.object({
  favoriteId: z.string(),
});

export type RegisterDto = z.infer<typeof RegisterDto>;
export type UnlockDto = z.infer<typeof UnlockDto>;
export type TwofaGenVerifyDto = z.infer<typeof TwofaGenVerifyDto>;
export type TwofaVerifyDto = z.infer<typeof TwofaVerifyDto>;
export type TwofaVerifyMpcDto = z.infer<typeof TwofaVerifyMpcDto>;
export type TwofaResetDto = z.infer<typeof TwofaResetDto>;
export type GetChallengeMessageDto = z.infer<typeof GetChallengeMessageDto>;
export type AuthGenDto = z.infer<typeof AuthGenDto>;
export type RecoverDto = z.infer<typeof RecoverDto>;
export type UpdateAccountNameDto = z.infer<typeof UpdateAccountNameDto>;
export type AddAutoconfirmDto = z.infer<typeof AddAutoconfirmDto>;
export type DeleteAutoconfirmDto = z.infer<typeof DeleteAutoconfirmDto>;
export type AddFavoriteDto = z.infer<typeof AddFavoriteDto>;
export type UpdateFavoriteDto = z.infer<typeof UpdateFavoriteDto>;
export type DeleteFavoriteDto = z.infer<typeof DeleteFavoriteDto>;

/**
 * Controller response
 */
export const UnlockResponse = z.object({
  accessToken: z.string(),
  expiresIn: z.string(),
});
export const TwofaGenResponse = z.object({
  qrcode: z.string(),
  secret: z.string(),
});
export const TwofaGenVerifyResponse = z.object({
  twofaResetCode: z.string(),
  user: User,
});
export const TwofaVerifyMpcResponse = z.object({
  // verified: z.boolean(),
  mpcToken: z.string(),
});
export const GetTwofaResetcodeResponse = z.object({
  twofaResetcode: z.string(),
});

/**
 * ABC Response
 */
// access_token: "eyJraWQiOiIzNSIsInR5cCI6IkpXVCIsImFsZyI6IkVTMjU2In0.eyJzdWIiOiI3MjE5NjAzMDE2Nzk3NjA1IiwiYXVkIjoiaHR0cHM6Ly9tdy5teWFiY3dhbGxldC5jb20iLCJpc3MiOiJodHRwczovL2FwaS5pZC5teWFiY3dhbGxldC5jb20vYmJlNzA4OTc4OTBmN2VhM2U0MjQwYjNjZjRhMDg3M2IiLCJqdGkiOiJhZTA5NmYyNjlkMTk0MTdhOGI5Yjk3ZTI2ZGIwOWNiZSJ9.tFUy6BiXrO_35YL_sXtfqAXfTRpXDTZyqJ_opCGrFyLXbBet0DSX83i9UFvo39saGdscUOXFvR9Lf5U2HN7Sqw"
// expire_in: 3600
// refresh_token: "eyJraWQiOiI2OCIsInR5cCI6IkpXVCIsImFsZyI6IkVTMjU2In0.eyJzdWIiOiI3MjE5NjAzMDE2Nzk3NjA1IiwiYXVkIjoiaHR0cHM6Ly9tdy5teWFiY3dhbGxldC5jb20iLCJpc3MiOiJodHRwczovL2FwaS5pZC5teWFiY3dhbGxldC5jb20vYmJlNzA4OTc4OTBmN2VhM2U0MjQwYjNjZjRhMDg3M2IiLCJqdGkiOiJhZTA5NmYyNjlkMTk0MTdhOGI5Yjk3ZTI2ZGIwOWNiZSJ9.deVtkTVwtqQCHCyTwig_glJ_K05qq_R78wCjZmO6oMgVupO0MnYYl55pDR-wi3_T7p9EdqhJUAIcHpCo-Mqocg"
// token_type: "bearer"
export const AbcLoginResponse = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  token_type: z.string(),
  expire_in: z.number(),
});

// address: "0XF4A2EFF88A408FF4C4550148151C33C93442619E"
// chain_id: 1
// description: "Plus Token's ponzi scam."
// filter_id: "401a4df0-f5a8-413f-9550-611e42dee40d"
// filter_type: 1
// filter_type_str: "BLACK"
// platform: "ethereum"

// address: "0x02e31A6132d338995e3236d2422318110540392c"
// chain_id: null
// description: null
// filter_id: null
// filter_type: 0
// filter_type_str: "UNKNOWN"
// platform: null
export const AbcSearchBlacklistResopnse = z.object({
  address: z.string().optional(),
  platform: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  chain_id: z.number().optional().nullable(),
  filter_id: z.string().optional().nullable(),
  filter_type: z.number().optional(),
  filter_type_str: z.string(),
});

// description: null
// domain: "https://app.uniswap.org"
// filter_id: null
// filter_type: 0
// filter_type_str: "UNKNOWN"
export const AbcSearchBlackDomainResopnse = z.object({
  filter_id: z.string().optional().nullable(),
  domain: z.string().optional(),
  description: z.string().optional().nullable(),
  filter_type: z.number().optional(),
  filter_type_str: z.string(),
});

export const AbcCreateSecureChannelResponse = z.object({
  channelid: z.string(),
  publickey: z.string(),
  encrypted: z.string(),
});

export const AbcGetUrgentNoticeResponse = z
  .object({
    notice_id: z.string(),
    start_time: z.string(),
    end_time: z.string(),
    title: z.string(),
    message: z.string(),
    link: z.string(),
  })
  .transform(notice => ({
    noticeId: notice.notice_id,
    startTime: notice.start_time,
    endTime: notice.end_time,
    title: notice.title,
    message: notice.message,
    link: notice.link,
  }))
  .refine(notice => {
    const currentTime = new Date().getTime();
    return (
      currentTime >= new Date(notice.startTime).getTime() &&
      currentTime <= new Date(notice.endTime).getTime()
    );
  })
  .nullable();

export type UnlockResponse = z.infer<typeof UnlockResponse>;
export type TwofaGenResponse = z.infer<typeof TwofaGenResponse>;
export type TwofaGenVerifyResponse = z.infer<typeof TwofaGenVerifyResponse>;
export type TwofaVerifyMpcResponse = z.infer<typeof TwofaVerifyMpcResponse>;
export type GetTwofaResetcodeResponse = z.infer<
  typeof GetTwofaResetcodeResponse
>;
export type AbcLoginResponse = z.infer<typeof AbcLoginResponse>;
export type AbcSearchBlacklistResopnse = z.infer<
  typeof AbcSearchBlacklistResopnse
>;
export type AbcCreateSecureChannelResponse = z.infer<
  typeof AbcCreateSecureChannelResponse
>;
export type AbcSearchBlackDomainResopnse = z.infer<
  typeof AbcSearchBlackDomainResopnse
>;

export type AbcGetUrgentNoticeResponse = z.infer<
  typeof AbcGetUrgentNoticeResponse
>;
