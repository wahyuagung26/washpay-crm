import axios from 'axios';
import { toast } from 'sonner';

import { CONFIG } from 'src/global-config';
import { getToken, clearStorage, getWorkspace } from 'src/modules/auth/context/jwt';

const jwtPrefix = 'Bearer';

export const axiosx = (auth: boolean = true, params?: string) => {
  const instance = axios.create();
    instance.defaults.baseURL = CONFIG.apiUrl;

  instance.interceptors.request.use(
    async (config) => {
      if (auth || params) {
        const token = getToken() ?? params;
        const workspace = getWorkspace();
        if (!token) return config;
        config.headers.Authorization = `${jwtPrefix} ${token}`;
        if (workspace) {
          config.headers['x-workspace-id'] = `${workspace?.id}`;
        }
      }

      return config;
    }
  );

  instance.interceptors.response?.use(
    (response) => response,
    async (error) => {
      if (error?.response && error?.response?.status === 401) {
        clearToken();
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

const clearToken = () => {
  clearStorage();
  toast.error('Session expired', {
    id: 'error',
    description: 'Session expired! Please login again to continue',
    position: 'bottom-center',
  });
  window.location.href = '/';
};
