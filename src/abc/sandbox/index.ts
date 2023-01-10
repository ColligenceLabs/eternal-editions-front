/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import EventEmitter from 'events';
import {MPC_COMMANDS} from '../usecase/mpc';
// import UCWasm from './uc-wasm';
import {InitiateShares, Unlock, Sign} from './worker';

// const uCWasm = new UCWasm();

const keygen = dto => {
  // return execute(dto, 'generateKeyShare', MPC_COMMANDS.generateKeyShare);
  return InitiateShares(dto);
};

const unlock = dto => {
  return Unlock(dto);
};

const sign = dto => {
  return Sign(dto);
};

export {keygen, unlock, sign};

// window.addEventListener('message', event => {
//   const command = event.data.command;

//   if (command === MPC_COMMANDS.generateKeyShare) {
//     return execute(event, 'generateKeyShare', command);
//   }
//   if (command === MPC_COMMANDS.sign) {
//     return execute(event, 'sign', command);
//   }
//   if (command === MPC_COMMANDS.selfSign) {
//     return execute(event, 'selfSign', command);
//   }
//   if (command === MPC_COMMANDS.emRecover) {
//     return execute(event, 'emRecover', command);
//   }
//   if (command === MPC_COMMANDS.recoverShare) {
//     return execute(event, 'recoverShare', command);
//   }
//   if (command === MPC_COMMANDS.recoverSID) {
//     return execute(event, 'recoverSID', command);
//   }
//   if (command === MPC_COMMANDS.showMnemonic) {
//     return execute(event, 'showMnemonic', command);
//   }
//   if (command === MPC_COMMANDS.sendCipher) {
//     return execute(event, 'sendCipher', command);
//   }
//   if (command === MPC_COMMANDS.unlock) {
//     return execute(event, 'unlock', command);
//   }
//   if (command === MPC_COMMANDS.addAccount) {
//     return execute(event, 'addAccount', command);
//   }
//   if (command === MPC_COMMANDS.changeActiveAccount) {
//     return execute(event, 'changeActiveAccount', command);
//   }
//   if (command === MPC_COMMANDS.checkPassword) {
//     return execute(event, 'checkPassword', command);
//   }
//   if (command === MPC_COMMANDS.terminate) {
//     return execute(event, 'terminate', command);
//   }
// });

// const execute = (dto, fnName, command) => {
//   return new Promise((resolve, reject) => {
//     const eventObj = new EventEmitter();
//     eventObj.once('end', result => {
//       resolve({result, command});
//       // event.source.postMessage(
//       //   {
//       //     result: result,
//       //     command,
//       //   },
//       //   event.origin
//       // );
//     });

//     uCWasm[fnName](dto, eventObj);
//   });
// };
