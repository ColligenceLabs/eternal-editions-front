/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import { EventEmitter } from 'events';
import _ from 'lodash';
import { AbcRestApi } from '../../infra/rest-api/abc';
import { AbcMobileService } from '../../schema/abc';
import AbcService from '../../usecase/abc';
// import { DekeyStore } from '../../usecase/store';
import AbcUtil from '../../utils/abc';
import {
  AbcAddUserDto,
  AbcChangePasswordDto,
  AbcGetUserDto,
  AbcInitPasswordDto,
  AbcLoginDto,
  AbcLoginResult,
  AbcSearchBlackDomainDto,
  AbcSearchBlacklistDto,
  AbcSendEmailAuthCodeDto,
  AbcSnsAddUserDto,
  AbcVerifyEmailAuthCodeDto,
} from './interface';
// import { AppStore } from '../../../store/store';

import secureLocalStorage from 'react-secure-storage';

class AbcController extends EventEmitter {
  autologinTimeout: NodeJS.Timeout | undefined;

  constructor(
    private restApi: AbcRestApi,
    private abcService: AbcService // private dekeyStore: DekeyStore
  ) {
    super();
  }

  async addUser(dto: AbcAddUserDto) {
    const { encrypted, channelid } = await this.abcService.encryptSecureData(dto.password);
    return this.restApi.addUser(
      {
        ...dto,
        password: encrypted,
        serviceid: process.env.ABC_SERVICE_ID,
      },
      channelid
    );
  }

  async snsAddUser(dto: AbcSnsAddUserDto) {
    return this.restApi.snsAddUser({
      ...dto,
      joinpath: 'https://colligence.io',
      serviceid: process.env.ABC_SERVICE_ID,
    });
  }

  async getUser(dto: AbcGetUserDto) {
    try {
      const userNotExist = await this.restApi.getUser({ email: dto.email });
      if (dto.successIfUserExist) {
        return false;
      }
      return true;
    } catch (error) {
      // user exist
      if (dto.successIfUserExist) {
        return true;
      }
      return false;
    }
  }

  sendEmailAuthCode(dto: AbcSendEmailAuthCodeDto) {
    // const { currLang } = this.dekeyStore.getState();
    // const browserLang = chrome.i18n.getUILanguage();
    // const lang = AbcUtil.selectApiLanguage(currLang, browserLang);
    const lang = AbcUtil.selectApiLanguage('en', 'en');

    return this.restApi.sendEmailAuthCode({
      ...dto,
      lang,
    });
  }

  verifyEmailAuthCode(dto: AbcVerifyEmailAuthCodeDto) {
    return this.restApi.verifyEmailAuthCode(dto);
  }

  async changePassword(dto: AbcChangePasswordDto) {
    const { encrypted: oldpassword, channelid } = await this.abcService.encryptSecureData(
      dto.oldpassword
    );
    const { encrypted: newpassword } = await this.abcService.encryptSecureData(dto.oldpassword);
    return this.restApi.changePassword({ ...dto, oldpassword, newpassword }, channelid);
  }

  async initPassword(dto: AbcInitPasswordDto) {
    const { encrypted, channelid } = await this.abcService.encryptSecureData(dto.password);
    return this.restApi.initPassword({ ...dto, password: encrypted }, channelid);
  }

  async login(dto: AbcLoginDto): Promise<AbcLoginResult> {
    return await this.abcService.login(dto);
  }

  async snsLogin(token: string, service: string): Promise<AbcLoginResult> {
    return await this.abcService.snsLogin(token, service);
  }

  async searchBlacklist(dto: AbcSearchBlacklistDto) {
    try {
      // const { abcAuth } = this.dekeyStore.getState();
      // const { abcAuth } = AppStore.getState();
      // const abcAuth = JSON.parse(window.localStorage.getItem('abcAuth')!);
      const abcAuth = JSON.parse(<string>secureLocalStorage.getItem('abcAuth'));
      const result = await this.restApi.searchBlacklist(dto, abcAuth.accessToken);

      if (result?.filter_type_str === 'BLACK') {
        // @ts-ignore
        throw new Error(result.description);
      }
    } catch (error) {
      throw error;
    }
  }

  async searchBlackDomain(dto: AbcSearchBlackDomainDto) {
    try {
      const result = await this.restApi.searchBlackDomain(dto);

      if (result?.filter_type_str === 'BLACK') {
        // @ts-ignore
        throw new Error(result.description);
      }
    } catch (error) {
      throw error;
    }
  }

  async getUrgentNotice(service: AbcMobileService) {
    try {
      // const { currLang } = this.dekeyStore.getState();
      // const browserLang = chrome.i18n.getUILanguage();
      // const language = AbcUtil.selectApiLanguage(currLang, browserLang);
      const language = AbcUtil.selectApiLanguage('en', 'en');

      return this.restApi.getUrgentNotice(service, AbcUtil.convertLanguage(language));
    } catch (error) {
      throw error;
    }
  }
}

export default AbcController;
