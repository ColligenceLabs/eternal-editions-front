import axios from 'axios';
// config
import env from '../env';

// ----------------------------------------------------------------------

export const basePath = env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: basePath,
});

export default axiosInstance;
