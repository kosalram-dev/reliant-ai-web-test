/*
  This module contains utility functions for making API calls using Axios.
  It includes functions for setting up the client, making API calls, and handling responses/errors.
*/

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const baseHeaders: Record<string, string> = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const checkAuth = async (): Promise<{
  refreshToken: string | null;
  authToken: string | null;
}> => {
  const authToken = await localStorage.getItem('authToken');
  const refreshToken = await localStorage.getItem('refreshToken');
  return {
    authToken,
    refreshToken,
  };
};

export const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

export interface ApiCallParams extends AxiosRequestConfig {
  method: string;
}

export const apiCall = async (
  params: ApiCallParams,
): Promise<AxiosResponse> => {
  const data: AxiosRequestConfig = await formData(params);

  if (!data.url) {
    throw new Error('URL is undefined in request parameters.');
  }

  switch (params.method) {
    case 'GET':
      return client.get(data.url, data);
    case 'POST':
      return client.post(data.url, data.data, data);
    case 'PUT':
      return client.put(data.url, data.data, data);
    case 'DELETE':
      return client.delete(data.url, { data: data.data, ...data });
    case 'PATCH':
      return client.patch(data.url, data.data, data);
    default:
      throw new Error('Invalid method provided.');
  }
};

const formData = async (
  data: AxiosRequestConfig = {},
): Promise<AxiosRequestConfig> => {
  if (
    data.headers &&
    Object.keys(data.headers).length > 0 &&
    data.headers['Content-Type']
  ) {
    switch (data.headers['Content-Type']) {
      case 'application/x-www-form-urlencoded':
        data.data = `${encodeURIComponent(JSON.stringify(data.data))}`;
        break;
      case 'application/json': {
        if (
          data.method === 'GET' &&
          data.params &&
          Object.keys(data.params).length > 0
        ) {
          let queryParams = '';
          let count = 0;
          for (const key in data.params) {
            if (
              typeof data.params[key] === 'string' ||
              typeof data.params[key] === 'number'
            ) {
              queryParams += `${key}=${encodeURIComponent(data.params[key])}${
                Object.keys(data.params).length - 1 > count ? '&' : ''
              }`;
            } else if (typeof data.params[key] === 'object') {
              queryParams += `${key}=${encodeURIComponent(
                JSON.stringify(data.params[key]),
              )}`;
            }
            count += 1;
          }
          data.url += `?${queryParams}`;
        }
        break;
      }
      case 'multipart/form-data': {
        const formData = new FormData();
        for (const [key, value] of Object.entries(data.data)) {
          if (typeof value === 'string') {
            formData.append(key, value);
          } else if (value instanceof Blob) {
            formData.append(key, value);
          } else {
            throw new Error(`Unsupported value type for key ${key}`);
          }
        }
        data.data = formData;
        break;
      }
      default:
        break;
    }
  } else {
    data.headers = baseHeaders;
  }
  const { authToken } = await checkAuth();

  if (data.withCredentials) {
    client.defaults.headers.common.Authorization = `Bearer ${authToken}`;
  } else {
    client.defaults.headers.common.Authorization = null;
  }

  client.defaults.headers.common['X-RapidAPI-Key'] = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
  client.defaults.headers.common['X-RapidAPI-Host'] = process.env.NEXT_PUBLIC_RAPIDAPI_HOST;
  return data;
};

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (
      error &&
      error.response &&
      error.response.status &&
      parseInt(error.response.status.toString(), 10) > 205
    ) {
      switch (error.response.status) {
        case 401:
          throw error.response.data;
        case 422:
          throw error.response.data;
        case 409:
          throw error.response.data;
        case 404:
          throw error.response.data;
        case 500:
          throw error.response.data;
        case 400:
          throw error.response.data;
        default:
          throw new Error(
            'Something went wrong. Please check your information and try again.',
          );
      }
    }
    throw error;
  },
);
