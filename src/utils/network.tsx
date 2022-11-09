import detectEthereumProvider from '@metamask/detect-provider';
import { ChainId, NETWORK_NAME, SCAN_URL, RPC_URLS } from '../config';

let provider: any;

const addNetwork = async (chainId: number | undefined) => {
    if (provider && provider.request) {
        try {
            if (
                chainId === ChainId.POLYGON ||
                chainId === ChainId.MUMBAI
            ) {
                await provider.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: `0x${chainId.toString(16)}`,
                            chainName: NETWORK_NAME[chainId],
                            nativeCurrency: {
                                name: 'MATIC',
                                symbol: 'MATIC',
                                decimals: 18,
                            },
                            rpcUrls: [RPC_URLS[chainId]],
                            blockExplorerUrls: [SCAN_URL[chainId]],
                        },
                    ],
                });
            }
        } catch (addError: any) {
            // handle "add" error
            console.error(addError);
            switch (addError.code) {
                case -32602:
                    return true;
                default:
                    break;
            }
            return false;
        }
    } else {
        console.error(
            "Can't setup the polygon mainnet on metamask because window.ethereum is undefined"
        );
        return false;
    }
    return true;
};

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async (chainId: number | undefined) => {
    provider = await detectEthereumProvider({ mustBeMetaMask: true });

    let result;
    result = await addNetwork(chainId);

    if (provider && provider.request) {
        try {
            await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${chainId?.toString(16)}` }],
            });
        } catch (error: any) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (error.code === 4902) {
                result = await addNetwork(chainId);
                // } else if (error.code === 4001 || error instanceof UserRejectedRequestError) {
                //   recoverChainId();
                //   return false;
            }
        }
    } else {
        console.error(
            "Can't setup the polygon mainnet on metamask because window.ethereum is undefined"
        );
        return false;
    }
    return result;
};