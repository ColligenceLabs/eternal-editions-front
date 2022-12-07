import { ChainId } from '../config';

// Array of available nodes to connect to

export const nodesPolygon = 'https://mainet.infura.io/v3/adb9c847d7114ee7bf83995e8f22e098';
export const nodesMumbai = 'https://ropsten.infura.io/v3/adb9c847d7114ee7bf83995e8f22e098';

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
