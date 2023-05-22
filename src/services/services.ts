import axios from 'axios';
import env from '../env';
import { apiAuthAxios, customAxios } from './customAxios';
import { AbcAddUserDto, AbcInitPasswordDto, AbcSnsAddUserDto } from '../abc/main/abc/interface';
import { services } from 'src/abc/background/init';
import queryString from 'query-string';

export const getTicketsService = (page: number, perPage: number, category: string) =>
  // const url = `${API_URL}/service/collection/mysterybox/?&page=${page}&limit=${perPage}&category=${category.toLowerCase()}`;
  customAxios.get(
    `api/service/collection/mysterybox/?&page=${page}&limit=${perPage}&category=${category.toLowerCase()}`
  );

export const getTicketInfoService = (id: string) => customAxios.get(`api/service/mysterybox/${id}`);
export const getTicketCountByCategory = () =>
  customAxios.get(`/api/service/mysterybox/category/count`);
export const registerBuy = async (data: any) =>
  await apiAuthAxios.post(`api/service/drops/eternal`, data);

export const getBuyersService = async (id: any) =>
  await customAxios.get(`api/service/drops/mysterybox/${id}`);

export const getSession = async () => await apiAuthAxios.get('/auth/getSession');

export const userRegister = async (data: any) =>
  await apiAuthAxios.post('/auth/register/eternals', data);

export const updateAbcAddress = async (address: string) =>
  await apiAuthAxios.post(`api/users/abc/${address}`);

export const eternalLogin = async (data: any) =>
  // {email:'asdf', password:'asdf}
  await apiAuthAxios.post('/auth/eternal', data);

export const abcLogin = async (data: any) => await customAxios.post(`api/abc/login`, data);

export const abcTokenRefresh = async (data: any) => await customAxios.post(`api/abc/refresh`, data);

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

export const abcJoin = async (dto: AbcSnsAddUserDto) => {
  return await customAxios.post(`api/abc/join`, {
    data: queryString.stringify({
      ...dto,
      serviceid: process.env.ABC_SERVICE_ID,
    }),
  });
};

export const resetPassword = async (dto: AbcInitPasswordDto) => {
  const { abcService } = services;
  const { encrypted, channelid } = await abcService.encryptSecureData(dto.password);

  return await customAxios.post(`api/abc/initpassword`, {
    data: queryString.stringify({
      ...dto,
      password: encrypted,
      serviceid: process.env.ABC_SERVICE_ID,
    }),
    channelid: channelid,
  });
};

export const getUser = async () => await apiAuthAxios.get('/api/users/getUser');

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
export const requestWalletLogin = async (data: any) =>
  await apiAuthAxios.post('/auth/walletLogin?isWalletLogin=true', data);

export const savePoint = async (data: any) => {
  const token = window.localStorage.getItem('nftapiJwtToken');
  return await apiAuthAxios.post('/api/point', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getMyTickets = async (uid: string) =>
  await apiAuthAxios.get(
    `/api/service/drops?buyer=${uid}&type=item&mode=each&sortBy=createdAt:DESC`
  );

export const getTransactionsByUID = async (uid: string, page: number) =>
  await customAxios(`/api/service/drops/transactions?buyer=${uid}&page=${page}&limit=10`);

export const getEdcTransactionByUID = async (uid: string, page: number) =>
  await customAxios(`/api/point?buyer=${uid}&page=${page}&limit=10`);

export const getExchange = async () => await customAxios.get('/api/exchange');

export const getOldMyTicket = async () => await apiAuthAxios.get('/api/users/tickets');

export const getOldMyTicketByUid = async (uid: string) =>
  await apiAuthAxios.get(`/api/users/tickets/${uid}`);

export const checkUserEmail = async (email: string) =>
  await apiAuthAxios.get(`/api/users/checkUser?email=${email}`);

export const getSellItemInfo = async (id: string) => await customAxios(`/api/service/drops/${id}`);

export const getSellBooks = async (page: number, perPage?: number) => {
  return await customAxios.get(
    `/api/service/sellbook?page=${page}&limit=${perPage ? perPage : 5}sortBy=createdAt%3AASC`
  );
};

export const registerSell = async (data: any) => {
  return await apiAuthAxios.post('/api/service/sellbook', data);
};

export const registerSellbookBuy = async (data: any, id: number) => {
  return await apiAuthAxios.post(`/api/service/sellbook/buy/${id}`, data);
};
