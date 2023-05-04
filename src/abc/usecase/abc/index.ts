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
  mykey: any;
  pubkey: any;
  channelid: any;
  publickey: any;
  encrypted: any;

  // constructor(private restApi: AbcRestApi, private dekeyStore: DekeyStore) {
  constructor(private restApi: AbcRestApi) {
    super();
  }

  async login(dto: AbcLoginDto): Promise<AbcLoginResult> {
    const { encrypted, channelid } = await this.encryptSecureData(dto.password);

    let lResult: AbcLoginResult;
    if (encrypted !== null && channelid !== null) {
      // console.log('!! abc login info : ', dto, encrypted);
      lResult = await this.restApi.login({ ...dto, password: encrypted }, channelid);

      // this.dekeyStore.updateStore({
      //   abcAuth: lResult,
      // });
      // console.log('!! login result : ', lResult);
    } else {
      // @ts-ignore
      // lResult = { code: 602 };
      lResult = { code: 999 };
    }
    return lResult;
  }

  async snsLogin(token: string, service: string): Promise<AbcLoginResult> {
    const lResult = await this.restApi.snsLogin(token, service);
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
    console.log(
      '!! Encryption Key Test ---> ',
      decryptedText,
      plain,
      decryptedText !== plain ? 'different' : 'same'
    );
    if (decryptedText != plain) {
      // throw new Error();
      return { encrypted: null, channelid: null };
    }

    return {
      encrypted: AbcUtil.encrypt(secretKey, text),
      channelid,
    };
  }
}

export default AbcService;
