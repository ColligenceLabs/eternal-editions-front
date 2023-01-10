/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import _ from 'lodash';
import {v4 as uuidv4} from 'uuid';
import {ConnectedDomainModel} from '../main/transactions/interface';
import {Account} from '../schema/model';

const createConnectedDomain = ({
  connectedDomains,
  aaid,
  domainName,
  iconUrl,
}: {
  connectedDomains: ConnectedDomainModel[];
  domainName: string;
  aaid: number;
  iconUrl: string;
}) => {
  if (
    !_.isEmpty(connectedDomains) &&
    connectedDomains.find(elem => elem.domainName === domainName)
  ) {
    throw new Error();
  }

  return {
    id: uuidv4(),
    accountIds: [aaid],
    aaid,
    domainName,
    iconUrl,
  };
};

const addAccountToConnectedDomain = ({
  connectedDomains,
  domainName,
  aaid,
}: {
  connectedDomains: ConnectedDomainModel[];
  domainName: string;
  aaid: number;
}) => {
  const found = connectedDomains.find(d => d.domainName === domainName);

  if (!found) {
    throw new Error();
  }

  return connectedDomains.map(d => {
    if (d.domainName !== domainName) {
      return d;
    }
    return {
      ...d,
      accountIds: [...d.accountIds, aaid],
      aaid,
    };
  });
};

const isDappConnected = ({
  connectedDomains,
  domainName,
  accountId,
}: {
  connectedDomains: ConnectedDomainModel[];
  domainName: string;
  accountId: number;
}) => {
  if (_.isEmpty(connectedDomains)) {
    return false;
  }
  const connectedDomain = connectedDomains.find(
    d => d.domainName === domainName
  );
  if (!connectedDomain) {
    return false;
  }

  return connectedDomain.aaid === accountId;
};

// const disconnectDapp = ({
//   connectedDomains,
//   domainName,
//   accountId,
// }: {
//   connectedDomains: ConnectedDomainModel[];
//   domainName: string;
//   accountId: number;
// }) => {
//   return connectedDomains
//     .map(elem => {
//       if (elem.domainName !== domainName) {
//         return elem;
//       }
//       const fAccountIds = elem.accountIds.filter(id => id !== accountId);
//       return {
//         ...elem,
//         accountIds: fAccountIds,
//         aaid: accountId === elem.aaid ? fAccountIds[0] : elem.aaid,
//       };
//     })
//     .filter(elem => elem.accountIds.length > 0);
// };

const getAccountsForConnectedDapp = ({
  connectedDomains,
  domainName,
  accounts,
}: {
  connectedDomains: ConnectedDomainModel[];
  domainName: string;
  accounts: Account[];
}) => {
  let result = [];
  if (!_.isEmpty(connectedDomains)) {
    const found = connectedDomains.find(elem => elem.domainName === domainName);
    if (found) {
      const account = accounts.find(a => a.id === found.aaid);
      if (account) {
        result = [account.ethAddress.toLowerCase()];
      }
    }
  }
  return result;
};

const getNumberOfConnectedDappOfActiveAccount = (
  activeAccount: Account,
  connectedDomains: ConnectedDomainModel[]
) => {
  const aaid = activeAccount.id;
  return connectedDomains.reduce((prev, item) => {
    if (item?.accountIds?.indexOf(aaid) !== -1) {
      return prev + 1;
    }
    return prev;
  }, 0);
};

const DappUtil = {
  isDappConnected,
  addAccountToConnectedDomain,
  createConnectedDomain,
  // disconnectDapp,
  getAccountsForConnectedDapp,
  getNumberOfConnectedDappOfActiveAccount,
};

export default DappUtil;
