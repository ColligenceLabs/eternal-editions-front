/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import {utils} from 'ethers';
import {v4 as uuidv4} from 'uuid';
import abi from 'ethereumjs-abi';
import {ethErrors} from 'eth-rpc-errors';
import {
  isHexString,
  isValidAddress,
  isValidChecksumAddress,
  // addHexPrefix,
  toChecksumAddress,
  zeroAddress,
} from 'ethereumjs-util';

import {AssetModel, NetworkModel} from '../main/transactions/interface';
import {makeIcon} from './icon';
import {formatAmount} from './number';
import {addHexPrefix, isValidHexAddress} from './string';
import {Account} from '../schema/model';
import VisibleTokenList from '../assets/data/visible_token_list.json';

const TOKEN_TRANSFER_FUNCTION_SIGNATURE = '0xa9059cbb';

export const isToken = (asset: AssetModel) => {
  return asset.symbol !== 'ETH';
};

export const createAsset = ({
  // id,
  networkId,
  contractAddress,
  decimal,
  symbol,
  balance,
  address,
  tokenName = null,
  iconUrl,
}) => {
  const formattedBalance = balance ? formatAmount(+balance, 4) : null;

  return {
    id: uuidv4(),
    networkId,
    iconUrl: iconUrl || makeIcon(contractAddress),
    contractAddress: contractAddress ? utils.getAddress(contractAddress) : null,
    decimal,
    symbol,
    balance,
    formattedBalance,
    address,
    name: tokenName,
    createdAt: new Date().getTime(),
  };
};

export const showAsset = (
  assets: AssetModel[],
  assetId: string,
  foundAssetInVisibleTokenList
) => {
  return assets.map(a => {
    if (a.id === assetId) {
      return {
        ...a,
        // iconUrl: this.iconUrl ?? a.iconUrl,
        hide: false,
        ...(foundAssetInVisibleTokenList && {
          iconUrl: foundAssetInVisibleTokenList.logo,
        }),
      };
    }
    return a;
  });
};

export const generateTokenTransferData = ({
  toAddress = '0x0',
  amount = '0x0',
  sendToken,
}) => {
  if (!sendToken) {
    return undefined;
  }
  return (
    TOKEN_TRANSFER_FUNCTION_SIGNATURE +
    Array.prototype.map
      .call(
        abi.rawEncode(
          ['address', 'uint256'],
          [toAddress, addHexPrefix(amount)]
        ),
        x => `00${x.toString(16)}`.slice(-2)
      )
      .join('')
  );
};

export const validateERC20AssetParams = ({address, symbol, decimals}) => {
  if (!address || !symbol || typeof decimals === 'undefined') {
    throw ethErrors.rpc.invalidParams(
      `Must specify address, symbol, and decimals.`
    );
  }
  if (typeof symbol !== 'string') {
    throw ethErrors.rpc.invalidParams(`Invalid symbol: not a string.`);
  }
  if (!(symbol.length > 0)) {
    throw ethErrors.rpc.invalidParams(
      `Invalid symbol "${symbol}": shorter than a character.`
    );
  }
  if (!(symbol.length < 12)) {
    throw ethErrors.rpc.invalidParams(
      `Invalid symbol "${symbol}": longer than 11 characters.`
    );
  }
  const numDecimals = parseInt(decimals, 10);
  if (isNaN(numDecimals) || numDecimals > 36 || numDecimals < 0) {
    throw ethErrors.rpc.invalidParams(
      `Invalid decimals "${decimals}": must be 0 <= 36.`
    );
  }
  if (!isValidHexAddress(address, {allowNonPrefixed: false})) {
    throw ethErrors.rpc.invalidParams(`Invalid address "${address}".`);
  }
};

export const findCurrentNetworkTokens = ({
  assets,
  address,
  networkId,
}: {
  assets: AssetModel[];
  address: string;
  networkId: string;
}) => {
  const existingTokens = assets.slice(1);
  if (!existingTokens) return;

  return existingTokens.filter(
    asset =>
      asset.networkId === networkId && asset.address === address && !asset.hide
  );
};

export const findToken = ({
  assets,
  contractAddress,
  address,
  networkId,
}: {
  assets: AssetModel[];
  contractAddress: string;
  address: string;
  networkId: string;
}) => {
  const checksumAddress = utils.getAddress(contractAddress);

  return assets.find(
    a =>
      a.address === address &&
      a.contractAddress === checksumAddress &&
      a.networkId === networkId
  );
};

export const updateCurrentNetworkTokenBalances = ({
  balances,
  currentNetworkTokens,
  assets,
}: {
  balances: string[];
  currentNetworkTokens: AssetModel[];
  assets: AssetModel[];
}) => {
  const formattedBalances = balances.map((balance, i) => {
    return {
      balance: balance,
      formattedBalance: formatAmount(+balance, 4),
      assetId: currentNetworkTokens[i].id,
    };
  });

  return assets.map(a => {
    const found = formattedBalances.find(b => b.assetId === a.id);
    if (found) {
      return {
        ...a,
        balance: found.balance,
        formattedBalance: found.formattedBalance,
      };
    }
    return a;
  });
};

export const filterAssetsByNetwork = ({
  assets,
  activeAccount,
  currentNetwork,
}: {
  assets: AssetModel[];
  activeAccount: Account;
  currentNetwork: NetworkModel;
}) => {
  return assets
    .slice(1)
    .filter(
      t =>
        !t.hide &&
        t.address === activeAccount.ethAddress &&
        t.networkId === currentNetwork.id
    );
};

export const findAssetInVisibleTokenList = (
  tokens: any[],
  contractAddress: string
) => {
  const found = Object.values(tokens).reduce((acc, list) => {
    return {...acc, ...list};
  }, {})[contractAddress.toLowerCase()];

  return found;
};
