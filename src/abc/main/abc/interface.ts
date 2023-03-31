/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

export interface AbcAddUserDto {
  username: string;
  password: string;
  code: string;
  serviceid?: string;
  overage: number;
  agree: number;
  collect: number;
  advertise: number;
  thirdparty: number;
}

export interface AbcSnsAddUserDto {
  username: string;
  code: string;
  serviceid?: string;
  joinpath: string;
  overage: number;
  agree: number;
  collect: number;
  advertise: number;
  thirdparty: number;
}

export interface AbcGetUserDto {
  email: string;
  successIfUserExist: boolean;
}

export interface AbcSendEmailAuthCodeDto {
  email: string;
  lang?: string;
}

export interface AbcVerifyEmailAuthCodeDto {
  email: string;
  code: string;
}

export interface AbcChangePasswordDto {
  username: string;
  oldpassword: string;
  newpassword: string;
}

export interface AbcInitPasswordDto {
  username: string;
  password: string;
  code: string;
}

export interface AbcLoginDto {
  grant_type: string;
  username: string;
  password: string;
  audience: string;
}

export interface AbcLoginResult {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
}

export interface AbcRefreshDto {
  refreshToken: string;
}

export interface AbcSearchBlacklistDto {
  platform?: string; // "ethereum"
  chain_id?: number; // 1
  address: string; // "0X1111"
}

export interface AbcSearchBlackDomainDto {
  domain?: string; // "uniswapv3lp.com"
}
