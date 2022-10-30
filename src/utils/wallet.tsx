import {WALLET_KAIKAS, WALLET_KLIP, WALLET_METAMASK} from '../config';
// @ts-ignore
import Promise from "lodash/_Promise";
import Web3 from "web3";

export function getShotAddress(address: string) {
    return address && address.length > 10 ? address.substring(0, 5) + '...' + address.substring(address.length - 2, address.length) : '';
}

export function getIconByType(type: string) {
    switch (type) {
        case WALLET_KAIKAS:
            return '/assets/icons/wallet/icon_kaikas.png';
        case WALLET_KLIP:
            return '/assets/icons/wallet/icon_klip.png';
        case WALLET_METAMASK:
            return '/assets/icons/wallet/metamask.svg';
    }
}


export function handleSignMessage(publicAddress: string, nonce: string) {

    const web3 = new Web3(window.ethereum)
    // @ts-ignore
    return new Promise((resolve, reject) =>
        web3.eth.personal.sign(
            web3.utils.fromUtf8(nonce),
            publicAddress,
            // @ts-ignore
            (err, signature) => {
                if (err) return reject(err);
                return resolve({publicAddress, signature});
            }
        )
    );
}

export function axiosHeader(accessToken: string | undefined) {
    if (accessToken && accessToken.length > 0) {
        return {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }
    } else {
        return {};
    }
}