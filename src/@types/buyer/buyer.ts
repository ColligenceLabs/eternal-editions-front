export type BuyerTypes = {
  id: number;
  buyer: string | null;
  buyerAddress: string;
  isRevealed: boolean;
  isSent: boolean;
  itemId: number;
  mysteryBoxId: number;
  price: number;
  txHash: string;
  updatedAt: Date;
  createdAt: Date;
};
