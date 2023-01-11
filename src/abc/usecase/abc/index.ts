/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import EventEmitter from 'events';
var EC = require('elliptic').ec;

import { AbcRestApi } from '../../infra/rest-api/abc';
import { AbcLoginDto, AbcLoginResult, AbcRefreshDto } from '../../main/abc/interface';
import AbcUtil from '../../utils/abc';
import { DekeyStore } from '../store';

class AbcService extends EventEmitter {
  mykey;
  pubkey;
  channelid;
  publickey;
  encrypted;

  // constructor(private restApi: AbcRestApi, private dekeyStore: DekeyStore) {
  constructor(private restApi: AbcRestApi) {
    super();
  }

  async login(dto: AbcLoginDto): Promise<AbcLoginResult> {
    const { encrypted, channelid } = await this.encryptSecureData(dto.password);

    console.log('----------->', dto, encrypted);
    const lResult = await this.restApi.login({ ...dto, password: encrypted }, channelid);

    // this.dekeyStore.updateStore({
    //   abcAuth: lResult,
    // });
    console.log('===>', lResult);
    return lResult;
  }

  async snsLogin(token: string, service: string): Promise<AbcLoginResult> {
    const lResult = await this.restApi.snsLogin(token, service);

    console.log('===>', lResult);
    return lResult;
  }

  async createSecureChannel() {
    const plain = 'testplaintext';
    const ec = new EC('p256');

    const mykey = ec.genKeyPair();
    const pubPoint = mykey.getPublic();
    const pubkey = pubPoint.encode('hex');

    const { channelid, encrypted, publickey } = await this.restApi.createSecureChannel({
      pubkey,
      plain,
    });

    return {
      channelid,
      encrypted,
      publickey,
      mykey,
      plain,
    };
  }

  async encryptSecureData(text: string) {
    const { channelid, encrypted, publickey, mykey, plain } = await this.createSecureChannel();

    const secretKey = AbcUtil.createSecretKey(publickey, mykey);

    const decryptedText = AbcUtil.decrypt(secretKey, encrypted);
    if (decryptedText !== plain) {
      throw new Error();
    }

    const xxx = await AbcUtil.encrypt(secretKey, text);
    console.log('===>', xxx);
    return {
      encrypted: AbcUtil.encrypt(secretKey, text),
      channelid,
    };
  }
}

export default AbcService;
