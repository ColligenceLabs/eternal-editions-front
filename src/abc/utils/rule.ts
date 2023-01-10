/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import _ from 'lodash';

import {TxType, TX_SOURCE} from '../main/transactions/interface';
import {AddFavoriteDto, UpdateFavoriteDto} from '../schema/account';
import {Account, Autoconfirm, Favorite} from '../schema/model';
import {CustomError} from './error';
import {DekeyError} from './errorTypes';

const getAutoconfirmRule = ({
  autoconfirms,
  to,
  funcName,
}: {
  autoconfirms: Autoconfirm[];
  to: string;
  funcName: string;
}) => {
  // TODO: use funcHash first 10 bytes
  try {
    return autoconfirms.find(
      item => item.contractAddress === to && item.funcName === funcName
    );
  } catch (error) {
    throw error;
  }
};

const getAutoConfirms = ({
  autoconfirms,
  chainId,
}: {
  autoconfirms: Autoconfirm[];
  chainId: number;
}) => {
  return autoconfirms
    .sort(
      (x, y) => new Date(y.created).getTime() - new Date(x.created).getTime()
    )
    .filter(item => item.chainId === chainId);
};

const checkAutoConfirmRuleExists = ({
  autoconfirms,
  contractAddress,
  chainId,
  data,
  account,
}: {
  contractAddress: string;
  chainId: number;
  data: string;
  autoconfirms: Autoconfirm[];
  account: Account;
}) => {
  if (!contractAddress || !data || account.signer !== 'mpc') {
    return false;
  }

  const filteredAutoconfirms = autoconfirms.filter(
    item =>
      item.funcHash.slice(0, 10) === data.slice(0, 10) &&
      item.contractAddress === contractAddress &&
      item.chainId === chainId
  );

  return !_.isEmpty(filteredAutoconfirms);
};

const bRegisterAutoconfirm = (txSource: TX_SOURCE, txType: TxType) => {
  return (
    txSource === TX_SOURCE.REGISTER_AUTOCONFIRM &&
    txType !== TxType.CANCEL &&
    txType !== TxType.RETRY
  );
};

const validateFavoriteToAdd = (
  dto: AddFavoriteDto,
  existingFavorites: Favorite[]
) => {
  const {chainId, address, nickname} = dto;

  const favoritesbyChainId = existingFavorites.filter(
    f => f.chainId === chainId
  );

  if (favoritesbyChainId.find(f => f.nickname === nickname)) {
    throw new CustomError(DekeyError.favoriteDuplicateNickname(''));
  }

  if (favoritesbyChainId.find(f => f.address === address)) {
    throw new CustomError(DekeyError.favoriteDuplicateAddress(''));
  }
};

const validateFavoriteToUpdate = (
  dto: UpdateFavoriteDto,
  existingFavorites: Favorite[]
) => {
  const {chainId, address, nickname, favoriteId} = dto;

  const selectedFavorite = existingFavorites.find(f => f.id === favoriteId);

  const favoritesbyChainId = existingFavorites.filter(
    f => f.chainId === chainId
  );

  if (
    selectedFavorite.nickname !== nickname &&
    favoritesbyChainId.find(f => f.nickname === nickname)
  ) {
    throw new CustomError(DekeyError.favoriteDuplicateNickname(''));
  }

  if (
    selectedFavorite.address !== address &&
    favoritesbyChainId.find(f => f.address === address)
  ) {
    throw new CustomError(DekeyError.favoriteDuplicateAddress(''));
  }
};

const constrainArrayMaxLength = <T>(
  data: T[],
  max: number,
  dropRight = true
) => {
  return data.length <= max
    ? data
    : dropRight
    ? _.dropRight(data, data.length - max)
    : _.drop(data, data.length - max);
};

const RuleUtil = {
  getAutoconfirmRule,
  getAutoConfirms,
  checkAutoConfirmRuleExists,
  bRegisterAutoconfirm,
  validateFavoriteToAdd,
  validateFavoriteToUpdate,
  constrainArrayMaxLength,
};

export default RuleUtil;
