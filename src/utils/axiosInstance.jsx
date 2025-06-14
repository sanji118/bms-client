import axios from 'axios';
import tokenStorage from './tokenStorage';

const axiosInstance = axios.create({
  baseURL: 'https://bms-server-eight.vercel.app/',
});

axiosInstance.interceptors.request.use(config => {
  const token = tokenStorage.getToken();
  // //console.log('INTERCEPTOR TOKEN:' , token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // //console.log('Request HEADERS: ', config.headers)
  }
  return config;
});

export default axiosInstance;
