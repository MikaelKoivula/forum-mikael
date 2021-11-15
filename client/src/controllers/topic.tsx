import axios, { AxiosResponse } from 'axios';

const baseUrl = process.env.NODE_ENV !== 'development' ? '/api/topics' : 'http://localhost:3001/api/topics';

const getAll = (): Promise<AxiosResponse> => axios.get(baseUrl).then((res: AxiosResponse) => res);

const deleteTopic = (id: string): Promise<AxiosResponse> => axios.delete(`${baseUrl}/delete`, {
  data: {
    id,
  },
});

const createTopic = (topic: Record<string, unknown>): Promise<AxiosResponse> => axios.post(`${baseUrl}/create`, topic);

export default {
  getAll,
  deleteTopic,
  createTopic,
};
