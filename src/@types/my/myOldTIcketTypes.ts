export type OldTicketTypes = {
  id: number;
  qrcode: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  ticketInfo: {
    id: number;
    image: string;
    code: string;
    status: string;
    price: number;
    location1: string;
    location2: string;
    location3: string;
    usedTime: Date | null;
    used: boolean;
    onSale: boolean;
    onGift: boolean;
    idShow: number;
    showName: string;
    showLocation: string;
    ticketInfoName: string;
    ticketName: string;
    nftContractAddress: string;
    nftTokenID: any;
    nftBuyerWalletAddress: string;
    migrate: {
      migrateId: any;
      migrateTime: Date;
      migrate: boolean;
    };
    showStartTime: Date;
    txHistory: boolean;
    nft333: boolean;
    earlyBird2023: boolean;
  };
};
