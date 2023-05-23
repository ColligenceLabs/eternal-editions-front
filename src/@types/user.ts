export interface User {
  uid: string;
  provider_id: string;
  auth_type: string;
  provider_data: string;
  eth_address: null;
  role: string;
  name: string;
  email: string;
  profile_image: null;
  banner_image: null;
  twitter: null;
  instagram: null;
  site: null;
  createdAt: string;
  updatedAt: string;
  session: Session;
  id_token: string;
  service: string;
  point: null;
  abc_address: string;
  password: null;
  birthday: string;
  gender: string;
  phone: string;
}

export interface Session {
  cookie: Cookie;
  providerAuthInfo: ProviderAuthInfo;
  dropsUser: DropsUser;
}

export interface Cookie {
  originalMaxAge: number;
  expires: string;
  httpOnly: boolean;
  path: string;
}

export interface DropsUser {
  uid: string;
  nftapiJwtToken: string;
}

export interface ProviderAuthInfo {
  provider: string;
  provider_token: string;
  provider_id: string;
  provider_username: string;
  provider_data: string;
}
