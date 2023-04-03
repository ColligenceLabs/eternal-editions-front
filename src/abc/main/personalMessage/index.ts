/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import EventEmitter from 'events';
import ethUtil from 'ethereumjs-util';
import log from 'loglevel';
const sigUtil = require('eth-sig-util');

import createId from '../../utils/random-id';
import { MESSAGE_TYPE } from '../enums';
import triggerUi from '../notification/triggerUi';
import {
  ACCESS_TOKEN,
  ACTIVE_ACCOUNT,
  CURRENT_NETWORK,
  UNAPPROVED_PERSONAL_MSGS,
} from '../db/constants';
import { MpcService } from '../../usecase/mpc';
import { TransactionService } from '../../usecase/transaction';
import txRestApi from '../../infra/rest-api/transaction';
import { container } from 'tsyringe';
import { DekeyStore } from '../../usecase/store';
// import {LedgerService} from '../../usecase/ledger';
import { ethErrors } from 'eth-rpc-errors';
import { ProviderConnectionManager } from '../../usecase/provider/connectionManager';
import { isKlaytn } from '../../utils/network';
import TransactionUtil from '../../utils/transaction';
import { DekeyData } from '../../dekeyData';
import { Account } from '../../schema/model';
import { AppAccount } from '../transactions/interface';
import env from '../../../env';

const hexRe = /^[0-9A-Fa-f]+$/gu;

class PersonalMessageManager extends EventEmitter {
  messages: any;

  /**
   * Controller in charge of managing - storing, adding, removing, updating - PersonalMessage.
   *
   * @typedef {Object} PersonalMessageManager
   * @property {Object} memStore The observable store where PersonalMessage are saved.
   * @property {Object} memStore.unapprovedPersonalMsgs A collection of all PersonalMessages in the 'unapproved' state
   * @property {number} memStore.unapprovedPersonalMsgCount The count of all PersonalMessages in this.memStore.unapprobedMsgs
   * @property {Array} messages Holds all messages that have been created by this PersonalMessageManager
   *
   */
  constructor(
    private mpcService: MpcService,
    // private dekeyStore: DekeyStore,
    private providerConnectionManager: ProviderConnectionManager
  ) {
    super();
    // this.memStore = new ObservableStore({
    //   unapprovedPersonalMsgs: {},
    //   unapprovedPersonalMsgCount: 0,
    // });
    this.messages = [];
  }

  /**
   * A getter for the number of 'unapproved' PersonalMessages in this.messages
   *
   * @returns {number} The number of 'unapproved' PersonalMessages in this.messages
   *
   */
  get unapprovedPersonalMsgCount() {
    return Object.keys(this.getUnapprovedMsgs()).length;
  }

  /**
   * A getter for the 'unapproved' PersonalMessages in this.messages
   *
   * @returns {Object} An index of PersonalMessage ids to PersonalMessages, for all 'unapproved' PersonalMessages in
   * this.messages
   *
   */
  getUnapprovedMsgs() {
    log.debug('getUnapprovedMsgs', this.messages);
    return this.messages
      .filter((msg: any) => msg.status === 'unapproved')
      .reduce((result: any, msg: any) => {
        result[msg.id] = msg;
        return result;
      }, {});
  }

  /**
   * Creates a new PersonalMessage with an 'unapproved' status using the passed msgParams. this.addMsg is called to add
   * the new PersonalMessage to this.messages, and to save the unapproved PersonalMessages from that list to
   * this.memStore.
   *
   * @param {Object} msgParams - The params for the eth_sign call to be made after the message is approved.
   * @param {Object} [req] - The original request object possibly containing the origin
   * @param {Object} abcAccount - ABC App Account
   * @returns {promise} When the message has been signed or rejected
   *
   */
  addUnapprovedMessageAsync(req: any, res: any, abcAccount: AppAccount) {
    log.debug('addUnapprovedMessageAsync req', req);
    return new Promise(async (resolve: any, reject: any) => {
      // if (!msgParams.from) {
      //   reject(
      //     new Error('MetaMask Message Signature: from field is required.')
      //   );
      //   return;
      // }
      // const state = this.dekeyStore.getState();
      // const account = state[ACTIVE_ACCOUNT];
      const account = abcAccount;

      if (req.method === 'personal_sign') {
        if (req.params[1].toLowerCase() !== account.ethAddress.toLowerCase()) {
          reject(
            ethErrors.provider.userRejectedRequest('Dekey Message Signature: Address mismatch.')
          );
          return;
        }
      } else {
        // eth_sign or klay_sign
        if (req.params[0].toLowerCase() !== account.ethAddress.toLowerCase()) {
          reject(
            ethErrors.provider.userRejectedRequest('Dekey Message Signature: Address mismatch.')
          );
          return;
        }
      }

      // if (account.signer === 'ledger') {
      //   await this.ledgerService.activate({
      //     address: account.ethAddress,
      //     index: account.index,
      //     hdPath: account.hdPath,
      //     deviceName: 'ledger',
      //     accountDetail: account.accountDetail,
      //   });
      // }

      const msgId = await this.addUnapprovedMessage(req);
      log.debug('msgId', msgId);
      this.once(`${msgId}:finished`, (data) => {
        log.debug(`${msgId}:finished`, data);
        switch (data.status) {
          case 'signed':
            resolve(data.rawSig);

          case 'rejected':
            reject(
              ethErrors.provider.userRejectedRequest(
                'Dekey Message Signature: User denied message signature.'
              )
            );
            return;
          default:
            reject(new Error(`Dekey Message Signature: Unknown problem`));
        }
      });
    });
  }

  /**
   * Creates a new PersonalMessage with an 'unapproved' status using the passed msgParams. this.addMsg is called to add
   * the new PersonalMessage to this.messages, and to save the unapproved PersonalMessages from that list to
   * this.memStore.
   *
   * @param {Object} msgParams - The params for the eth_sign call to be made after the message is approved.
   * @param {Object} [req] - The original request object possibly containing the origin
   * @returns {number} The id of the newly created PersonalMessage.
   *
   */
  async addUnapprovedMessage(req: any) {
    const msgParams = this.getMsgParams(req);
    // add origin from request
    if (req) {
      msgParams.origin = req.domainName;
    }
    msgParams.data = this.normalizeMsgData(msgParams.data);
    // create txData obj with parameters and meta data
    const time = new Date().getTime();
    const msgId = createId();
    const msgData = {
      id: msgId,
      msgParams,
      time,
      status: 'unapproved',
      type: req.method,
    };
    log.debug('msgData', msgData);
    await this.addMsg(msgData);

    // signal update
    this.emit('update');

    triggerUi(`popup.html?id=${msgId}`);

    return msgId;
  }

  getMsgParams(req: any) {
    log.debug('getMsgParams', req);
    // const address = await validateAndNormalizeKeyholder(req.params[0], req);
    if (req.method === 'personal_sign' || req.method === 'klay_sign') {
      const firstParam = req.params[0];
      const secondParam = req.params[1];
      // non-standard "extraParams" to be appended to our "msgParams" obj
      const extraParams = req.params[2] || {};

      // We initially incorrectly ordered these parameters.
      // To gracefully respect users who adopted this API early,
      // we are currently gracefully recovering from the wrong param order
      // when it is clearly identifiable.
      //
      // That means when the first param is definitely an address,
      // and the second param is definitely not, but is hex.
      let address, message;
      if (resemblesAddress(firstParam) && !resemblesAddress(secondParam)) {
        let warning = `The eth_personalSign method requires params ordered `;
        warning += `[message, address]. This was previously handled incorrectly, `;
        warning += `and has been corrected automatically. `;
        warning += `Please switch this param order for smooth behavior in the future.`;
        // res.warning = warning;

        address = firstParam;
        message = secondParam;
      } else {
        message = firstParam;
        address = secondParam;
      }
      return Object.assign({}, extraParams, {
        from: address,
        data: message,
      });
    }
    if (req.method === 'eth_sign') {
      const address = req.params[0];
      const message = req.params[1];
      const extraParams = req.params[2] || {};
      return Object.assign({}, extraParams, {
        from: address,
        data: message,
      });
    }
  }

  /**
   * Signifies a user's approval to sign a personal_sign message in queue.
   * Triggers signing, and the callback function from newUnsignedPersonalMessage.
   *
   * @param {Object} msgParams - The params of the message to sign & return to the Dapp.
   * @returns {Promise<Object>} A full state update.
   */
  signPersonalMessage(msgParams: any, abcAccount: Account, accToken: string) {
    const msgId = msgParams.id;
    // sets the status op the message to 'approved'
    // and removes the metamaskId for signing
    return this.approveMessage(msgParams)
      .then(async (cleanMsgParams) => {
        log.debug('cleanMsgParams', cleanMsgParams);
        // const state = this.dekeyStore.getState();
        // const account = state[ACTIVE_ACCOUNT];
        const account = abcAccount;
        // const accToken = state[ACCESS_TOKEN];
        // const currentNetwork = state[CURRENT_NETWORK];
        const currentNetwork =
          DekeyData.DEFAULT_NETWORKS[env.REACT_APP_TARGET_NETWORK === 137 ? 6 : 7];

        if (cleanMsgParams.msgParams.from.toLowerCase() !== account.ethAddress.toLowerCase()) {
          log.debug('address is not equal');
          return;
        }

        const message = cleanMsgParams.msgParams.data;

        if (account.signer === 'mpc' && isKlaytn(currentNetwork.chainId)) {
          const hash = this.providerConnectionManager.caver.utils.hashMessage(message);
          const mpcToken = await txRestApi.getMpcJwt({
            signType: 'klay_sign',
            message: JSON.stringify(message),
          });
          const { r, s, vsource } = await this.mpcService.sign({
            accountId: account.id,
            mpcToken,
            txHash: hash,
          });
          const cResult = TransactionUtil.concatSig(vsource, r, s);
          const serialized = ethUtil.bufferToHex(cResult as any);
          return serialized;
        }

        if (account.signer === 'mpc') {
          let hash: any = ethUtil.hashPersonalMessage(ethUtil.toBuffer(message));
          hash = ethUtil.bufferToHex(hash);
          const mpcToken = await txRestApi.getMpcJwt({
            signType: 'eth_sign',
            message: JSON.stringify(message),
          });
          const { r, s, vsource } = await this.mpcService.sign({
            accountId: account.id,
            mpcToken,
            txHash: hash as any,
          });
          const cResult = TransactionUtil.concatSig(vsource, r, s);
          const serialized = ethUtil.bufferToHex(cResult as any);
          return serialized;
        }
      })
      .then((rawSig) => {
        // tells the listener that the message has been signed
        // and can be returned to the dapp
        this.setMsgStatusSigned(msgId, rawSig);
      })
      .catch((err) => {
        //log.error(err);
      });
  }

  ledgerPrepSignPersonalMessage(msgParams: any, abcAccount: AppAccount) {
    const msgId = msgParams.id;
    // sets the status op the message to 'approved'
    // and removes the metamaskId for signing
    return this.approveMessage(msgParams).then(async (cleanMsgParams) => {
      log.debug('cleanMsgParams', cleanMsgParams);
      // const state = this.dekeyStore.getState();
      // const account = state[ACTIVE_ACCOUNT];
      const account = abcAccount;

      if (cleanMsgParams.msgParams.from.toLowerCase() !== account.ethAddress.toLowerCase()) {
        log.debug('address is not equal');
        return;
      }

      if (account.signer !== 'ledger') {
        throw new Error('Not ledger account');
      }

      const message = cleanMsgParams.msgParams.data;

      const result = {
        activateDto: {
          address: account.ethAddress,
          index: account.index,
          hdPath: account.hdPath,
          deviceName: 'ledger',
          accountDetail: account.accountDetail,
        },
        message,
        msgId,
      };

      return result;
    });
  }

  async personalRecover(req: any, res: any) {
    try {
      const message = req.params[0];
      const signature = req.params[1];
      const extraParams = req.params[2] || {};
      const msgParams = Object.assign({}, extraParams, {
        sig: signature,
        data: message,
      });
      const signerAddress = sigUtil.recoverPersonalSignature(msgParams);

      return signerAddress;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Adds a passed PersonalMessage to this.messages, and calls this._saveMsgList() to save the unapproved PersonalMessages from that
   * list to this.memStore.
   *
   * @param {Message} msg - The PersonalMessage to add to this.messages
   *
   */
  async addMsg(msg: any) {
    this.messages = [msg];
    // this.messages.push(msg);
    await this._saveMsgList();
  }

  /**
   * Returns a specified PersonalMessage.
   *
   * @param {number} msgId - The id of the PersonalMessage to get
   * @returns {PersonalMessage|undefined} The PersonalMessage with the id that matches the passed msgId, or undefined
   * if no PersonalMessage has that id.
   *
   */
  getMsg(msgId: any) {
    log.debug('getMsg', msgId);
    log.debug('messages', this.messages);
    return this.messages.find((msg: any) => msg.id === msgId);
  }

  /**
   * Approves a PersonalMessage. Sets the message status via a call to this.setMsgStatusApproved, and returns a promise
   * with any the message params modified for proper signing.
   *
   * @param {Object} msgParams - The msgParams to be used when eth_sign is called, plus data added by MetaMask.
   * @param {Object} msgParams.metamaskId Added to msgParams for tracking and identification within MetaMask.
   * @returns {Promise<object>} Promises the msgParams object with metamaskId removed.
   *
   */
  async approveMessage(msgParams: any) {
    try {
      this.setMsgStatusApproved(msgParams.id);
      return this.prepMsgForSigning(msgParams);
    } catch (error) {
      //log.error(error);
      throw error;
    }
  }

  /**
   * Sets a PersonalMessage status to 'approved' via a call to this._setMsgStatus.
   *
   * @param {number} msgId - The id of the PersonalMessage to approve.
   *
   */
  setMsgStatusApproved(msgId: any) {
    this._setMsgStatus(msgId, 'approved');
  }

  /**
   * Sets a PersonalMessage status to 'signed' via a call to this._setMsgStatus and updates that PersonalMessage in
   * this.messages by adding the raw signature data of the signature request to the PersonalMessage
   *
   * @param {number} msgId - The id of the PersonalMessage to sign.
   * @param {buffer} rawSig - The raw data of the signature request
   *
   */
  setMsgStatusSigned(msgId: any, rawSig: any) {
    const msg = this.getMsg(msgId);
    msg.rawSig = rawSig;
    this._updateMsg(msg);
    this._setMsgStatus(msgId, 'signed');
  }

  /**
   * Removes the metamaskId property from passed msgParams and returns a promise which resolves the updated msgParams
   *
   * @param {Object} msgParams - The msgParams to modify
   * @returns {Promise<object>} Promises the msgParams with the metamaskId property removed
   *
   */
  prepMsgForSigning(msgParams: any) {
    delete msgParams.id;
    return Promise.resolve(msgParams);
  }

  /**
   * Sets a PersonalMessage status to 'rejected' via a call to this._setMsgStatus.
   *
   * @param {number} msgId - The id of the PersonalMessage to reject.
   *
   */
  rejectMsg(msgId: any) {
    this._setMsgStatus(msgId, 'rejected');
  }

  /**
   * Updates the status of a PersonalMessage in this.messages via a call to this._updateMsg
   *
   * @private
   * @param {number} msgId - The id of the PersonalMessage to update.
   * @param {string} status - The new status of the PersonalMessage.
   * @throws A 'PersonalMessageManager - PersonalMessage not found for id: "${msgId}".' if there is no PersonalMessage
   * in this.messages with an id equal to the passed msgId
   * @fires An event with a name equal to `${msgId}:${status}`. The PersonalMessage is also fired.
   * @fires If status is 'rejected' or 'signed', an event with a name equal to `${msgId}:finished` is fired along
   * with the PersonalMessage
   *
   */
  _setMsgStatus(msgId: any, status: any) {
    const msg = this.getMsg(msgId);
    if (!msg) {
      throw new Error(`PersonalMessageManager - Message not found for id: "${msgId}".`);
    }
    msg.status = status;
    this._updateMsg(msg);
    this.emit(`${msgId}:${status}`, msg);
    if (status === 'rejected' || status === 'signed') {
      this.emit(`${msgId}:finished`, msg);
    }
  }

  /**
   * Sets a PersonalMessage in this.messages to the passed PersonalMessage if the ids are equal. Then saves the
   * unapprovedPersonalMsgs index to storage via this._saveMsgList
   *
   * @private
   * @param {msg} PersonalMessage - A PersonalMessage that will replace an existing PersonalMessage (with the same
   * id) in this.messages
   *
   */
  async _updateMsg(msg: any) {
    const index = this.messages.findIndex((message: any) => message.id === msg.id);
    if (index !== -1) {
      this.messages[index] = msg;
    }
    await this._saveMsgList();
  }

  /**
   * Saves the unapproved PersonalMessages, and their count, to this.memStore
   *
   * @private
   * @fires 'updateBadge'
   *
   */
  async _saveMsgList() {
    const unapprovedPersonalMsgs = this.getUnapprovedMsgs();
    log.debug('unapprovedPersonalMsgs', unapprovedPersonalMsgs);
    const unapprovedPersonalMsgCount = Object.keys(unapprovedPersonalMsgs).length;

    // await localDB.set(UNAPPROVED_PERSONAL_MSGS, unapprovedPersonalMsgs);

    // this.dekeyStore.updateStore({
    //   unapproveddMsgs: unapprovedPersonalMsgs,
    //   // [UNAPPROVED_PERSONAL_MSGS]: unapprovedPersonalMsgs,
    // });

    // this.memStore.updateState({
    //   unapprovedPersonalMsgs,
    //   unapprovedPersonalMsgCount,
    // });
    this.emit('updateBadge');
  }

  /**
   * A helper function that converts raw buffer data to a hex, or just returns the data if it is already formatted as a hex.
   *
   * @param {any} data - The buffer data to convert to a hex
   * @returns {string} A hex string conversion of the buffer data
   *
   */
  normalizeMsgData(data: any) {
    try {
      const stripped = ethUtil.stripHexPrefix(data);
      if (stripped.match(hexRe)) {
        return this._addHexPrefix(stripped);
      }
    } catch (e) {
      log.debug(`Message was not hex encoded, interpreting as utf8.`);
    }

    return ethUtil.bufferToHex(Buffer.from(data, 'utf8'));
  }

  /**
   * Prefixes a hex string with '0x' or '-0x' and returns it. Idempotent.
   *
   * @param {string} str - The string to prefix.
   * @returns {string} The prefixed string.
   */
  _addHexPrefix = (str: any) => {
    if (typeof str !== 'string' || str.match(/^-?0x/u)) {
      return str;
    }

    if (str.match(/^-?0X/u)) {
      return str.replace('0X', '0x');
    }

    if (str.startsWith('-')) {
      return str.replace('-', '-0x');
    }

    return `0x${str}`;
  };
}

export default PersonalMessageManager;

function resemblesAddress(string: any) {
  // hex prefix 2 + 20 bytes
  return string.length === 2 + 20 * 2;
}
