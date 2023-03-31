import { ethers } from 'ethers';

export const makeTxData = (ABI: any, method: string, methodArgs: any[]): any => {
  // const ABI = ['function transfer(address to, uint amount)'];
  const iFace = new ethers.utils.Interface(ABI);

  // const data = iFace.encodeFunctionData('transfer', [
  //   '0x1234567890123456789012345678901234567890',
  //   ethers.utils.parseEther('1.0'),
  // ]);
  // data = '0xa9059cbb00000000000000000000000012345678901234567890123456789012345678900000000000000000000000000000000000000000000000000de0b6b3a7640000';

  return iFace.encodeFunctionData(method, methodArgs);
};
