/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import { z } from 'zod';

export const Wallet = z.object({
  wid: z.number(),
  uid: z.string(),
  ucPubkey: z.string(),
  created: z.string(),
});

export const UserProxy = z.object({
  sid: z.string(),
  uid: z.string(),
});

export const Account = z.object({
  id: z.number(),
  sid: z.string(),
  ethAddress: z.string(),
  pubkey: z.string(),
  icon: z.string(),
  name: z.string(),
  signer: z.string(),
});

export const Favorite = z.object({
  id: z.string(),
  chainId: z.number(),
  address: z.string(),
  nickname: z.string(),
  created: z.string(),
});

export const Autoconfirm = z.object({
  contractAddress: z.string(),
  chainId: z.number(),
  funcHash: z.string(),
  funcName: z.string(),
  domainName: z.string(),
  created: z.string(),
});

// export const User = z.object({
//   uid: z.string(),
//   wid: z.number(),
//   email: z.string(),
//   abcUid: z.string(),
//   accounts: z.array(Account),
//   favorites: z.array(Favorite),
//   autoconfirms: z.array(Autoconfirm),
//   twoFactorEnabled: z.boolean(),
//   twoFactorFreezeEndTime: z.number().optional(),
//   twoFactorResetRetryCount: z.number().optional(),
//   twoFactorRetryFreezeEndTime: z.number().optional(),
//   tempTwoFactorSecret: z.string().optional().optional(),
//   twoFactorSecret: z.string().optional(),
//   twoFAResetCode: z.string().optional(),
// });

export const User = z.object({
  uid: z.string(),
  wid: z.number(),
  email: z.string().optional(),
  abcUid: z.string().optional(),
  accounts: z.array(Account),
  favorites: z.array(Favorite),
  autoconfirms: z.array(Autoconfirm),
  twoFactorEnabled: z.boolean(),
  twoFactorFreezeEndTime: z.number().nullable().optional(),
  twoFactorResetRetryCount: z.number().nullable().optional(),
  twoFactorRetryFreezeEndTime: z.number().nullable().optional(),
  tempTwoFactorSecret: z.string().nullable().optional(),
  twoFactorSecret: z.string().nullable().optional(),
  twoFAResetCode: z.string().nullable().optional(),
});

export type Wallet = z.infer<typeof Wallet>;
export type UserProxy = z.infer<typeof UserProxy>;
export type Account = z.infer<typeof Account>;
export type Favorite = z.infer<typeof Favorite>;
export type Autoconfirm = z.infer<typeof Autoconfirm>;
export type User = z.infer<typeof User>;

export enum CurrLang {
  KO = 'ko',
  EN = 'en',
  JA = 'ja',
}
