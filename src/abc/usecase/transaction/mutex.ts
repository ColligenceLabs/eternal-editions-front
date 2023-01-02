/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import {singleton} from 'tsyringe';
import {Mutex} from 'await-semaphore';

export class MutexService {
  lockMap;
  txLockMap;

  constructor() {
    this.lockMap = {};
    this.txLockMap = {};
  }

  takeMutex = async lockId => {
    const mutex = this.lookupMutex(lockId);
    const releaseLock = await mutex.acquire();
    return releaseLock;
  };

  lookupMutex = lockId => {
    let mutex = this.lockMap[lockId];
    if (!mutex) {
      mutex = new Mutex();
      this.lockMap[lockId] = mutex;
    }
    return mutex;
  };

  takeTxMutex = async lockId => {
    const mutex = this.lookupTxMutex(lockId);
    const releaseLock = await mutex.acquire();
    return releaseLock;
  };

  lookupTxMutex = lockId => {
    let mutex = this.txLockMap[lockId];
    if (!mutex) {
      mutex = new Mutex();
      this.txLockMap[lockId] = mutex;
    }
    return mutex;
  };
}
