/* eslint-disable no-param-reassign */
import axios from 'axios';
import { clearAuthToken, getAuthTokenLocalStorage } from '../../helpers/LocalStorageHelper';

const instance = axios.create({
  timeout: 10000,
  params: {}, // do not remove this, its added to add params later in the config
});

// Add a request interceptor
instance.interceptors.request.use(
  async config => {
    const token = getAuthTokenLocalStorage();

    if (token) {
      config.headers.common.authorization = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response.status === 401) {
      clearAuthToken();
      window.location.href = '/login';
      return false;
    }
    return Promise.reject(error);
  }
);

const ApiService = {
  getData(url) {
    return instance.get(url);
  },
  postData(url, data) {
    return instance.post(url, data);
  },
  putData(url, data) {
    return instance.put(url, data);
  },
  patchData(url, data) {
    return instance.patch(url, data);
  },
  deleteData(url) {
    return instance.delete(url);
  },
};

export default ApiService;