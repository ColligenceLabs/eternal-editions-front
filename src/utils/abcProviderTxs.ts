import { BigNumber, ethers, utils } from 'ethers';
import tokenAbi from '../config/abi/ERC20Token.json';
import { FAILURE, SUCCESS } from '../config';
import {g etGasPriceFromAPI } from "src/utils/transactions";

export function calculateGasMargin(value: BigNumber) {
    return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000));
}

interface Overrides {
    value?: string | number;
    from: string | null | undefined;
    gasLimit: BigNumber;
    gasPrice?: string;
}

export async function approve(
    address: string,
    spender: string,
    amount: string,
    account: string | undefined | null,
    signer: any
): Promise<number> {
    const gasPrice = await getGasPriceFromAPI();
    const contract = new ethers.Contract(address, tokenAbi, signer);

    // gasLimit 계산
    const gasLimit = await contract.estimateGas.approve(spender, utils.parseEther(amount));

    // registerItems 요청
    let receipt;
    try {
        const overrides: Overrides = {
            // from: account,
            gasLimit: calculateGasMargin(BigNumber.from(gasLimit)),
            gasPrice
        };
        const tx = await contract.approve(spender, utils.parseEther(amount), overrides);

        // receipt 대기
        try {
            receipt = await tx.wait();
            console.log('!! Receipt : ', receipt);
        } catch (e) {
            return FAILURE;
        }
        if (receipt.status === 1) {
            return SUCCESS;
        } else return 1;
    } catch (e) {
        console.log(e);
        return FAILURE;
    }
}
