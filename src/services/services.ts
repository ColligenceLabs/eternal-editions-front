import axios from 'axios';
import env from '../env';

const API_URL = `${env.REACT_APP_API_URL}/api`;

export const getTicketsService = (page: number, perPage: number, category: string) => {
  const url = `${API_URL}/service/collection/mysterybox/?&page=${page}&limit=${perPage}&category=${category.toLowerCase()}`;
  return axios.get(url);
};

export const getTicketInfoService = (id: string) => {
  return axios.get(`${API_URL}/service/mysterybox/${id}`);
};

export const registerBuy = async (data: any) => {
  return await axios.post(`${API_URL}/service/drops`, data);
};

export const getBuyersService = async (id: any) => {
  return await axios.get(`${API_URL}/service/drops/mysterybox/${id}`);
};
