/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import _ from 'lodash';

import ComposableObservableStore from '../../background/ComposableObservableStore';
import browserUtil from '../../utils/browser';
import {AppModel} from '../../main/accounts/interface';

export class DekeyStore {
  store: any;

  constructor() {}

  initializeStore(initState: any) {
    this.store = new ComposableObservableStore(initState);
  }

  getState(): AppModel {
    return this.store.getState();
  }

  updateStore(change: Partial<AppModel>) {
    const currentState: AppModel = this.store.getState();
    const newState = _.cloneDeep(currentState);
    // delete newState.accessToken;
    if (newState.user) {
      delete newState.user.EncPV;
    }
    const value = {...newState, ...change};

    browserUtil.updateRedux('SET_ALL_DB_STATE', {value: value});
    this.store.updateState(change);
  }

  pushToArray(
    key: keyof AppModel,
    item: any,
    filter = defaultPushToArrayFilter
  ) {
    const state = this.getState();
    const existingList = state[key] ?? [];

    let result;
    if (existingList.length >= MAX_ITEMS[key]) {
      const filteredList = filter(existingList);
      result = [...filteredList, {...item}];
    } else {
      result = [...existingList, {...item}];
    }

    this.updateStore({[key]: result});
  }

  updateItem(key: keyof AppModel, update: any, filter: any) {
    const state = this.getState();
    const existingList = state[key] ?? [];

    const result = existingList.map(item => {
      if (filter(item)) {
        return {
          ...item,
          ...update(item),
        };
      }
      return item;
    });

    this.updateStore({[key]: result});

    return result;
  }

  addError({name, message}) {
    this.pushToArray('errors', {
      name,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}

function defaultPushToArrayFilter(existingList) {
  return existingList.slice(0, 1);
}

const MAX_ITEMS: {[key in keyof AppModel]: number} = {
  errors: 100,
  pendingTxs: 200,
  tokenTxs: 200,
  esTxs: 200,
  connectedDomains: 100,
  networks: 50,
  // unapprovedPersonalMsgs: 20,
  // unapprovedTypedMsgs: 20,
};
