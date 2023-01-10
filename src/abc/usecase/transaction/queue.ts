/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import EventEmitter from 'events';
import {AddTxInput} from '../../main/transactions/interface';

export class TxQueueService extends EventEmitter {
  queue;
  processing;

  constructor() {
    super();
    this.queue = [];
  }

  add = (data: AddTxInput) => {
    this.queue.push(data);
    this.emit('tx:added');
  };

  pickFirstItem(): AddTxInput {
    return this.queue.shift();
  }

  isEmpty() {
    return !this.queue.length;
  }
}
