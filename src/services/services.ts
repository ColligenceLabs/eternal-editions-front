import axios from 'axios';
import env from '../env';

const API_URL = `${env.REACT_APP_API_URL}/api`;

export const getTicketsService = (page: number, perPage: number, category: string) => {
  console.log(category);
  const url = `${API_URL}/service/mysterybox/?&page=${page}&perPage=${perPage}&category=${category}`;
  return axios.get(url);
};
