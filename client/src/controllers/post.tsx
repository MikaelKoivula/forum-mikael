import axios, { AxiosResponse } from 'axios';

const baseUrl = process.env.NODE_ENV !== 'development' ? '/api' : 'http://localhost:3001/api';

const getPost = (data: any): Promise<AxiosResponse> => axios.get(`${baseUrl}/post/${data.params.id}`, data);

const getPosts = (id: string): Promise<AxiosResponse> => axios.get(`${baseUrl}/posts/${id}`);

const addPost = (data: any): Promise<AxiosResponse> => axios.post(`${baseUrl}/posts/create`, data);

const editPost = (data: any): Promise<AxiosResponse> => axios.post(`${baseUrl}/posts/${data.id}/edit/${data.postId}`, data);

const deletePost = (data: any): Promise<AxiosResponse> => axios.delete(`${baseUrl}/posts/${data.data.id}/delete`, data);

export default {
  addPost,
  deletePost,
  editPost,
  getPost,
  getPosts,
};
