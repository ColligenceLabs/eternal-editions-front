/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import _ from 'lodash';

// import { DekeyStore } from '../store';
import erc20RestApi from '../../infra/rest-api/erc20';
import ruleRestApi from '../../infra/rest-api/rule';
import { UserModel } from '../../main/accounts/interface';
import TransactionUtil from '../../utils/transaction';
import { AddAutoconfirmDto } from '../../schema/account';
import { DekeyData } from '../../dekeyData';
import env from '../../../env';

export class RuleService {
  // constructor(private dekeyStore: DekeyStore) {}
  constructor() {}

  async getFuncName(to: string, data: string, url: string) {
    if (!data) {
      return '';
    }
    try {
      let abi;
      if (to) {
        // const { currentNetwork } = this.dekeyStore.getState();
        const currentNetwork =
          DekeyData.DEFAULT_NETWORKS[env.REACT_APP_TARGET_NETWORK === 137 ? 6 : 7];
        abi = await erc20RestApi.getAbi(to, url, currentNetwork.chainId);
      }
      let funcName: string;
      if (abi) {
        const parsedTx = TransactionUtil.parseTransactionWithAbi(abi, data) as any;
        funcName = parsedTx.method;
      } else {
        const funcSignature = await ruleRestApi.getFuncSignature(data.slice(0, 10));
        funcName = funcSignature.split('(')[0];
      }
      if (!funcName) {
        funcName = data.slice(0, 10);
      }
      return funcName;
    } catch (error) {
      return data.slice(0, 10);
    }
  }

  async addAutoConfirm(dto: AddAutoconfirmDto): Promise<UserModel> {
    try {
      const user = await ruleRestApi.addAutoconfirm(dto);

      return user;
    } catch (error) {
      throw error;
    }
  }
}
