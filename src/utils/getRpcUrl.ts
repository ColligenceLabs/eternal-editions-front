import { ChainId } from '../config';

// Array of available nodes to connect to

export const nodesPolygon = 'https://polygon-rpc.com';
export const nodesMumbai = 'https://rpc-mumbai.maticvigil.com';

export const getSelectedNodeUrl = (chainId: number) => {
  switch (chainId) {
    case ChainId.POLYGON:
      return nodesPolygon;
    case ChainId.MUMBAI:
      return nodesMumbai;
    default:
      return nodesMumbai;
  }
};

export default getSelectedNodeUrl;
