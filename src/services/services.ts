import axios from 'axios';
import env from '../env';
import { apiAuthAxios, customAxios } from './customAxios';
import { AbcAddUserDto } from '../abc/main/abc/interface';
import { services } from '../../src/abc/background/init';
import queryString from 'query-string';

export const getTicketsService = (page: number, perPage: number, category: string) => {
  // const url = `${API_URL}/service/collection/mysterybox/?&page=${page}&limit=${perPage}&category=${category.toLowerCase()}`;
  return customAxios.get(
    `api/service/collection/mysterybox/?&page=${page}&limit=${perPage}&category=${category.toLowerCase()}`
  );
};

export const getTicketInfoService = (id: string) => {
  return customAxios.get(`api/service/mysterybox/${id}`);
};

export const registerBuy = async (data: any) => {
  return await apiAuthAxios.post(`api/service/drops`, data);
};

export const getBuyersService = async (id: any) => {
  return await customAxios.get(`api/service/drops/mysterybox/${id}`);
};

export const getSession = async () => {
  return await apiAuthAxios.get('/auth/getSession');
};

export const userRegister = async (data: any) => {
  return await apiAuthAxios.post('/auth/register/eternals', data);
};

export const eternalLogin = async (data: any) => {
  // {email:'asdf', password:'asdf}
  return await apiAuthAxios.post('/auth/eternal', data);
};

export const abcLogin = async (data: any) => {
  return await customAxios.post(`api/abc/login`, data);
};

export const abcTokenRefresh = async (data: any) => {
  return await customAxios.post(`api/abc/refresh`, data);
};

export const abcAddUser = async (dto: AbcAddUserDto) => {
  const { abcService } = services;
  const { encrypted, channelid } = await abcService.encryptSecureData(dto.password);

  return await customAxios.post(`api/abc/adduser`, {
    data: queryString.stringify({
      ...dto,
      password: encrypted,
      serviceid: process.env.ABC_SERVICE_ID,
    }),
    channelid: channelid,
  });
};

export const getUser = async () => {
  return await apiAuthAxios.get('/api/users/getUser');
};

export const updateAddress = async (data: any) => {
  const token = window.localStorage.getItem('nftapiJwtToken');
  return await customAxios.post('/api/service/profile/addressUpdate', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteAddress = async (data: any) => {
  const token = window.localStorage.getItem('nftapiJwtToken');
  return await customAxios.post('/api/service/profile/addressDelete', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const requestWalletLogin = async (data: any) => {
  return await apiAuthAxios.post('/auth/walletLogin?isWalletLogin=true', data);
};

export const savePoint = async (data: any) => {
  const token = window.localStorage.getItem('nftapiJwtToken');
  return await apiAuthAxios.post('/api/point', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getMyTickets = async (uid: string) => {
  return await apiAuthAxios.get(
    `/api/service/drops?buyer=${uid}&type=item&mode=each&sortBy=createdAt:ASC`
  );
};

export const getTransactionsByUID = async (uid: string, page: number) => {
  return await customAxios(`/api/service/drops/transactions?buyer=${uid}&page=${page}&limit=10`);
};

export const getEdcTransactionByUID = async (uid: string, page: number) => {
  return await customAxios(`/api/point?buyer=${uid}&page=${page}&limit=10`);
};

export const getExchange = async () => {
  return await customAxios.get('/api/exchange');
};

export const getOldMyTicket = async () => {
  return await apiAuthAxios.get('/api/users/tickets');
};
