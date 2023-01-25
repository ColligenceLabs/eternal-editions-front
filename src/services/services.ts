import axios from 'axios';
import env from '../env';
import { apiAuthAxios, customAxios } from './customAxios';

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
  return await customAxios.post(`api/service/drops`, data);
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

export const abcLogin = async (data: any) => {
  return await customAxios.post(`api/abc/login`, data);
};

export const abcTokenRefresh = async (data: any) => {
  return await customAxios.post(`api/abc/refresh`, data);
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
