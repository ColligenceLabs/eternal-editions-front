import { BigNumber, ethers } from 'ethers';
import { mysteryBoxAbi } from '../config/abi/MysteryBox';
import { erc721Abi } from '../config/abi/ERC721Token';
import { whiteListAbi } from '../config/abi/WhiteListNFT';
import { subscriptionAbi } from '../config/abi/Subscription';
import { FAILURE, RPC_URLS, SUCCESS, targetNetwork } from '../config';
import Caver, { AbiItem } from 'caver-js';
import { evenAllocAbi } from '../config/abi/EventAllocation';
import env from '../env';
import tokenAbi from '../config/abi/ERC20Token.json';
import { collectionAbi } from '../config/abi/Collection';
import { collectionData } from '../contracts';
import getSelectedNodeUrl from './getRpcUrl';
import { airDropAbi } from '../config/abi/AirDrop';
import axios from 'axios';

const rpcUrl = RPC_URLS[targetNetwork];
const caver = new Caver(rpcUrl);

export function calculateGasMargin(value: BigNumber) {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000));
}

interface txResult {
  status: number;
  txHash: string;
  tokenId: number;
}

interface Overrides {
  value?: string | number;
  from: string | null | undefined;
  gasLimit: BigNumber;
  gasPrice?: string;
}

export async function registerItems(
  address: string,
  uris: string[],
  amounts: string[],
  account: string | undefined | null,
  library: any
): Promise<number> {
  let gasPrice;
  const isKaikas =
    library.provider.bridge !== 'https://bridge.walletconnect.org' &&
    (library.connection.url !== 'metamask' || library.connection.url === 'eip-1193:');

  console.log(isKaikas);
  let contract: any;
  if (isKaikas) {
    // @ts-ignore : In case of Klaytn Kaikas Wallet
    const caver = new Caver(window.klaytn);
    gasPrice = await caver.rpc.klay.getGasPrice();
    const boxAbi: AbiItem[] = mysteryBoxAbi as AbiItem[];
    contract = new caver.klay.Contract(boxAbi, address);
  } else {
    contract = new ethers.Contract(address, mysteryBoxAbi, library?.getSigner());
  }

  let tx;
  // gasLimit 계산
  let gasLimit;

  if (isKaikas) {
    gasLimit = await contract.methods.registerItems(uris, amounts).estimateGas({
      from: account,
    });
  } else gasLimit = await contract.estimateGas.registerItems(uris, amounts);

  // registerItems 요청
  let receipt;
  try {
    let overrides: Overrides = {
      from: account,
      gasLimit: calculateGasMargin(BigNumber.from(gasLimit)),
    };

    if (isKaikas) {
      tx = await contract.methods
        .registerItems(uris, amounts)
        .send(overrides)
        .catch(async (err: any) => {
          return FAILURE;
        });
      if (tx?.status) {
        return SUCCESS;
      } else return FAILURE;
    } else {
      // if (library._network.chainId === 8217)
      overrides = { ...overrides, gasPrice };

      tx = await contract.registerItems(uris, amounts, overrides);

      // receipt 대기
      try {
        receipt = await tx.wait();
      } catch (e) {
        return FAILURE;
      }
      if (receipt.status === 1) {
        return SUCCESS;
      } else return FAILURE;
    }
  } catch (e) {
    console.log(e);
    return FAILURE;
  }
}

export async function batchMint(
  address: string,
  uri: string,
  amount: number,
  mysteryBox: string,
  account: string | undefined | null,
  library: any
): Promise<number> {
  let gasPrice;
  const isKaikas =
    library.provider.bridge !== 'https://bridge.walletconnect.org' &&
    (library.connection.url !== 'metamask' || library.connection.url === 'eip-1193:');
  let contract: any;
  if (isKaikas) {
    // @ts-ignore : In case of Klaytn Kaikas Wallet
    const caver = new Caver(window.klaytn);
    gasPrice = await caver.rpc.klay.getGasPrice();
    const keyAbi: AbiItem[] = erc721Abi as AbiItem[];
    contract = new caver.klay.Contract(keyAbi, address);
  } else {
    contract = new ethers.Contract(address, erc721Abi, library?.getSigner());
  }
  let tx;

  // gasLimit 계산
  let gasLimit;
  if (isKaikas)
    gasLimit = await contract?.methods.safeBatchMintLight(mysteryBox, uri, amount).estimateGas({
      from: account,
    });
  else gasLimit = await contract.estimateGas.safeBatchMintLight(mysteryBox, uri, amount);

  // registerItems 요청
  let receipt;
  try {
    let overrides: Overrides = {
      from: account,
      gasLimit: calculateGasMargin(BigNumber.from(gasLimit)),
    };

    if (isKaikas) {
      tx = await contract.methods
        .safeBatchMintLight(mysteryBox, uri, amount)
        .send(overrides)
        .catch(async (err: any) => {
          return FAILURE;
        });
      if (tx?.status) {
        return SUCCESS;
      } else return FAILURE;
    } else {
      // if (library._network.chainId === 8217)
      overrides = { ...overrides, gasPrice };

      tx = await contract.safeBatchMintLight(mysteryBox, uri, amount, overrides);

      // receipt 대기
      try {
        receipt = await tx.wait();
      } catch (e) {
        return FAILURE;
      }
      if (receipt.status === 1) {
        return SUCCESS;
      } else return FAILURE;
    }
  } catch (e) {
    console.log(e);
    return FAILURE;
  }
}

export async function setHardCap(
  address: string,
  uri: string,
  amount: number,
  account: string | undefined | null,
  library: any
): Promise<number> {
  let gasPrice;
  const isKaikas =
    library.provider.bridge !== 'https://bridge.walletconnect.org' &&
    (library.connection.url !== 'metamask' || library.connection.url === 'eip-1193:');
  let contract: any;
  if (isKaikas) {
    // @ts-ignore : In case of Klaytn Kaikas Wallet
    const caver = new Caver(window.klaytn);
    gasPrice = await caver.rpc.klay.getGasPrice();
    const keyAbi: AbiItem[] = erc721Abi as AbiItem[];
    contract = new caver.klay.Contract(keyAbi, address);
  } else {
    contract = new ethers.Contract(address, erc721Abi, library?.getSigner());
  }
  let tx;

  // gasLimit 계산
  let gasLimit;
  if (isKaikas)
    gasLimit = await contract?.methods.setHardCap(amount, uri).estimateGas({
      from: account,
    });
  else gasLimit = await contract.estimateGas.setHardCap(amount, uri);

  // registerItems 요청
  let receipt;
  try {
    let overrides: Overrides = {
      from: account,
      gasLimit: calculateGasMargin(BigNumber.from(gasLimit)),
    };

    if (isKaikas) {
      tx = await contract.methods
        .setHardCap(amount, uri)
        .send(overrides)
        .catch(async (err: any) => {
          return FAILURE;
        });
      if (tx?.status) {
        return SUCCESS;
      } else return FAILURE;
    } else {
      // if (library._network.chainId === 8217)
      overrides = { ...overrides, gasPrice };

      tx = await contract.setHardCap(amount, uri, overrides);

      // receipt 대기
      try {
        receipt = await tx.wait();
      } catch (e) {
        return FAILURE;
      }
      if (receipt.status === 1) {
        return SUCCESS;
      } else return FAILURE;
    }
  } catch (e) {
    console.log(e);
    return FAILURE;
  }
}

export async function setMysteryBox(
  address: string,
  mysteryBox: string,
  account: string | undefined | null,
  library: any
): Promise<number> {
  let gasPrice;
  const isKaikas =
    library.provider.bridge !== 'https://bridge.walletconnect.org' &&
    (library.connection.url !== 'metamask' || library.connection.url === 'eip-1193:');
  let contract: any;
  if (isKaikas) {
    // @ts-ignore : In case of Klaytn Kaikas Wallet
    const caver = new Caver(window.klaytn);
    gasPrice = await caver.rpc.klay.getGasPrice();
    const keyAbi: AbiItem[] = erc721Abi as AbiItem[];
    contract = new caver.klay.Contract(keyAbi, address);
  } else {
    contract = new ethers.Contract(address, erc721Abi, library?.getSigner());
  }
  let tx;

  // gasLimit 계산
  let gasLimit;
  if (isKaikas)
    gasLimit = await contract?.methods.setMysteryBox(mysteryBox).estimateGas({
      from: account,
    });
  else gasLimit = await contract.estimateGas.setMysteryBox(mysteryBox);

  // registerItems 요청
  let receipt;
  try {
    let overrides: Overrides = {
      from: account,
      gasLimit: calculateGasMargin(BigNumber.from(gasLimit)),
    };

    if (isKaikas) {
      tx = await contract.methods
        .setMysteryBox(mysteryBox)
        .send(overrides)
        .catch(async (err: any) => {
          return FAILURE;
        });
      if (tx?.status) {
        return SUCCESS;
      } else return FAILURE;
    } else {
      // if (library._network.chainId === 8217)
      overrides = { ...overrides, gasPrice };

      tx = await contract.setMysteryBox(mysteryBox, overrides);

      // receipt 대기
      try {
        receipt = await tx.wait();
      } catch (e) {
        return FAILURE;
      }
      if (receipt.status === 1) {
        return SUCCESS;
      } else return FAILURE;
    }
  } catch (e) {
    console.log(e);
    return FAILURE;
  }
}

export async function setApproveForAll(
  address: string,
  target: string,
  account: string | undefined | null,
  library: any,
  isKaikas: boolean
): Promise<number> {
  let gasPrice;
  let contract: any;
  if (isKaikas) {
    // @ts-ignore : In case of Klaytn Kaikas Wallet
    const caver = new Caver(window.klaytn);
    gasPrice = await caver.rpc.klay.getGasPrice();
    const keyAbi: AbiItem[] = erc721Abi as AbiItem[];
    contract = new caver.klay.Contract(keyAbi, address);
  } else {
    contract = new ethers.Contract(address, erc721Abi, library?.getSigner());
  }
  let tx;

  // gasLimit 계산
  let gasLimit;
  if (isKaikas)
    gasLimit = await contract?.methods.setApprovalForAll(target, true).estimateGas({
      from: account,
    });
  else gasLimit = await contract.estimateGas.setApprovalForAll(target, true);

  // registerItems 요청
  let receipt;
  try {
    let overrides: Overrides = {
      from: account,
      gasLimit: calculateGasMargin(BigNumber.from(gasLimit)),
    };

    if (isKaikas) {
      tx = await contract.methods
        .setApprovalForAll(target, true)
        .send(overrides)
        .catch(async (err: any) => {
          return FAILURE;
        });
      if (tx?.status) {
        return SUCCESS;
      } else return FAILURE;
    } else {
      // if (library._network.chainId === 8217)
      overrides = { ...overrides, gasPrice };

      tx = await contract.setApprovalForAll(target, true, overrides);

      // receipt 대기
      try {
        receipt = await tx.wait();
      } catch (e) {
        return FAILURE;
      }
      if (receipt.status === 1) {
        return SUCCESS;
      } else return FAILURE;
    }
  } catch (e) {
    console.log(e);
    return FAILURE;
  }
}

export async function requestRandomNumber(
  address: string,
  rndFee: string,
  account: string | undefined | null,
  library: any,
  mechanism?: number | undefined
): Promise<number> {
  let gasPrice;
  const isKaikas =
    library.provider.bridge !== 'https://bridge.walletconnect.org' &&
    (library.connection.url !== 'metamask' || library.connection.url === 'eip-1193:');

  let contract: any;
  if (isKaikas) {
    // @ts-ignore : In case of Klaytn Kaikas Wallet
    const caver = new Caver(window.klaytn);
    gasPrice = await caver.rpc.klay.getGasPrice();
    const contractAbi: AbiItem[] =
      mechanism === undefined
        ? (mysteryBoxAbi as AbiItem[])
        : mechanism === 1
        ? (subscriptionAbi as AbiItem[])
        : (evenAllocAbi as AbiItem[]);
  } else {
    contract = new ethers.Contract(
      address,
      mechanism === undefined ? mysteryBoxAbi : mechanism === 1 ? subscriptionAbi : evenAllocAbi,
      library?.getSigner()
    );
  }

  let tx;
  // gasLimit 계산
  let gasLimit;
  // const rndFeet = parseUnits('1', 'eth').toString();
  // const rndFee = ethers.utils.parseEther('1.0').toString();

  if (isKaikas) {
    gasLimit = await contract.methods.requestRandomNumber().estimateGas({
      from: account,
      value: rndFee,
    });
  } else
    gasLimit = await contract.estimateGas.requestRandomNumber({
      value: rndFee,
    });

  // requestRandomNumber 요청
  let receipt;
  try {
    let overrides: Overrides = {
      value: rndFee,
      from: account,
      gasLimit: calculateGasMargin(BigNumber.from(gasLimit)),
    };

    if (isKaikas) {
      tx = await contract.methods
        .requestRandomNumber()
        .send(overrides)
        .catch(async (err: any) => {
          return FAILURE;
        });
      if (tx?.status) {
        return SUCCESS;
      } else return FAILURE;
    } else {
      // if (library._network.chainId === 8217)
      overrides = { ...overrides, gasPrice };

      tx = await contract.requestRandomNumber(overrides);

      // receipt 대기
      try {
        receipt = await tx.wait();
      } catch (e) {
        return FAILURE;
      }
      if (receipt.status === 1) {
        return SUCCESS;
      } else return FAILURE;
    }
  } catch (e) {
    console.log(e);
    return FAILURE;
  }
}

export async function addWhitelist(
  address: string,
  whitelist: string[],
  round: number,
  account: string | undefined | null,
  library: any
): Promise<number> {
  let gasPrice;
  const isKaikas =
    library.provider.bridge !== 'https://bridge.walletconnect.org' &&
    (library.connection.url !== 'metamask' || library.connection.url === 'eip-1193:');
  let contract: any;
  if (isKaikas) {
    // @ts-ignore : In case of Klaytn Kaikas Wallet
    const caver = new Caver(window.klaytn);
    gasPrice = await caver.rpc.klay.getGasPrice();
    const whitelistAbi: AbiItem[] = whiteListAbi as AbiItem[];
    contract = new caver.klay.Contract(whitelistAbi, address);
  } else {
    contract = new ethers.Contract(address, whiteListAbi, library?.getSigner());
  }
  let tx;

  // gasLimit 계산
  let gasLimit;
  if (isKaikas)
    gasLimit = await contract?.methods.addWhitelist(whitelist, round).estimateGas({
      from: account,
    });
  else gasLimit = await contract.estimateGas.addWhitelist(whitelist, round);

  // registerItems 요청
  let receipt;
  try {
    let overrides: Overrides = {
      from: account,
      gasLimit: calculateGasMargin(BigNumber.from(gasLimit)),
    };

    if (isKaikas) {
      tx = await contract.methods
        .addWhitelist(whitelist, round)
        .send(overrides)
        .catch(async (err: any) => {
          return FAILURE;
        });

      if (tx?.status) {
        return SUCCESS;
      } else return FAILURE;
    } else {
      // if (library._network.chainId === 8217)
      overrides = { ...overrides, gasPrice };

      tx = await contract.addWhitelist(whitelist, round, overrides);

      // receipt 대기
      try {
        receipt = await tx.wait();
      } catch (e) {
        return FAILURE;
      }
      if (receipt.status === 1) {
        return SUCCESS;
      } else return FAILURE;
    }
  } catch (e) {
    console.log(e);
    return FAILURE;
  }
}

export async function safeBatchMintToWhitelist(
  address: string,
  uri: string,
  index: number, // white list index, default = 0
  account: string | undefined | null,
  library: any
): Promise<number> {
  let gasPrice;
  const isKaikas =
    library.provider.bridge !== 'https://bridge.walletconnect.org' &&
    (library.connection.url !== 'metamask' || library.connection.url === 'eip-1193:');
  let contract: any;
  if (isKaikas) {
    // @ts-ignore : In case of Klaytn Kaikas Wallet
    const caver = new Caver(window.klaytn);
    gasPrice = await caver.rpc.klay.getGasPrice();
    const whitelistAbi: AbiItem[] = whiteListAbi as AbiItem[];
    contract = new caver.klay.Contract(whitelistAbi, address);
  } else {
    contract = new ethers.Contract(address, whiteListAbi, library?.getSigner());
  }
  let tx;

  // gasLimit 계산
  let gasLimit;
  if (isKaikas)
    gasLimit = await contract?.methods.safeBatchMintToWhitelist(uri, index).estimateGas({
      from: account,
    });
  else gasLimit = await contract.estimateGas.safeBatchMintToWhitelist(uri, index);

  // registerItems 요청
  let receipt;
  try {
    let overrides: Overrides = {
      from: account,
      gasLimit: calculateGasMargin(BigNumber.from(gasLimit)),
    };

    if (isKaikas) {
      tx = await contract.methods
        .safeBatchMintToWhitelist(uri, index)
        .send(overrides)
        .catch(async (err: any) => {
          return FAILURE;
        });
      if (tx?.status) {
        return SUCCESS;
      } else return FAILURE;
    } else {
      // if (library._network.chainId === 8217)
      overrides = { ...overrides, gasPrice };

      tx = await contract.safeBatchMintToWhitelist(uri, index, overrides);

      // receipt 대기
      try {
        receipt = await tx.wait();
      } catch (e) {
        return FAILURE;
      }
      if (receipt.status === 1) {
        return SUCCESS;
      } else return FAILURE;
    }
  } catch (e) {
    console.log(e);
    return FAILURE;
  }
}

export async function setSubscription(
  mysteryBox: string, // mysterybox contract address
  subscription: string, // subscription contract address
  contractType: number,
  allocAmount: number,
  account: string | undefined | null,
  library: any
): Promise<number> {
  let gasPrice;
  const isKaikas =
    library.provider.bridge !== 'https://bridge.walletconnect.org' &&
    (library.connection.url !== 'metamask' || library.connection.url === 'eip-1193:');

  let contract: any;
  if (isKaikas) {
    // @ts-ignore : In case of Klaytn Kaikas Wallet
    const caver = new Caver(window.klaytn);
    gasPrice = await caver.rpc.klay.getGasPrice();
    const boxAbi: AbiItem[] = mysteryBoxAbi as AbiItem[];
    contract = new caver.klay.Contract(boxAbi, mysteryBox);
  } else {
    contract = new ethers.Contract(mysteryBox, mysteryBoxAbi, library?.getSigner());
  }

  let tx;
  // gasLimit 계산
  let gasLimit;
  console.log(contract, subscription);
  if (isKaikas) {
    gasLimit = await contract.methods
      .setSubscription(subscription, contractType, allocAmount)
      .estimateGas({
        from: account,
      });
  } else
    gasLimit = await contract.estimateGas.setSubscription(subscription, contractType, allocAmount);

  // registerItems 요청
  let receipt;
  try {
    let overrides: Overrides = {
      from: account,
      gasLimit: calculateGasMargin(BigNumber.from(gasLimit)),
    };

    if (isKaikas) {
      tx = await contract.methods
        .setSubscription(subscription, contractType, allocAmount)
        .send(overrides)
        .catch(async (err: any) => {
          return FAILURE;
        });
      if (tx?.status) {
        return SUCCESS;
      } else return FAILURE;
    } else {
      // if (library._network.chainId === 8217)
      overrides = { ...overrides, gasPrice };

      tx = await contract.setSubscription(subscription, contractType, allocAmount, overrides);

      // receipt 대기
      try {
        receipt = await tx.wait();
      } catch (e) {
        return FAILURE;
      }
      if (receipt.status === 1) {
        return SUCCESS;
      } else return FAILURE;
    }
  } catch (e) {
    console.log(e);
    return FAILURE;
  }
}

export async function setLaunch(
  mysteryBox: string, // mysterybox contract address
  launch: number, // epoch time
  account: string | undefined | null,
  library: any
): Promise<number> {
  let gasPrice;
  const isKaikas =
    library.provider.bridge !== 'https://bridge.walletconnect.org' &&
    (library.connection.url !== 'metamask' || library.connection.url === 'eip-1193:');

  let contract: any;
  if (isKaikas) {
    // @ts-ignore : In case of Klaytn Kaikas Wallet
    const caver = new Caver(window.klaytn);
    gasPrice = await caver.rpc.klay.getGasPrice();
    const boxAbi: AbiItem[] = mysteryBoxAbi as AbiItem[];
    contract = new caver.klay.Contract(boxAbi, mysteryBox);
  } else {
    contract = new ethers.Contract(mysteryBox, mysteryBoxAbi, library?.getSigner());
  }

  let tx;
  // gasLimit 계산
  let gasLimit;
  console.log(contract, launch);
  if (isKaikas) {
    gasLimit = await contract.methods.setLaunch(launch).estimateGas({
      from: account,
    });
  } else gasLimit = await contract.estimateGas.setLaunch(launch);

  // registerItems 요청
  let receipt;
  try {
    let overrides: Overrides = {
      from: account,
      gasLimit: calculateGasMargin(BigNumber.from(gasLimit)),
    };

    if (isKaikas) {
      tx = await contract.methods
        .setLaunch(launch)
        .send(overrides)
        .catch(async (err: any) => {
          return FAILURE;
        });
      if (tx?.status) {
        return SUCCESS;
      } else return FAILURE;
    } else {
      // if (library._network.chainId === 8217)
      overrides = { ...overrides, gasPrice };

      tx = await contract.setLaunch(launch, overrides);

      // receipt 대기
      try {
        receipt = await tx.wait();
      } catch (e) {
        return FAILURE;
      }
      if (receipt.status === 1) {
        return SUCCESS;
      } else return FAILURE;
    }
  } catch (e) {
    console.log(e);
    return FAILURE;
  }
}

export async function allocation(
  address: string, // subscription contract address
  account: string | undefined | null,
  library: any
): Promise<number> {
  let gasPrice;
  const isKaikas =
    library.provider.bridge !== 'https://bridge.walletconnect.org' &&
    (library.connection.url !== 'metamask' || library.connection.url === 'eip-1193:');

  let contract: any;
  if (isKaikas) {
    // @ts-ignore : In case of Klaytn Kaikas Wallet
    const caver = new Caver(window.klaytn);
    gasPrice = await caver.rpc.klay.getGasPrice();
    const subAbi: AbiItem[] = subscriptionAbi as AbiItem[];
    contract = new caver.klay.Contract(subAbi, address);
  } else {
    contract = new ethers.Contract(address, subscriptionAbi, library?.getSigner());
  }

  let tx;
  // gasLimit 계산
  let gasLimit;
  if (isKaikas) {
    gasLimit = await contract.methods.allocation().estimateGas({
      from: account,
    });
  } else {
    gasLimit = await contract.estimateGas.allocation();
  }

  // registerItems 요청
  let receipt;
  try {
    let overrides: Overrides = {
      from: account,
      gasLimit: calculateGasMargin(BigNumber.from(gasLimit)),
    };

    if (isKaikas) {
      tx = await contract.methods
        .allocation()
        .send(overrides)
        .catch(async (err: any) => {
          return FAILURE;
        });
      if (tx?.status) {
        return SUCCESS;
      } else return FAILURE;
    } else {
      // if (library._network.chainId === 8217)
      overrides = { ...overrides, gasPrice };

      tx = await contract.allocation(overrides);

      // receipt 대기
      try {
        receipt = await tx.wait();
      } catch (e) {
        return FAILURE;
      }
      if (receipt.status === 1) {
        return SUCCESS;
      } else return FAILURE;
    }
  } catch (e) {
    console.log(e);
    return FAILURE;
  }
}

export async function setStaking(
  address: string,
  subscription: string,
  account: string | undefined | null,
  library: any
): Promise<number> {
  let gasPrice;
  const isKaikas =
    library.provider.bridge !== 'https://bridge.walletconnect.org' &&
    (library.connection.url !== 'metamask' || library.connection.url === 'eip-1193:');
  let contract: any;
  if (isKaikas) {
    // @ts-ignore : In case of Klaytn Kaikas Wallet
    const caver = new Caver(window.klaytn);
    gasPrice = await caver.rpc.klay.getGasPrice();
    const whitelistAbi: AbiItem[] = whiteListAbi as AbiItem[];
    contract = new caver.klay.Contract(whitelistAbi, address);
  } else {
    contract = new ethers.Contract(address, whiteListAbi, library?.getSigner());
  }
  let tx;

  // gasLimit 계산
  let gasLimit;
  if (isKaikas)
    gasLimit = await contract?.methods.setStaking(subscription).estimateGas({
      from: account,
    });
  else gasLimit = await contract.estimateGas.setStaking(subscription);

  // registerItems 요청
  let receipt;
  try {
    let overrides: Overrides = {
      from: account,
      gasLimit: calculateGasMargin(BigNumber.from(gasLimit)),
    };

    if (isKaikas) {
      tx = await contract.methods
        .setStaking(subscription)
        .send(overrides)
        .catch(async (err: any) => {
          return FAILURE;
        });
      if (tx?.status) {
        return SUCCESS;
      } else return FAILURE;
    } else {
      // if (library._network.chainId === 8217)
      overrides = { ...overrides, gasPrice };

      tx = await contract.setStaking(subscription, overrides);

      // receipt 대기
      try {
        receipt = await tx.wait();
      } catch (e) {
        return FAILURE;
      }
      if (receipt.status === 1) {
        return SUCCESS;
      } else return FAILURE;
    }
  } catch (e) {
    console.log(e);
    return FAILURE;
  }
}

export async function estimateRandomizeFee(
  address: string,
  account: string | undefined | null,
  library: any,
  mechanism?: number | undefined
): Promise<string> {
  let gasPrice;
  const isKaikas =
    library.provider.bridge !== 'https://bridge.walletconnect.org' &&
    (library.connection.url !== 'metamask' || library.connection.url === 'eip-1193:');

  let contract: any;
  if (isKaikas) {
    // @ts-ignore : In case of Klaytn Kaikas Wallet
    const caver = new Caver(window.klaytn);
    gasPrice = await caver.rpc.klay.getGasPrice();
    const contractAbi: AbiItem[] =
      mechanism === undefined
        ? (mysteryBoxAbi as AbiItem[])
        : mechanism === 1
        ? (subscriptionAbi as AbiItem[])
        : (evenAllocAbi as AbiItem[]);
    contract = new caver.klay.Contract(contractAbi, address);
  } else {
    contract = new ethers.Contract(
      address,
      mechanism === undefined ? mysteryBoxAbi : mechanism === 1 ? subscriptionAbi : evenAllocAbi,
      library?.getSigner()
    );
  }

  let participants;
  try {
    if (isKaikas) {
      participants = await contract.methods
        .estimateRandomizeFee(gasPrice)
        .call()
        .catch(async (err: any) => {
          console.log('#####', address, account);
          console.log('estimateRandomizeFee Error : ', err);
        });
    } else {
      participants = await contract.estimateRandomizeFee(gasPrice);
    }
  } catch (e) {
    console.log('#####', address, account);
    console.log('estimateRandomizeFee Error : ', e);
  }
  return participants.toString();
}

export async function getTotalSupply(
  address: string,
  account: string | undefined | null,
  library: any
): Promise<number> {
  const isKaikas =
    library.provider.bridge !== 'https://bridge.walletconnect.org' &&
    (library.connection.url !== 'metamask' || library.connection.url === 'eip-1193:');

  let contract: any;
  if (isKaikas) {
    // @ts-ignore : In case of Klaytn Kaikas Wallet
    const caver = new Caver(window.klaytn);
    const keyAbi: AbiItem[] = erc721Abi as AbiItem[];
    contract = new caver.klay.Contract(keyAbi, address);
  } else {
    contract = new ethers.Contract(address, erc721Abi, library?.getSigner());
  }

  let totalSupply = 0;
  try {
    if (isKaikas) {
      totalSupply = await contract.methods
        .totalSupply()
        .call()
        .catch(async (err: any) => {
          console.log('#####', address);
          console.log('getTotalSupply Error : ', err);
        });
    } else {
      const result: BigNumber = await contract.totalSupply();
      totalSupply = result.toNumber();
    }
  } catch (e) {
    console.log('#####', address);
    console.log('getTotalSupply Error : ', e);
  }
  return totalSupply;
}

export async function getTotalSupplyNoSigner(
  address: string,
  account: string | undefined | null,
  chainId: number
): Promise<number> {
  const provider = ethers.getDefaultProvider(getSelectedNodeUrl(chainId));
  const contract = new ethers.Contract(address, erc721Abi, provider);

  let totalSupply = 0;
  try {
    const result: BigNumber = await contract.totalSupply();
    totalSupply = result.toNumber();
  } catch (e) {
    console.log('#####', address);
    console.log('getTotalSupplyNoSigner Error : ', e);
  }
  return totalSupply;
}

export async function getWhlBalanceNoSigner(
  address: string,
  account: string | undefined | null,
  chainId: number
): Promise<number> {
  const provider = ethers.getDefaultProvider(getSelectedNodeUrl(chainId));
  const contract = new ethers.Contract(address, whiteListAbi, provider);

  if (account === undefined) return 0;

  let balance = 0;
  try {
    const result: BigNumber = await contract.balanceOf(account);
    balance = result.toNumber();
  } catch (e) {
    console.log('#####', address);
    console.log('getWhlBalanceNoSigner Error : ', e);
  }
  return balance;
}

export async function approveKIP7(
  address: string,
  spender: string,
  amount: string,
  account: string | undefined | null,
  library: any,
  isKaikas: boolean
): Promise<number> {
  let gasPrice;
  let contract: any;
  if (isKaikas) {
    // @ts-ignore : In case of Klaytn Kaikas Wallet
    const caver = new Caver(window.klaytn);
    gasPrice = await caver.rpc.klay.getGasPrice();
    const erc20Abi: AbiItem[] = tokenAbi as AbiItem[];
    contract = new caver.klay.Contract(erc20Abi, address);
  } else {
    contract = new ethers.Contract(address, tokenAbi, library?.getSigner());
  }
  let tx;

  // gasLimit 계산
  let gasLimit;
  if (isKaikas)
    gasLimit = await contract?.methods.approve(spender, amount).estimateGas({
      from: account,
    });
  else gasLimit = await contract.estimateGas.approve(spender, amount);

  // registerItems 요청
  let receipt;
  try {
    let overrides: Overrides = {
      from: account,
      gasLimit: calculateGasMargin(BigNumber.from(gasLimit)),
    };

    if (isKaikas) {
      tx = await contract.methods
        .approve(spender, amount)
        .send(overrides)
        .catch(async (err: any) => {
          return FAILURE;
        });
      if (tx?.status) {
        return SUCCESS;
      } else return FAILURE;
    } else {
      // if (library._network.chainId === 8217)
      overrides = { ...overrides, gasPrice };

      tx = await contract.approve(spender, amount, overrides);

      // receipt 대기
      try {
        receipt = await tx.wait();
      } catch (e) {
        return FAILURE;
      }
      if (receipt.status === 1) {
        return SUCCESS;
      } else return FAILURE;
    }
  } catch (e) {
    console.log(e);
    return FAILURE;
  }
}

// // get all item's amount at once
// export async function getItemAmounts(
//   address: string,
//   account: string | undefined | null,
//   library: any
// ): Promise<string[]> {
//   const isKaikas =
//     library.connection.url !== 'metamask' ||
//     library.connection.url === 'eip-1193:';
//
//   console.log(isKaikas);
//   let contract: any;
//   if (isKaikas) {
//     // @ts-ignore : In case of Klaytn Kaikas Wallet
//     const caver = new Caver(window.klaytn);
//     const mboxAbi: AbiItem[] = mysteryBoxAbi as AbiItem[];
//     contract = new caver.klay.Contract(mboxAbi, address);
//   } else {
//     contract = new ethers.Contract(
//       address,
//       mysteryBoxAbi,
//       library?.getSigner()
//     );
//   }
//
//   let itemAmounts = [];
//   try {
//     if (isKaikas) {
//       itemAmounts = await contract.methods
//         .getItemAmounts()
//         .call()
//         .catch(async (err: any) => {
//           console.log('#####', address);
//           console.log('getItemAmounts Error : ', err);
//         });
//     } else {
//       itemAmounts = await contract.getItemAmounts();
//     }
//   } catch (e) {
//     console.log('#####', address);
//     console.log('getItemAmounts Error : ', e);
//   }
//   return itemAmounts;
// }

export async function getItemAmount(
  address: string,
  index: number,
  type: number, // 1 = MysteryBox, 2 = Collection
  account: string | undefined | null,
  library: any,
  isKaikas: boolean
): Promise<number> {
  let contract: any;
  if (isKaikas) {
    // @ts-ignore : In case of Klaytn Kaikas Wallet
    const caver = new Caver(window.klaytn);
    let klayAbi: AbiItem[];
    if (type === 1) {
      klayAbi = mysteryBoxAbi as AbiItem[];
    } else {
      klayAbi = collectionAbi as AbiItem[];
    }
    contract = new caver.klay.Contract(klayAbi, address);
  } else {
    contract = new ethers.Contract(
      address,
      type === 1 ? mysteryBoxAbi : collectionAbi,
      library?.getSigner()
    );
  }

  let remains;
  try {
    if (isKaikas) {
      if (type === 1) {
        remains = await contract.methods
          .itemAmounts(index)
          .call()
          .catch(async (err: any) => {
            console.log('#####', address);
            console.log('getItemAmount Error : ', err);
          });
      } else {
        const itemAmount = await contract.methods
          .itemAmounts(index)
          .call()
          .catch(async (err: any) => {
            console.log('#####', address);
            console.log('getItemAmount Error : ', err);
          });
        const itemSold = await contract.methods
          .itemSolds(index)
          .call()
          .catch(async (err: any) => {
            console.log('#####', address);
            console.log('getItemAmount Error : ', err);
          });
        remains = itemAmount - itemSold;
      }
    } else {
      if (type === 1) {
        const result: BigNumber = await contract.itemAmounts(index);
        remains = result.toNumber();
      } else {
        const result1: BigNumber = await contract.itemAmounts(index);
        const itemAmount = result1.toNumber();
        const result2: BigNumber = await contract.itemSolds(index);
        const itemSold = result2.toNumber();
        remains = itemAmount - itemSold;
      }
    }
  } catch (e) {
    console.log('#####', address);
    console.log('getItemAmount Error : ', e);
  }
  return remains;
}

export async function getItemAmountNoSigner(
  address: string,
  index: number,
  type: number, // 1 = MysteryBox, 2 = Collection, 3 = AirDrops
  account: string | undefined | null,
  chainId: number
): Promise<number> {
  const provider = ethers.getDefaultProvider(getSelectedNodeUrl(chainId));
  const contract = new ethers.Contract(
    address,
    type === 1 ? mysteryBoxAbi : type == 2 ? collectionAbi : airDropAbi,
    provider
  );

  let remains = 0;
  try {
    if (type === 1) {
      const result: BigNumber = await contract.itemAmounts(index);
      remains = result.toNumber();
    } else {
      const result1: BigNumber = await contract.itemAmounts(index);
      const itemAmount = result1.toNumber();
      const result2: BigNumber = await contract.itemSolds(index);
      const itemSold = result2.toNumber();
      remains = itemAmount - itemSold;
    }
  } catch (e) {
    console.log('#####', address);
    console.log('getItemAmountNoSigner Error : ', e);
  }
  return remains;
}

export async function getItemRemains(
  address: string,
  account: string | undefined | null,
  library: any,
  isKaikas: boolean
): Promise<number> {
  let contract: any;
  if (isKaikas) {
    // @ts-ignore : In case of Klaytn Kaikas Wallet
    const caver = new Caver(window.klaytn);
    const mboxAbi: AbiItem[] = mysteryBoxAbi as AbiItem[];
    contract = new caver.klay.Contract(mboxAbi, address);
  } else {
    contract = new ethers.Contract(address, mysteryBoxAbi, library?.getSigner());
  }

  let remains = 0;
  try {
    if (isKaikas) {
      remains = await contract.methods
        .getItemRemains()
        .call()
        .catch(async (err: any) => {
          console.log('#####', address);
          console.log('getItemRemains Error : ', err);
        });
    } else {
      const result: BigNumber = await contract.getItemRemains();
      remains = result.toNumber();
    }
  } catch (e) {
    console.log('#####', address);
    console.log('getItemRemains Error : ', e);
  }
  return remains;
}

export async function getItemRemainsNoSigner(
  address: string,
  account: string | undefined | null,
  chainId: number
): Promise<number> {
  const provider = ethers.getDefaultProvider(getSelectedNodeUrl(chainId));
  new ethers.Contract(address, mysteryBoxAbi, provider);
  const contract = new ethers.Contract(address, mysteryBoxAbi, provider);

  let remains = 0;
  try {
    const result: BigNumber = await contract.getItemRemains();
    remains = result.toNumber();
  } catch (e) {
    console.log('#####', address);
    console.log('getItemRemainsNoSigner Error : ', e);
  }
  return remains;
}

function hexToAddress(hexVal: any) {
  return '0x' + hexVal.substr(-40);
}

export async function buyItem(
  address: string,
  index: number,
  amount: number,
  payment: string,
  quote: string,
  account: string | undefined | null,
  library: any,
  isKaikas: boolean
): Promise<txResult> {
  let gasPrice;
  let contract: any;
  if (isKaikas) {
    // @ts-ignore : In case of Klaytn Kaikas Wallet
    const caver = new Caver(window.klaytn);
    gasPrice = await caver.rpc.klay.getGasPrice();
    const collectionAbi: AbiItem[] = collectionData.abi as AbiItem[];
    contract = new caver.klay.Contract(collectionAbi, address);
  } else {
    contract = new ethers.Contract(address, collectionAbi, library?.getSigner());
  }

  let tx;
  // gasLimit 계산
  let gasLimit;
  console.log(contract, amount);
  if (isKaikas) {
    if (quote === '0x0000000000000000000000000000000000000000') {
      gasLimit = await contract.methods.buyItemEth(index, amount).estimateGas({
        value: payment,
        from: account,
      });
    } else {
      gasLimit = await contract.methods.buyItemQuote(index, payment, amount).estimateGas({
        from: account,
      });
    }
  } else {
    if (quote === '0x0000000000000000000000000000000000000000') {
      gasLimit = await contract.estimateGas.buyItemEth(index, amount, {
        value: payment,
      });
    } else {
      gasLimit = await contract.estimateGas.buyItemQuote(index, payment, amount);
    }
  }

  // registerItems 요청
  let receipt;
  const result: txResult = { status: 0, txHash: '', tokenId: 0 };
  try {
    let overrides: Overrides = {
      from: account,
      gasLimit: calculateGasMargin(BigNumber.from(gasLimit)),
    };

    if (isKaikas) {
      if (quote === '0x0000000000000000000000000000000000000000') {
        overrides = { ...overrides, value: payment };

        tx = await contract.methods
          .buyItemEth(index, amount)
          .send(overrides)
          .catch(async (err: any) => {
            result.status = FAILURE;
          });
      } else {
        tx = await contract.methods
          .buyItemQuote(index, payment, amount)
          .send(overrides)
          .catch(async (err: any) => {
            result.status = FAILURE;
          });
      }
      if (tx?.status) {
        result.status = SUCCESS;
        result.txHash = tx.transactionHash;
      } else {
        result.status = FAILURE;
      }
      return result;
    } else {
      // if (library._network.chainId === 8217)
      overrides = { ...overrides, gasPrice };

      if (quote === '0x0000000000000000000000000000000000000000') {
        overrides = { ...overrides, value: payment };

        tx = await contract.buyItemEth(index, amount, overrides);
      } else {
        tx = await contract.buyItemQuote(index, payment, amount, overrides);
      }

      // receipt 대기
      try {
        receipt = await tx.wait();
        // TODO: Get tokenId in the receipt and save into DB drops ?
        const events = receipt.events;
        const recipient = hexToAddress(events[1].topics[2]);
        const tokenIdHex = ethers.utils.defaultAbiCoder.decode(['uint256'], events[1].topics[3]);
        result.tokenId = parseInt(tokenIdHex.toString());
        console.log('== buyItem event ==>', recipient, result.tokenId);
      } catch (e) {
        result.status = FAILURE;
      }
      if (receipt.status === 1) {
        result.status = SUCCESS;
        result.txHash = receipt.transactionHash;
      } else {
        result.status = FAILURE;
      }
      return result;
    }
  } catch (e) {
    console.log(e);
    result.status = FAILURE;
    return result;
  }
}

export async function getTokenIds(
  address: string,
  amount: number,
  account: string | undefined | null,
  chainId: number
): Promise<number[]> {
  const provider = ethers.getDefaultProvider(getSelectedNodeUrl(chainId));
  new ethers.Contract(address, mysteryBoxAbi, provider);
  const contract = new ethers.Contract(address, collectionAbi, provider);

  let tokenIds: number[] = [];
  try {
    for (let i = 0; i < amount; i++) {
      const rlt = await contract.tokenOfOwnerByIndex(account, i);
      tokenIds[i] = rlt.toNumber();
    }
  } catch (e) {
    console.log('#####', address);
    console.log('getTokenIds Error : ', e);
  }
  return tokenIds;
}

export async function getItemSold(
  address: string,
  index: number,
  chainId: number
): Promise<number> {
  const provider = ethers.getDefaultProvider(getSelectedNodeUrl(chainId));
  const contract = new ethers.Contract(address, collectionAbi, provider);

  let sold = 0;
  try {
    const result: BigNumber = await contract.itemSolds(index);
    sold = result.toNumber();
  } catch (e) {
    console.log('#####', address);
    console.log('getItemSold Error : ', e);
  }
  return sold;
}

export async function getGasPriceFRomAPI() {
  let gasPrice = '';
  // const target = localStorage.getItem('target');
  const target = env.REACT_APP_TARGET_NETWORK;

  if (target === 1001 || target === 8217) gasPrice = await caver.rpc.klay.getGasPrice();
  else if (target === 80001) {
    const result = await axios.get('https://gasstation-mumbai.matic.today/v2');
    gasPrice = ethers.utils
      .parseUnits(result.data.fast.maxFee.toFixed(5).toString(), 'gwei')
      .toHexString();
  } else if (target === 137) {
    const result = await axios.get('https://gasstation-mainnet.matic.network/v2');
    gasPrice = ethers.utils
      .parseUnits(result.data.fast.maxFee.toFixed(5).toString(), 'gwei')
      .toHexString();
  }
  console.log('!! getPrice = ', gasPrice);
  return gasPrice;
}
