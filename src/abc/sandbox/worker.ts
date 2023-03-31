/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

// @ts-nocheck

import { MpcUnlockDto } from '../main/transactions/interface.js';
import './wasm.exec.js';
import env from '../../env';

// if ('function' === typeof importScripts) {
// const go = new Go();
// let mod, inst;
// addEventListener(
//   'message',
//   async e => {
//     if (e.data.eventType === 'init') {
//       // set hostname and port number
//       appProp1.csAddr = `${e.data.hostName}:${e.data.portNumber}`;

//       // // polyfill
//       if (!WebAssembly.instantiateStreaming) {
//         WebAssembly.instantiateStreaming = async (resp, importObject) => {
//           const source = await (await resp).arrayBuffer();
//           return await WebAssembly.instantiate(source, importObject);
//         };
//       }
//       WebAssembly.instantiateStreaming(
//         fetch('./dkeyswasm.wasm'),
//         go.importObject
//       ).then(async result => {
//         mod = result.module;
//         inst = result.instance;

//         await go.run(inst);
//       });
//     }
//   },
//   false
// );
// }

// if ('function' === typeof importScripts) {
//   // importScripts('wasm.bundle.js');
//   // require('./wasm.exec.js');

const go = new Go();
let mod, inst;

if (!WebAssembly.instantiateStreaming) {
  WebAssembly.instantiateStreaming = async (resp, importObject) => {
    const source = await (await resp).arrayBuffer();
    return await WebAssembly.instantiate(source, importObject);
  };
}
WebAssembly.instantiateStreaming(fetch('/wasm/dkeyswasm.wasm'), go.importObject).then(
  async (result) => {
    mod = result.module;
    inst = result.instance;

    await go.run(inst);
  }
);
// }

const ErrStr = 'wasmerror';

console.log('!! APP_SERVER_ADDRESS = ', env.APP_SERVER_ADDRESS);
var appPropNcloud = {
  // csAddr: process.env.APP_SERVER_ADDRESS,
  csAddr: env.APP_SERVER_ADDRESS,
  useTLS: false,
  skipInsecureTLS: true,
};
var appProp1 = appPropNcloud;

var bgStatusKG = 0;
var bgStatusSG = 0;
var bgStatusRG = 0;
var bgStatusESR = 0;
var bgStatusAG = 0;

const UCID = 1;
const CSID = 2;
const RSID = 3;

////////////////////////////////// connect to
function ConnectTo(addr, path, useTLS, skipInsecureTLS, token) {
  try {
    console.log('=== ConnectTo ===>', `${env.MPC_PROTOCOL}://` + addr + path);
    console.log('=== ConnectTo ===>', token);
    // return new WebSocket(`${process.env.MPC_PROTOCOL}://` + addr + path, token);
    return new WebSocket(`${env.MPC_PROTOCOL}://` + addr + path, token);
  } catch (err) {
    console.log('=== ConnectTo error ===>', err);
  }
}

function CheckWasm() {
  if (inst !== undefined) return true;
  return false;
}

function InitiateShares(dto) {
  if (!bgStatusKG) {
    bgStatusKG = 1;
    // var appProp = appProp1;
    return connectToCSForKG(dto, appProp1);
  }
}

function connectToCSForKG(dto, appProp): Promise<GenereateKeyResult> {
  return new Promise((resolve, reject) => {
    const { password, uid, wid, mpcToken } = dto;
    const authToken = mpcToken;
    const purposeCode = 'KG';
    let EncPV;

    const rst = {
      user_id: uid,
      wallet_id: wid,
      start_datetime: '2020-01-01T11:32:00+09:00',
      end_datetime: '2120-01-05T11:32:00+09:00',
      purpose: 'KG',
      dsa_mode: 'ECDSA',
      curve_name: 'secp256k1',
      share_mode: 1,
      wasm_enabled: true,
    };

    const csws = ConnectTo(
      appProp.csAddr,
      '/gen',
      appProp.useTLS,
      appProp.skipInsecureTLS,
      authToken
    );

    csws.addEventListener('open', function (event) {
      const sendData = {
        cmd: 'req-init-conn',
        type: 'app',
        purpose: purposeCode,
        auth_token: authToken,
      };
      csws.send(JSON.stringify(sendData));
    });

    csws.onerror = (event) => {
      csws?.close();
      rsws?.close();
      bgStatusKG = 0;
      reject(event);
    };

    let rsws: WebSocket;
    csws.onmessage = (event) => {
      try {
        let recData = JSON.parse(event.data);
        switch (recData.cmd) {
          case 'res-init-conn':
            // JobID = recData.job_id;
            break;
          case 'notify-rs-is-connected':
            // check if mpc rs address is equal to the recData addr which is sent from mpc cs server
            // if (process.env.MPC_RS_ADDRESS !== recData.addr) {
            //   throw new Error('MPC_RS_ADDRESS_MISMATCH_ERROR');
            // }
            rsws = connectToRSForKG(
              rst,
              appProp,
              recData.addr,
              recData.path,
              recData.job_id,
              csws,
              authToken,
              reject
            );
            break;

          case 'KGBC01':
            let sendDataKGBC01 = WASMKGFunction11(JSON.stringify(recData), CSID, uid, wid);
            if (sendDataKGBC01.indexOf(ErrStr) != -1) {
              throw new Error(sendDataKGBC01);
            }
            csws.send(sendDataKGBC01);
            break;

          case 'KGBC02':
            let sendDataKGBC02 = WASMKGFunction21(JSON.stringify(recData), CSID);
            if (sendDataKGBC02.indexOf(ErrStr) != -1) {
              throw new Error();
            }
            csws.send(sendDataKGBC02);
            break;

          case 'KGPS01':
            let sendDataKGPS01 = WASMKGFunction22(JSON.stringify(recData), CSID);
            if (sendDataKGPS01.indexOf(ErrStr) != -1) {
              throw new Error();
            }
            csws.send(sendDataKGPS01);
            break;

          case 'KGBC03':
            let sendDataKGBC03 = WASMKGFunction23(JSON.stringify(recData), CSID);
            if (!sendDataKGBC03 || sendDataKGBC03.indexOf(ErrStr) != -1) {
              throw new Error();
            }
            csws.send(sendDataKGBC03);
            break;

          case 'KGPS02': // CS only
            let sendDataPDLZK01 = WASMKGFunction31(JSON.stringify(recData), CSID); // return format is PDLZK01
            if (!sendDataPDLZK01 || sendDataPDLZK01.indexOf(ErrStr) != -1) {
              throw new Error();
            }
            csws.send(sendDataPDLZK01);
            break;

          case 'PDLZK02': // CS only
            let sendDataPDLZK03 = WASMKGFunction41(JSON.stringify(recData), CSID); // return format is PDLZK03
            if (!sendDataPDLZK03 || sendDataPDLZK03.indexOf(ErrStr) != -1) {
              throw new Error();
            }
            csws.send(sendDataPDLZK03);
            break;

          case 'PDLZK04': // CS only
            let sendDataKGPS03 = WASMKGFunction42(JSON.stringify(recData), CSID); // return format is PDLZK03
            if (!sendDataKGPS03 || sendDataKGPS03.indexOf(ErrStr) != -1) {
              throw new Error();
            }
            csws.send(sendDataKGPS03);
            break;

          case 'KGPS04': // CS only
            let isSuccess = WASMKGFunction51(JSON.stringify(recData), CSID); // return format is PDLZK03
            break;

          case 'DBPS01': /// dummy always ok
            let dbok = { cmd: 'DBPS01', is_ok: 1 };
            csws.send(JSON.stringify(dbok));
            break;

          case 'DBPS02': /// final MpcRequest 마지막에는 양쪽에서 보내온 mpcrequest로 대사를 진행함
            let final_res = WASMKGFunction61(password);
            let r: GenereateKeyResult = JSON.parse(final_res);

            csws.close();
            bgStatusKG = 0;
            resolve(r);

            break;

          default:
        }
      } catch (error) {
        bgStatusKG = 0;
        csws?.close();
        rsws?.close();
        reject(error);
      }
    };
  });
}

function connectToRSForKG(rst, appProp, addr, path, JobID, csws, authToken, reject) {
  let rsws = ConnectTo(addr, path, appProp.useTLS, appProp.skipInsecureTLS, authToken);
  const purposeCode = 'KG';

  rsws.addEventListener('open', function (event) {
    let sendData = {
      cmd: 'req-init-conn',
      type: 'app',
      purpose: purposeCode,
      job_id: JobID,
      auth_token: authToken,
    };
    rsws.send(JSON.stringify(sendData));
  });

  rsws.onerror = (event) => {
    csws?.close();
    rsws?.close();
    bgStatusKG = 0;
    reject(event);
  };

  rsws.onclose = (event) => {};

  rsws.onmessage = (event) => {
    let recData = JSON.parse(event.data);
    try {
      switch (recData.cmd) {
        case 'res-init-conn':
          let sendData = {
            cmd: 'notify-all-connected',
            job_id: JobID,
            init: rst,
          };
          csws.send(JSON.stringify(sendData));
          rsws.send(JSON.stringify(sendData));
          break;
        case 'notify-rs-is-connected':
          break;

        case 'KGBC01':
          let sendDataKGBC01 = WASMKGFunction11(
            JSON.stringify(recData),
            RSID,
            rst.user_id,
            rst.wallet_id
          );
          if (sendDataKGBC01.indexOf(ErrStr) != -1) {
            throw new Error();
          }
          rsws.send(sendDataKGBC01);
          break;

        case 'KGBC02':
          let sendDataKGBC02 = WASMKGFunction21(JSON.stringify(recData), RSID);
          if (sendDataKGBC02.indexOf(ErrStr) != -1) {
            throw new Error();
          }
          rsws.send(sendDataKGBC02);
          break;

        case 'KGPS01':
          let sendDataKGPS01 = WASMKGFunction22(JSON.stringify(recData), RSID);
          if (sendDataKGPS01.indexOf(ErrStr) != -1) {
            throw new Error();
          }
          rsws.send(sendDataKGPS01);
          break;

        case 'KGBC03':
          let sendDataKGBC03 = WASMKGFunction23(JSON.stringify(recData), RSID);
          if (sendDataKGBC03.indexOf(ErrStr) != -1) {
            throw new Error();
          }
          rsws.send(sendDataKGBC03);
          break;

        case 'DBPS01': /// dummy always ok
          let dbok = { cmd: 'DBPS01', is_ok: 1 };
          rsws.send(JSON.stringify(dbok));
          break;

        case 'DBPS02': /// final MpcRequest 마지막에는 양쪽에서 보내온 mpcrequest로 대사를 진행함
          rsws.close();
          break;

        default:
      }
    } catch (error) {
      csws?.close();
      rsws?.close();
      bgStatusKG = 0;
      reject(error);
    }
  };

  return rsws;
}

//////////////////////////////////// FOR SIGN

function Sign(dto) {
  return new Promise((resolve, reject) => {
    if (!bgStatusSG) {
      bgStatusSG = 1;
      connectToCSForSign(dto, appProp1, { resolve, reject });
    }
  });
}

function connectToCSForSign(dto, appProp, { resolve, reject }) {
  const authToken = 'DUMMYTOKEN';
  const purposeCode = 'SG';

  const { txHash, accountId, mpcToken } = dto;

  const csws = ConnectTo(
    appProp.csAddr,
    `/sign?hash=${txHash}`,
    appProp.useTLS,
    appProp.skipInsecureTLS,
    mpcToken
  );
  console.log('=== connectToCSForSign ===>', csws);

  csws.onerror = (event) => {
    bgStatusSG = 0;
    csws?.close();
    console.log('======= onerror ===>', event);
    reject(event);
  };

  csws.addEventListener('open', function (event) {
    const sendData = {
      cmd: 'req-init-conn',
      type: 'app',
      purpose: purposeCode,
      auth_token: authToken,
    };
    csws.send(JSON.stringify(sendData));
  });

  csws.onmessage = (event) => {
    const recData = JSON.parse(event.data);
    console.log('========= recData ==========', recData);
    try {
      switch (recData.cmd) {
        case 'res-init-conn':
          const sendDataNotifyAllConnected = WASMSGFunction01(recData.job_id, txHash, accountId);
          console.log('=== res-init-conn ===>', sendDataNotifyAllConnected);
          if (sendDataNotifyAllConnected.indexOf(ErrStr) != -1) {
            throw new Error(sendDataNotifyAllConnected);
          }

          csws.send(sendDataNotifyAllConnected);

          const sendDataSGPSVALILDENC = WASMSGSGPSVALILDENC(CSID);
          if (sendDataSGPSVALILDENC.indexOf(ErrStr) != -1) {
            throw new Error();
          }
          csws.send(sendDataSGPSVALILDENC);
          break;

        default:
      }

      if (recData.length >= 1) {
        switch (recData[0].cmd) {
          case 'SGPS01':
            const sendDataSGPS02 = WASMSGFunction02(JSON.stringify(recData), CSID);
            if (sendDataSGPS02.indexOf(ErrStr) != -1) {
              throw new Error();
            }
            csws.send(sendDataSGPS02);
            break;

          case 'SGPS03':
            const sendDataSGPS04 = WASMSGFunction03(JSON.stringify(recData), CSID);
            if (sendDataSGPS04.indexOf(ErrStr) != -1) {
              throw new Error();
            }
            csws.send(sendDataSGPS04);
            break;

          case 'SGPS05':
            const signResult = WASMSGFunction04(JSON.stringify(recData), CSID);
            if (signResult.indexOf(ErrStr) != -1) {
              throw new Error();
            }
            const otsGenResult = WASMSeedGeneration();
            if (otsGenResult.indexOf(ErrStr) != -1) {
              throw new Error();
            }

            csws?.close();
            bgStatusSG = 0;
            resolve(JSON.parse(signResult));

            break;
          default:
            throw new Error();
        }
      }
    } catch (error) {
      console.log('======== error =====>', error);
      csws?.close();
      bgStatusSG = 0;
      reject({
        success: false,
        message: error.message,
      });
    }
  };

  return [csws, authToken];
}

//////////////////////////////////// FOR Key Share Recovery

function RecoverShare(dto) {
  // if (!bgStatusRG) {
  bgStatusRG = 1;
  var appProp = appProp1;
  const { password, uid, wid, sid, mpcToken } = dto;
  return connectToCSForRG(password, appProp, uid, wid, sid, mpcToken);
  bgStatusRG = 0;
  // } else {
  // }
}

function connectToCSForRG(aessource, appProp, userID, walletID, shareID, authToken) {
  return new Promise((resolve, reject) => {
    // init rg process
    const res = WASMRGFunction00(userID, walletID, shareID);
    if (res.indexOf(ErrStr) != -1) {
      return;
    }

    // var authToken = 'DUMMYTOKEN';
    var purposeCode = 'RG';
    ///////////////////////////////////////////
    // KG MpcRequest
    var rst = {
      user_id: userID,
      wallet_id: walletID,
      share_id: shareID,
      start_datetime: '2020-01-01T11:32:00+09:00',
      end_datetime: '2120-01-05T11:32:00+09:00',
      purpose: 'RG',
      dsa_mode: 'ECDSA',
      curve_name: 'secp256k1',
      share_mode: 1,
      wasm_enabled: true,
    };

    let csws = ConnectTo(
      appProp.csAddr,
      '/gen',
      appProp.useTLS,
      appProp.skipInsecureTLS,
      authToken
    );
    let rsws;

    csws.addEventListener('open', function (event) {
      let sendData = {
        cmd: 'req-init-conn',
        type: 'app',
        purpose: purposeCode,
        auth_token: authToken,
      };
      csws.send(JSON.stringify(sendData));
    });

    csws.onmessage = (event) => {
      let recData = JSON.parse(event.data);
      let res;
      switch (recData.cmd) {
        case 'res-init-conn':
          // JobID = recData.job_id;
          break;
        case 'notify-rs-is-connected':
          rsws = connectToRSForRG(
            rst,
            appProp,
            recData.addr,
            recData.path,
            recData.job_id,
            csws,
            authToken,
            reject
          );
          break;

        case 'VALIDDBPS01':
          res = WASMRGFunction01(JSON.stringify(recData), CSID);
          if (res.indexOf(ErrStr) != -1) {
            csws.close();
            rsws.close();
            break;
          }
          break;

        case 'RGPS01':
          res = WASMRGFunction02(JSON.stringify(recData), CSID);
          if (res.indexOf(ErrStr) != -1) {
            csws.close();
            rsws.close();
            break;
          }
          const startMessage = { cmd: 'RGSTART', source: 1, message: 'READY' };
          rsws.send(JSON.stringify(startMessage));

          break;

        case 'KGPS01':
          const sendDataKGPS01 = WASMRGFunction22(JSON.stringify(recData), CSID);
          if (sendDataKGPS01.indexOf(ErrStr) != -1) {
            csws.close();
            rsws.close();
            break;
          }
          csws.send(sendDataKGPS01);
          break;

        case 'KGBC03':
          const sendDataKGBC03 = WASMRGFunction23(JSON.stringify(recData), CSID);
          if (sendDataKGBC03.indexOf(ErrStr) != -1) {
            csws.close();
            rsws.close();
            break;
          }
          csws.send(sendDataKGBC03);
          break;

        case 'KGPS02': // CS only
          const sendDataPDLZK01 = WASMRGFunction31(JSON.stringify(recData), CSID); // return format is PDLZK01
          if (sendDataPDLZK01.indexOf(ErrStr) != -1) {
            csws.close();
            rsws.close();
            break;
          }
          csws.send(sendDataPDLZK01);
          break;

        case 'PDLZK02': // CS only
          const sendDataPDLZK03 = WASMRGFunction41(JSON.stringify(recData), CSID); // return format is PDLZK03
          if (sendDataPDLZK03.indexOf(ErrStr) != -1) {
            csws.close();
            rsws.close();
            break;
          }
          csws.send(sendDataPDLZK03);
          break;

        case 'PDLZK04': // CS only
          const sendDataKGPS03 = WASMRGFunction42(JSON.stringify(recData), CSID); // return format is PDLZK03
          if (sendDataKGPS03.indexOf(ErrStr) != -1) {
            csws.close();
            rsws.close();
            break;
          }
          csws.send(sendDataKGPS03);
          break;

        case 'KGPS04': // CS only
          const isSuccess = WASMRGFunction51(JSON.stringify(recData), CSID); // return format is PDLZK03
          break;

        case 'DBPS01': /// dummy always ok
          const dbok = { cmd: 'DBPS01', is_ok: 1 };
          csws.send(JSON.stringify(dbok));
          break;

        case 'DBPS02': /// final MpcRequest 마지막에는 양쪽에서 보내온 mpcrequest로 대사를 진행함
          const final_res = WASMRGFunction61(aessource);
          const r = JSON.parse(final_res);

          csws.close();

          resolve(r);

          break;

        default:
      }
    };
  });
}

function connectToRSForRG(rst, appProp, addr, path, JobID, csws, authToken, reject) {
  let rsws = ConnectTo(addr, path, appProp.useTLS, appProp.skipInsecureTLS, authToken);
  var purposeCode = 'RG';

  rsws.addEventListener('open', function (event) {
    let sendData = {
      cmd: 'req-init-conn',
      type: 'app',
      purpose: purposeCode,
      job_id: JobID,
      auth_token: authToken,
    };
    rsws.send(JSON.stringify(sendData));
  });

  rsws.onmessage = (event) => {
    const recData = JSON.parse(event.data);
    let res;
    switch (recData.cmd) {
      case 'res-init-conn':
        const sendData = {
          cmd: 'notify-all-connected',
          job_id: JobID,
          init: rst,
        };
        csws.send(JSON.stringify(sendData));
        rsws.send(JSON.stringify(sendData));
        break;
      case 'notify-rs-is-connected':
        break;

      case 'VALIDDBPS01':
        res = WASMRGFunction01(JSON.stringify(recData), RSID);
        if (res.indexOf(ErrStr) != -1) {
          csws.close();
          rsws.close();
          break;
        }
        break;

      case 'RGPS01':
        res = WASMRGFunction02(JSON.stringify(recData), RSID);
        if (res.indexOf(ErrStr) != -1) {
          csws.close();
          rsws.close();
          break;
        }
        const startMessage = { cmd: 'RGSTART', source: 1, message: 'READY' };
        rsws.send(JSON.stringify(startMessage));
        csws.send(JSON.stringify(startMessage));

        break;

      case 'KGPS01':
        const sendDataKGPS01 = WASMRGFunction22(JSON.stringify(recData), RSID);
        if (sendDataKGPS01.indexOf(ErrStr) != -1) {
          csws.close();
          rsws.close();
          break;
        }
        rsws.send(sendDataKGPS01);
        break;

      case 'KGBC03':
        const sendDataKGBC03 = WASMRGFunction23(JSON.stringify(recData), RSID);
        if (sendDataKGBC03.indexOf(ErrStr) != -1) {
          csws.close();
          rsws.close();
          break;
        }
        rsws.send(sendDataKGBC03);
        break;

      case 'DBPS01': /// dummy always ok
        const dbok = { cmd: 'DBPS01', is_ok: 1 };
        rsws.send(JSON.stringify(dbok));
        break;

      case 'DBPS02': /// final MpcRequest 마지막에는 양쪽에서 보내온 mpcrequest로 대사를 진행함
        rsws.close();

        break;

      default:
    }
  };

  return rsws;
}

//////////////////////////////////// FOR Emergency Seed Request
function EmSeedRequest(dto) {
  return new Promise((resolve, reject) => {
    if (WASMCheckPV() == 'None') {
      return reject({
        type: 'NO_SHARE_IN_MEMORY_ERROR',
        message: 'There is no share in memory',
      });
    }
    if (!bgStatusESR) {
      bgStatusESR = 1;
      var appProp = appProp1;
      connectToCSForESR(dto, appProp, { resolve, reject });
      bgStatusESR = 0;
    }
  });
}

function connectToCSForESR(dto, appProp, { resolve, reject }) {
  const { uid, wid, accToken, mpcToken, confirmCode, password } = dto;
  const authToken = 'DUMMYTOKEN';
  const purposeCode = 'ESR';

  const csws = ConnectTo(appProp.csAddr, '/gen', appProp.useTLS, appProp.skipInsecureTLS, mpcToken);

  csws.addEventListener('open', function (event) {
    let sendData = {
      cmd: 'req-init-conn',
      type: 'app',
      purpose: purposeCode,
      auth_token: authToken,
    };
    csws.send(JSON.stringify(sendData));
  });

  csws.onmessage = (event) => {
    try {
      const recData = JSON.parse(event.data);
      switch (recData.cmd) {
        case 'res-init-conn':
          const sendDataNotifyAllConnected = WASMESRFunction01(
            recData.job_id,
            uid,
            wid,
            password,
            confirmCode
          );
          if (sendDataNotifyAllConnected.indexOf(ErrStr) != -1) {
            throw new Error(sendDataNotifyAllConnected);
          }
          csws.send(sendDataNotifyAllConnected);

          const sendDataESRPS01 = WASMESRFunction02(accToken, CSID);
          if (sendDataESRPS01.indexOf(ErrStr) != -1) {
            throw new Error(sendDataESRPS01);
          }
          csws.send(sendDataESRPS01);
          break;

        // case 'ESR2P02':
        case 'ESRPS02':
          if (recData.ok == 0) {
            throw new Error(sendDataESRPS01);
          }
          csws.close();
          resolve(recData);

        default:
          throw new Error();
      }
    } catch (error) {
      csws.close();
      reject({
        type: 'EM_SEED_REQUEEST_ERROR',
        message: error.message,
      });
    }
  };
  return csws;
}

function Unlock(dto: MpcUnlockDto) {
  return new Promise((resolve, reject) => {
    const { EncPV, password, hashMessage } = dto;
    const res = WASMUnlock(hashMessage, password, EncPV);

    if (res.indexOf(ErrStr) != -1) {
      reject({
        success: false,
        message: res,
      });
    }
    const r = JSON.parse(res);
    resolve(r);
  });
}

function ChangeActiveAccount(dto) {
  const { accountId } = dto;
  let res = WASMChangeActiveAccount(accountId);
  if (res.indexOf(ErrStr) != -1) {
    throw new Error(res);
  }
  return res;
}

function _handleError({ csws, reject, type, message }) {
  csws.close();
  reject({
    type,
    message,
  });
}

function _handleSuccess({ csws, resolve, result }) {
  csws.close();
  resolve(result);
}

// keygen, recover 호출하기 전에 항상 호출
async function ClearPV() {
  try {
    WASMClearPV();
  } catch (error) {
    throw error;
  }
}

export {
  InitiateShares,
  Unlock,
  Sign,
  ChangeActiveAccount,
  EmSeedRequest,
  RecoverShare,
  CheckWasm,
  ClearPV,
};
