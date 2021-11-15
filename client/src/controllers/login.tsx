import axios, { AxiosResponse } from 'axios';

const baseUrl = process.env.NODE_ENV !== 'development' ? '/api' : 'http://localhost:3001/api';

const login = (data: Record<any, unknown>): Promise<AxiosResponse> => axios.post(`${baseUrl}/login`, data);

const logOut = (): Promise<AxiosResponse> => axios.post(`${baseUrl}/logout`);

export default {
  login,
  logOut,
};
