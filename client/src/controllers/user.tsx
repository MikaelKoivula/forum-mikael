import axios, { AxiosResponse } from 'axios';

const baseUrl = process.env.NODE_ENV !== 'development' ? '/api' : 'http://localhost:3001/api';

const editUser = (data: any): Promise<AxiosResponse> => axios.post(`${baseUrl}/user/edit`, data);

const register = (data: any): Promise<AxiosResponse> => axios.post(`${baseUrl}/register`, data);

export default {
  editUser,
  register,
};
