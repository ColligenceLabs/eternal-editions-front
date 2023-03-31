/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import {AbcLanguage} from '../schema/abc';
import {CurrLang} from '../schema/model';

const CryptoJS = require('crypto-js');
var EC = require('elliptic').ec;

const encrypt = (secretKey: string, text: string) => {
  const key = secretKey.substring(0, 32);
  const iv = secretKey.substring(32);

  return CryptoJS.AES.encrypt(text, CryptoJS.enc.Hex.parse(key), {
    iv: CryptoJS.enc.Hex.parse(iv),
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
};

const decrypt = (secretKey: string, encrypted: string) => {
  const key = secretKey.substring(0, 32);
  const iv = secretKey.substring(32);

  const decrypt = CryptoJS.AES.decrypt(encrypted, CryptoJS.enc.Hex.parse(key), {
    iv: CryptoJS.enc.Hex.parse(iv),
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });

  return decrypt.toString(CryptoJS.enc.Utf8);
};

const createSecretKey = (publicKey: string, mykey) => {
  const ec = new EC('p256');
  const serverKey = ec.keyFromPublic(publicKey, 'hex');

  const sharedSecret = serverKey.getPublic().mul(mykey.getPrivate()).getX();
  const secretKey = sharedSecret.toString(16);
  return secretKey;
};

const convertLanguage = (lang?: string | CurrLang) => {
  if (lang === CurrLang.KO) {
    return AbcLanguage.KOR;
  }
  if (lang === CurrLang.EN) {
    return AbcLanguage.EN;
  }
  if (lang === CurrLang.JA) {
    return AbcLanguage.JA;
  }
  return AbcLanguage.EN;
};

const selectApiLanguage = (currLang: string, browserLang: string) => {
  return currLang || browserLang?.substring(0, 2)?.toLocaleLowerCase() || 'en';
};

const AbcUtil = {
  encrypt,
  decrypt,
  createSecretKey,
  convertLanguage,
  selectApiLanguage,
};

export default AbcUtil;
