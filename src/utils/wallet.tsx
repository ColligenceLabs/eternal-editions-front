import {
  WALLET_ABC,
  WALLET_COINBASE,
  WALLET_KAIKAS,
  WALLET_KLIP,
  WALLET_METAMASK,
  WALLET_WALLECTCONNECT,
} from '../config';
// @ts-ignore
import Promise from 'lodash/_Promise';
import Web3 from 'web3';
import { SxProps } from '@mui/material';
import Image from '../components/Image';

export function getShotAddress(address: string) {
  return address && address.length > 10
    ? address.substring(0, 5) + '...' + address.substring(address.length - 2, address.length)
    : '';
}

export function getIconByType(type: string) {
  switch (type) {
    case WALLET_WALLECTCONNECT:
      return '/assets/icons/wallet/walletconnect-alternative.webp';
    case WALLET_COINBASE:
      return '/assets/icons/wallet/walletlink-alternative.webp';
    case WALLET_KAIKAS:
      return '/assets/icons/wallet/icon_kaikas.png';
    case WALLET_KLIP:
      return '/assets/icons/wallet/icon_klip.png';
    case WALLET_METAMASK:
      return '/assets/icons/wallet/metamask.svg';
    case WALLET_ABC:
      return '/assets/icons/wallet/abc_icon.png';
  }
}

export function handleSignMessage(publicAddress: string, nonce: string) {
  const web3 = new Web3(window.ethereum);
  // @ts-ignore
  return new Promise((resolve, reject) =>
    web3.eth.personal.sign(
      web3.utils.fromUtf8(nonce),
      publicAddress,
      // @ts-ignore
      (err, signature) => {
        if (err) return reject(err);
        return resolve({ publicAddress, signature });
      }
    )
  );
}

export function axiosHeader(accessToken: string | undefined) {
  if (accessToken && accessToken.length > 0) {
    return {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  } else {
    return {};
  }
}

export const ETH_VERSION = '0x1';
export const ROPSTEN_VERSION = '0x3';
export const RINKEBY_VERSION = '0x4';
export const GOERLI_VERSION = '0x5';
export const KOVAN_VERSION = '0x2a';
export const MATIC_VERSION = '0x89';
export const MUMBAI_VERSION = '0x13881';

export function toChain(version: string) {
  switch (version) {
    case ETH_VERSION:
      return {
        chain: 'ETH',
        mainnet: true,
        name: 'Ethereum Main Network',
      };
    case ROPSTEN_VERSION:
      return {
        chain: 'ETH',
        mainnet: false,
        name: 'Ropsten Test Network',
      };
    case RINKEBY_VERSION:
      return {
        chain: 'ETH',
        mainnet: false,
        name: 'Rinkeby Test Network',
      };
    case GOERLI_VERSION:
      return {
        chain: 'ETH',
        mainnet: false,
        name: 'Goerli Test Network',
      };
    case KOVAN_VERSION:
      return {
        chain: 'ETH',
        mainnet: false,
        name: 'Kovan Test Network',
      };

    case MATIC_VERSION:
      return {
        chain: 'MATIC',
        mainnet: true,
        name: 'Polygon Main Network',
      };
    case MUMBAI_VERSION:
      return {
        chain: 'MATIC',
        mainnet: false,
        name: 'Mumbai Test Network',
      };
  }
  return {
    chain: '',
    mainnet: false,
    name: '',
  };
}

export function toSymbolImage(version: string, sx?: SxProps) {
  switch (version) {
    case ETH_VERSION:
      return (
        <>
          <Image src={'/assets/icons/token/icon_eth.svg'} sx={sx} />
        </>
      );
    case ROPSTEN_VERSION:
      return (
        <>
          <Image src={'/assets/icons/token/icon_eth.svg'} sx={sx} />
        </>
      );
    case RINKEBY_VERSION:
      return (
        <>
          <Image src={'/assets/icons/token/icon_eth.svg'} sx={sx} />
        </>
      );
    case GOERLI_VERSION:
      return (
        <>
          <Image src={'/assets/icons/token/icon_eth.svg'} sx={sx} />
        </>
      );
    case KOVAN_VERSION:
      return (
        <>
          <Image src={'/assets/icons/token/icon_eth.svg'} sx={sx} />
        </>
      );
    case MUMBAI_VERSION:
      return (
        <>
          <Image src={'/assets/icons/token/icon_matic.svg'} sx={sx} />
        </>
      );
    case MATIC_VERSION:
      return (
        <>
          <Image src={'/assets/icons/token/icon_matic.svg'} sx={sx} />
        </>
      );
  }
}

export function toChainObj(version: string) {
  switch (version) {
    case ETH_VERSION:
      return {
        chainId: '0x1',
        rpcUrls: [''],
        chainName: '',
        nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
        },
        blockExplorerUrls: [''],
      };
    case ROPSTEN_VERSION:
      return {
        chainId: '0x3',
        rpcUrls: [''],
        chainName: '',
        nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
        },
        blockExplorerUrls: [''],
      };
    case RINKEBY_VERSION:
      return {
        chainId: '0x4',
        rpcUrls: [''],
        chainName: '',
        nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
        },
        blockExplorerUrls: [''],
      };
    case GOERLI_VERSION:
      return {
        chainId: '0x5',
        rpcUrls: [''],
        chainName: '',
        nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
        },
        blockExplorerUrls: [''],
      };
    case KOVAN_VERSION:
      return {
        chainId: '0x2a',
        rpcUrls: [''],
        chainName: '',
        nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
        },
        blockExplorerUrls: [''],
      };
    case MUMBAI_VERSION:
      return {
        chainId: '0x13881',
        chainName: 'Mumbai Testnet',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
        blockExplorerUrls: ['https://mumbai.polygonscan.com'],
      };
    case MATIC_VERSION:
      return {
        chainId: '0x89',
        rpcUrls: ['https://rpc-mainnet.matic.network/'],
        chainName: 'Polygon Mainnet',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18,
        },
        blockExplorerUrls: ['https://polygonscan.com/'],
      };
  }
}

export function ClipboardCopy(text: string, message: string) {
  // 흐음 1.
  if (navigator.clipboard) {
    // (IE는 사용 못하고, 크롬은 66버전 이상일때 사용 가능합니다.)
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert(message);
      })
      .catch(() => {
        alert('복사를 다시 시도해주세요.');
      });
  } else {
    // 흐름 2.
    if (!document.queryCommandSupported('copy')) {
      return alert('복사하기가 지원되지 않는 브라우저입니다.');
    }

    // 흐름 3.
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.top = String(0);
    textarea.style.left = String(0);
    textarea.style.position = 'fixed';

    // 흐름 4.
    document.body.appendChild(textarea);
    // focus() -> 사파리 브라우저 서포팅
    textarea.focus();
    // select() -> 사용자가 입력한 내용을 영역을 설정할 때 필요
    textarea.select();
    // 흐름 5.
    document.execCommand('copy');
    // 흐름 6.
    document.body.removeChild(textarea);
    alert(message);
  }
}

export const checkKaikas = (library: any) => {
  return library.provider.isWalletConnect
    ? false
    : library.connection.url !== 'metamask' || library.connection.url === 'eip-1193:';
};
