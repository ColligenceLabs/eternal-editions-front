export type TicketInfoTypes = {
  id: number;
  title: { ko: string; en: string };
  symbol: string;
  introduction: { ko: string; en: string };
  bannerImage: string | null;
  price: number;
  quote: string;
  status: number;
  updatedAt: Date;
  createdAt: Date;
  itemAmount: any;
  isApproved: boolean;
  rarityLevel: any;
  packageImage: any;
  revealAnimation: any;
  releaseDatetime: any;
  afterRelease: any;
  keyContractAddress: any;
  boxContractAddress: any;
  deployStatus: any;
  creator: any;
  useSubscription: boolean;
  useRevealLockup: boolean;
  useWhitelistFiltering: boolean;
  whitelistNftId: number;
  subscriptionId: number;
  paymentAddress: string;
  totalAmount: number;
  usedAmount: number;
  mobileBanner: string;
  chainId: number;
  isCollection: boolean;
  categoriesStr: string;
  isAirdrop: boolean;
  mysteryboxItems: TicketItemTypes[];
  featured?: {
    company: { image: string; name: { en: string; ko: string } };
    companyId: string;
  };
  featuredId: string;
  // mysteryboxItems?: MBoxItemTypes[] | null;
  soldAmount: number;
};

export type TicketItemTypes = {
  no: number;
  id: number;
  infoId: number;
  itemImage: any;
  name: string;
  rarity: string;
  issueAmount: number;
  probability: number;
  description: string;
  properties: PropertyTypes[];
  levels: OptionsTypes[];
  stats: OptionsTypes[];
  remainingAmount?: number;
  originalImage: string;
  remain: number;
};

export type PropertyTypes = {
  id: number;
  type: string;
  name: string;
};

export type OptionsTypes = {
  id: number;
  name: string;
  value: number;
  totalValue: number;
};
