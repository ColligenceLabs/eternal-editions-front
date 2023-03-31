/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import EventEmitter from 'events';
import assert from 'assert';
import { typedSignatureHash, TYPED_MESSAGE_SCHEMA, TypedDataUtils } from 'eth-sig-util';
import { isValidAddress } from 'ethereumjs-util';
import log from 'loglevel';
import jsonschema from 'jsonschema';
import ethUtil from 'ethereumjs-util';
// @ts-ignore
import { ethErrors } from 'eth-json-rpc-errors';

import createRandomId from '../../utils/random-id';
import triggerUi from '../notification/triggerUi';
import { ACCESS_TOKEN, ACTIVE_ACCOUNT, UNAPPROVED_TYPED_MSGS } from '../db/constants';
import { MESSAGE_TYPE } from '../enums';
import { MpcService } from '../../usecase/mpc';
import { TransactionService } from '../../usecase/transaction';
import txRestApi from '../../infra/rest-api/transaction';
import { container } from 'tsyringe';
import { DekeyStore } from '../../usecase/store';
import { ProviderService } from '../../usecase/provider';
// import { LedgerService } from '../../usecase/ledger';
import { ProviderConnectionManager } from '../../usecase/provider/connectionManager';
import TransactionUtil from '../../utils/transaction';
import { Account } from '../../schema/model';

/**
 * Represents, and contains data about, an 'eth_signTypedData' type signature request. These are created when a
 * signature for an eth_signTypedData call is requested.
 *
 * @typedef {Object} TypedMessage
 * @property {number} id An id to track and identify the message object
 * @property {Object} msgParams The parameters to pass to the eth_signTypedData method once the signature request is
 * approved.
 * @property {Object} msgParams.metamaskId Added to msgParams for tracking and identification within MetaMask.
 * @property {Object} msgParams.from The address that is making the signature request.
 * @property {string} msgParams.data A hex string conversion of the raw buffer data of the signature request
 * @property {number} time The epoch time at which the this message was created
 * @property {string} status Indicates whether the signature request is 'unapproved', 'approved', 'signed', 'rejected', or 'errored'
 * @property {string} type The json-prc signing method for which a signature request has been made. A 'Message' will
 * always have a 'eth_signTypedData' type.
 *
 */

class TypedMessageManager extends EventEmitter {
  /**
   * Controller in charge of managing - storing, adding, removing, updating - TypedMessage.
   */
  messages: any;
  _getCurrentChainId: any;

  constructor(
    private mpcService: MpcService // private dekeyStore: DekeyStore, // private ledgerService: LedgerService
  ) {
    super();
    // this._getCurrentChainId = provider.web3.eth.getChainId;
    // this.memStore = new ObservableStore({
    //   unapprovedTypedMessages: {},
    //   unapprovedTypedMessagesCount: 0,
    // });
    this.messages = [];
  }

  /**
   * A getter for the number of 'unapproved' TypedMessages in this.messages
   *
   * @returns {number} The number of 'unapproved' TypedMessages in this.messages
   *
   */
  get unapprovedTypedMessagesCount() {
    return Object.keys(this.getUnapprovedMsgs()).length;
  }

  /**
   * A getter for the 'unapproved' TypedMessages in this.messages
   *
   * @returns {Object} An index of TypedMessage ids to TypedMessages, for all 'unapproved' TypedMessages in
   * this.messages
   *
   */

  async personalSign(dto: any) {
    //
  }

  getUnapprovedMsgs() {
    return this.messages
      .filter((msg: any) => msg.status === 'unapproved')
      .reduce((result: any, msg: any) => {
        result[msg.id] = msg;
        return result;
      }, {});
  }

  /**
   * Creates a new TypedMessage with an 'unapproved' status using the passed msgParams. this.addMsg is called to add
   * the new TypedMessage to this.messages, and to save the unapproved TypedMessages from that list to
   * this.memStore. Before any of this is done, msgParams are validated
   *
   * @param {Object} msgParams - The params for the eth_sign call to be made after the message is approved.
   * @param {Object} [req] - The original request object possibly containing the origin
   * @returns {promise} When the message has been signed or rejected
   *
   */
  async addUnapprovedMessageAsync(req: any, version: any) {
    const msgId = await this.addUnapprovedMessage(req, version);
    return new Promise((resolve, reject) => {
      this.once(`${msgId}:finished`, (data) => {
        log.debug(`${msgId}:finished`, data);
        switch (data.status) {
          case 'signed':
            return resolve(data.rawSig);
          // return res({
          //   id: req.id,
          //   jsonrpc: req.jsonrpc,
          //   result: data.rawSig,
          // });
          case 'rejected':
            reject(
              ethErrors.provider.userRejectedRequest(
                `Dkeys Message Signature: User denied message signature.`
              )
            );
          // return res({
          //   id: req.id,
          //   jsonrpc: req.jsonrpc,
          //   error: ,
          // });
          case 'errored':
            reject(
              ethErrors.provider.userRejectedRequest(
                `Dkeys Message Signature: Unknown problem: ${JSON.stringify(req)}`
              )
            );
          // res({
          //   id: req.id,
          //   jsonrpc: req.jsonrpc,
          //   error: ethErrors.provider.userRejectedRequest(
          //     `Dkeys Message Signature: Unknown problem: ${JSON.stringify(req)}`
          //   ),
          // });
        }
      });
    });
  }

  /**
   * Creates a new TypedMessage with an 'unapproved' status using the passed msgParams. this.addMsg is called to add
   * the new TypedMessage to this.messages, and to save the unapproved TypedMessages from that list to
   * this.memStore. Before any of this is done, msgParams are validated
   *
   * @param {Object} msgParams - The params for the eth_sign call to be made after the message is approved.
   * @param {Object} [req] - The original request object possibly containing the origin
   * @returns {number} The id of the newly created TypedMessage.
   *
   */
  async addUnapprovedMessage(req: any, version: any) {
    log.debug('addUnapprovedMessage', req);

    const msgParams = await this.getMsgParams(req, version);
    if (req) {
      msgParams.origin = req.domainName;
    }

    this.validateParams(msgParams);

    log.debug(`TypedMessageManager addUnapprovedMessage: ${JSON.stringify(msgParams)}`);

    // create txData obj with parameters and meta data
    const time = new Date().getTime();
    const msgId = createRandomId();
    const msgData = {
      id: msgId,
      msgParams,
      time,
      status: 'unapproved',
      type: MESSAGE_TYPE.ETH_SIGN_TYPED_DATA,
    };
    await this.addMsg(msgData);

    // signal update
    this.emit('update');

    triggerUi(`popup.html?id=${msgId}`);

    return msgId;
  }

  async getMsgParams(req: any, version: any) {
    // const address = await validateAndNormalizeKeyholder(req.params[0], req);
    if (version === 'V4') {
      const message = req.params[1];
      return {
        data: message,
        from: req.params[0],
        version,
      };
    }
    if (version === 'V3') {
      const message = req.params[1];
      return {
        data: message,
        from: req.params[0],
        version,
      };
    }
    if (version === 'V1') {
      const message = req.params[0];
      const extraParams = req.params[2] || {};
      return Object.assign({}, extraParams, {
        from: req.params[1],
        data: message,
        version,
      });
    }
  }

  /**
   * Helper method for this.addUnapprovedMessage. Validates that the passed params have the required properties.
   *
   * @param {Object} params - The params to validate
   *
   */
  validateParams(params: any) {
    log.debug('validateParams', params);
    assert.ok(params && typeof params === 'object', 'Params must be an object.');
    assert.ok('data' in params, 'Params must include a "data" field.');
    assert.ok('from' in params, 'Params must include a "from" field.');
    // assert.ok(
    //   typeof params.from === 'string' && isValidAddress(params.from),
    //   '"from" field must be a valid, lowercase, hexadecimal Ethereum address string.'
    // );

    switch (params.version) {
      case 'V1':
        assert.ok(Array.isArray(params.data), '"params.data" must be an array.');
        assert.doesNotThrow(() => {
          typedSignatureHash(params.data);
        }, 'Signing data must be valid EIP-712 typed data.');
        break;
      case 'V3':
      case 'V4': {
        assert.equal(typeof params.data, 'string', '"params.data" must be a string.');
        let data: any;
        assert.doesNotThrow(() => {
          data = JSON.parse(params.data);
        }, '"data" must be a valid JSON string.');
        const validation = jsonschema.validate(data, TYPED_MESSAGE_SCHEMA);
        assert.ok(
          data?.primaryType in data?.types,
          `Primary type of "${data?.primaryType}" has no type definition.`
        );
        assert.equal(
          validation.errors.length,
          0,
          'Signing data must conform to EIP-712 schema. See https://git.io/fNtcx.'
        );
        const { chainId } = data?.domain;
        // if (chainId) {
        //   const activeChainId = this.providerConnManager.chainId;
        //   assert.ok(
        //     !Number.isNaN(activeChainId),
        //     `Cannot sign messages for chainId "${chainId}", because MetaMask is switching networks.`
        //   );
        //   assert.equal(
        //     chainId,
        //     activeChainId,
        //     `Provided chainId "${chainId}" must match the active chainId "${activeChainId}"`
        //   );
        // }
        break;
      }
      default:
        assert.fail(`Unknown typed data version "${params.version}"`);
    }
  }

  /**
   * Adds a passed TypedMessage to this.messages, and calls this._saveMsgList() to save the unapproved TypedMessages from that
   * list to this.memStore.
   *
   * @param {Message} msg - The TypedMessage to add to this.messages
   *
   */
  async addMsg(msg: any) {
    // this.messages.push(msg);
    this.messages = [msg];
    await this._saveMsgList();
  }

  /**
   * Returns a specified TypedMessage.
   *
   * @param {number} msgId - The id of the TypedMessage to get
   * @returns {TypedMessage|undefined} The TypedMessage with the id that matches the passed msgId, or undefined
   * if no TypedMessage has that id.
   *
   */
  getMsg(msgId: any) {
    return this.messages.find((msg: any) => msg.id === msgId);
  }

  /**
   * Approves a TypedMessage. Sets the message status via a call to this.setMsgStatusApproved, and returns a promise
   * with any the message params modified for proper signing.
   *
   * @param {Object} msgParams - The msgParams to be used when eth_sign is called, plus data added by MetaMask.
   * @param {Object} msgParams.metamaskId Added to msgParams for tracking and identification within MetaMask.
   * @returns {Promise<object>} Promises the msgParams object with metamaskId removed.
   *
   */
  async approveMessage(msgParams: any) {
    // const { activeAccount } = this.dekeyStore.getState();
    // const activeAccount = account;

    // if (activeAccount.signer === 'ledger') {
    //   await this.ledgerService.activate({
    //     address: activeAccount.ethAddress,
    //     index: activeAccount.index,
    //     hdPath: activeAccount.hdPath,
    //     deviceName: 'ledger',
    //     accountDetail: activeAccount.accountDetail,
    //   });
    // }
    this.setMsgStatusApproved(msgParams.id);
    return await this.prepMsgForSigning(msgParams);
  }

  /**
   * Sets a TypedMessage status to 'approved' via a call to this._setMsgStatus.
   *
   * @param {number} msgId - The id of the TypedMessage to approve.
   *
   */
  setMsgStatusApproved(msgId: any) {
    this._setMsgStatus(msgId, 'approved');
  }

  /**
   * Sets a TypedMessage status to 'signed' via a call to this._setMsgStatus and updates that TypedMessage in
   * this.messages by adding the raw signature data of the signature request to the TypedMessage
   *
   * @param {number} msgId - The id of the TypedMessage to sign.
   * @param {buffer} rawSig - The raw data of the signature request
   *
   */
  setMsgStatusSigned(msgId: any, rawSig: any) {
    log.debug('setMsgStatusSigned', { msgId, rawSig });
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
    delete msgParams.version;
    return Promise.resolve(msgParams);
  }

  /**
   * Sets a TypedMessage status to 'rejected' via a call to this._setMsgStatus.
   *
   * @param {number} msgId - The id of the TypedMessage to reject.
   *
   */
  rejectMsg(msgId: any) {
    this._setMsgStatus(msgId, 'rejected');
  }

  /**
   * Sets a TypedMessage status to 'errored' via a call to this._setMsgStatus.
   *
   * @param {number} msgId - The id of the TypedMessage to error
   *
   */
  errorMessage(msgId: any, error: any) {
    const msg = this.getMsg(msgId);
    msg.error = error;
    this._updateMsg(msg);
    this._setMsgStatus(msgId, 'errored');
  }

  signTypedMessage(msgParams: any, abcAccount: Account) {
    log.debug('signTypedMessage', msgParams);
    const msgId = msgParams.id;
    // sets the status op the message to 'approved'
    // and removes the metamaskId for signing
    return this.approveMessage(msgParams)
      .then(async (cleanMsgParams: any) => {
        log.debug('cleanMsgParams', cleanMsgParams);
        // const state = this.dekeyStore.getState();
        // const account = state[ACTIVE_ACCOUNT];
        const account = abcAccount;
        if (cleanMsgParams.msgParams.from.toLowerCase() !== account.ethAddress.toLowerCase()) {
          log.debug('address is not equal');
          return;
        }

        let message = cleanMsgParams.msgParams.data;

        // let hash = message;
        let hashToSign: any;
        let mpcToken: any;

        if (cleanMsgParams.msgParams.version === 'V1') {
          const hashBuffer: any = typedSignatureHash(message);
          hashToSign = ethUtil.bufferToHex(hashBuffer);
          mpcToken = await txRestApi.getMpcJwt({
            signType: 'eth_signTypedData',
            message: JSON.stringify(message),
          });
        } else if (cleanMsgParams.msgParams.version === 'V3') {
          hashToSign = ethUtil.bufferToHex(TypedDataUtils.sign(JSON.parse(message), false));
          mpcToken = await txRestApi.getMpcJwt({
            signType: 'eth_signTypedData_v3',
            message,
          });
        } else if (cleanMsgParams.msgParams.version === 'V4') {
          hashToSign = ethUtil.bufferToHex(TypedDataUtils.sign(JSON.parse(message)));
          mpcToken = await txRestApi.getMpcJwt({
            signType: 'eth_signTypedData_v4',
            message,
          });
        }

        if (account.signer === 'mpc') {
          const { r, s, vsource } = await this.mpcService.sign({
            accountId: account.id,
            mpcToken,
            txHash: hashToSign!,
          });
          const cResult = TransactionUtil.concatSig(vsource, r, s);
          const serialized = ethUtil.bufferToHex(cResult as any);
          return serialized;
        }
        // if (account.signer === 'ledger') {
        //   // const signature = await ledger.ethLedger.signTypedData(
        //   //   account.ethAddress,
        //   //   message
        //   // );
        //   return 'signature';
        // }
        // // if (account.signer === 'ledger') {
        // //   throw new Error('Not supported on this device');
        // // }
      })
      .then((rawSig) => {
        this.setMsgStatusSigned(msgId, rawSig);
      })
      .catch((err) => {
        //log.error(err);
        this.errorMessage(msgId, err);
      });
  }

  //
  // PRIVATE METHODS
  //

  /**
   * Updates the status of a TypedMessage in this.messages via a call to this._updateMsg
   *
   * @private
   * @param {number} msgId - The id of the TypedMessage to update.
   * @param {string} status - The new status of the TypedMessage.
   * @throws A 'TypedMessageManager - TypedMessage not found for id: "${msgId}".' if there is no TypedMessage
   * in this.messages with an id equal to the passed msgId
   * @fires An event with a name equal to `${msgId}:${status}`. The TypedMessage is also fired.
   * @fires If status is 'rejected' or 'signed', an event with a name equal to `${msgId}:finished` is fired along
   * with the TypedMessage
   *
   */
  _setMsgStatus(msgId: any, status: any) {
    log.info('_setMsgStatus', { msgId, status });
    log.debug('_setMsgStatus', { msgId, status });
    const msg = this.getMsg(msgId);
    if (!msg) {
      throw new Error(`TypedMessageManager - Message not found for id: "${msgId}".`);
    }
    msg.status = status;
    this._updateMsg(msg);
    this.emit(`${msgId}:${status}`, msg);
    if (status === 'rejected' || status === 'signed' || status === 'errored') {
      this.emit(`${msgId}:finished`, msg);
    }
  }

  /**
   * Sets a TypedMessage in this.messages to the passed TypedMessage if the ids are equal. Then saves the
   * unapprovedTypedMsgs index to storage via this._saveMsgList
   *
   * @private
   * @param {msg} TypedMessage - A TypedMessage that will replace an existing TypedMessage (with the same
   * id) in this.messages
   *
   */
  _updateMsg(msg: any) {
    log.info('_updateMsg', msg);
    const index = this.messages.findIndex((message: any) => message.id === msg.id);
    if (index !== -1) {
      this.messages[index] = msg;
    }
    log.info('messages', this.messages);
    this._saveMsgList();
  }

  /**
   * Saves the unapproved TypedMessages, and their count, to this.memStore
   *
   * @private
   * @fires 'updateBadge'
   *
   */
  async _saveMsgList() {
    const unapprovedTypedMessages = this.getUnapprovedMsgs();
    log.info('_saveMsgList', unapprovedTypedMessages);
    const unapprovedTypedMessagesCount = Object.keys(unapprovedTypedMessages).length;
    // await localDB.set(UNAPPROVED_TYPED_MSGS, unapprovedTypedMessages);
    // this.dekeyStore.updateStore({
    //   // [UNAPPROVED_TYPED_MSGS]: unapprovedTypedMessages,
    //   unapproveddMsgs: unapprovedTypedMessages,
    // });
    // this.memStore.updateState({
    //   unapprovedTypedMessages,
    //   unapprovedTypedMessagesCount,
    // });
    this.emit('updateBadge');
  }
}

export default TypedMessageManager;
