/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import {Account} from '../../schema/model';

export interface RemoveLedgerAccountDto {
  id: number;
  ethAddress: string;
}

// ledgerLive', 'webhid' or 'u2f'
export enum LedgerTransportType {
  LedgerLive = 'ledgerLive',
  Webhid = 'webhid',
  U2f = 'u2f',
}

export interface GetLedgerAccountsDto {
  deviceName: string;
  page: number;
  hdPath: string;
  addedLedgerAccounts?: Account[];
}
