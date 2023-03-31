import axios from 'axios';
import env from '../env';
// 타이밍 이슈 있음
// const accessToken = localStorage.getItem('nftapiJwtToken') ?? '{}';
const API_URL = `${env.REACT_APP_API_URL}`;

export const customAxios = axios.create({
  baseURL: `${API_URL}`,
});

// export const authAxios = axios.create({
//   baseURL: `${process.env.REACT_APP_API_SERVER}`,
//   headers: { Authorization: `Bearer ${accessToken}` },
// });

export const apiAuthAxios = axios.create({
  baseURL: `${API_URL}`,
  withCredentials: true,
});
