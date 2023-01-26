/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import {
  CheckPasswordDto,
  GenereateKeyDto,
  GenereateKeyResult,
  RecoverDto,
  SendCipherDto,
} from '../../main/accounts/interface';
import { MpcSignInput, MpcUnlockDto } from '../../main/transactions/interface';
import {
  InitiateShares,
  Unlock,
  Sign,
  ChangeActiveAccount,
  EmSeedRequest,
  RecoverShare,
  ClearPV,
} from '../../sandbox/worker';
import { CustomError } from '../../utils/error';
import { DekeyError } from '../../utils/errorTypes';

export const MPC_COMMANDS = {
  sign: 'sign',
  generateKeyShare: 'generateKeyShare',
  selfSign: 'selfSign',
  showMnemonic: 'showMnemonic',
  recoverSID: 'recoverSID',
  recoverShare: 'recoverShare',
  emRecover: 'emRecover',
  sendRecoveryEmail: 'sendRecoveryEmail',
  unlock: 'unlock',
  changeActiveAccount: 'changeActiveAccount',
  addAccount: 'addAccount',
  sendCipher: 'sendCipher',
  checkPassword: 'checkPassword',
  terminate: 'terminate',
};

export class MpcService {
  clearPV = async () => {
    try {
      await ClearPV();
    } catch (error) {
      throw error;
    }
  };

  generateKey = (dto: GenereateKeyDto): Promise<GenereateKeyResult> => {
    try {
      return InitiateShares(dto);
    } catch (error) {
      throw new CustomError(DekeyError.mpcKeygen(error.message));
    }
  };

  sign = (dto: MpcSignInput): any => {
    try {
      return Sign(dto);
    } catch (error) {
      console.log('=== sign error ===>', error);
      throw new CustomError(DekeyError.mpcSign(error.message));
    }
  };

  unlock = async (dto: MpcUnlockDto): Promise<any> => {
    try {
      const result = await Unlock(dto);
      return result;
    } catch (error) {
      throw new CustomError(DekeyError.mpcUnlock(error.message));
    }
  };

  selfSign = (dto): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.execute({ resolve, reject, command: MPC_COMMANDS.selfSign, dto });
    });
  };

  recoverSID = (dto): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.execute({ resolve, reject, command: MPC_COMMANDS.recoverSID, dto });
    });
  };

  recoverShare = (dto: RecoverDto): Promise<any> => {
    return RecoverShare(dto);
  };

  emRecover = (dto): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.execute({ resolve, reject, command: MPC_COMMANDS.emRecover, dto });
    });
  };

  sendCipher = (dto: SendCipherDto) => {
    return EmSeedRequest(dto);
  };

  changeActiveAccount = (dto) => {
    return ChangeActiveAccount(dto);
  };

  checkPassword = (dto: CheckPasswordDto): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.execute({ resolve, reject, command: MPC_COMMANDS.checkPassword, dto });
    });
  };

  terminate = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.execute({ resolve, reject, command: MPC_COMMANDS.terminate });
    });
  };

  execute = ({ resolve, reject, command, dto = {} }) => {
    // const iframe = document.getElementById('theFrame') as HTMLIFrameElement;
    // const messageHandler = event => {
    //   if (event.data.command !== command) return;
    //   if (event.data.result && !event.data.result.success) {
    //     reject(new Error(event.data.result.message));
    //   }
    //   resolve(event.data.result && event.data.result.data);
    //   window.removeEventListener('message', messageHandler);
    // };
    // window.addEventListener('message', messageHandler);
    // iframe.contentWindow.postMessage({command, data: dto}, '*');
  };
}
