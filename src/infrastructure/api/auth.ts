import { axiosx } from "src/utils";

import type { LoginRequest } from "../type/auth";

export const postLogin :LoginRequest= async (payload) => {
  const response = await axiosx(true).post('/api/crm/v1/auth/login', payload);
  return response.data;
};

export const getProfile = async () => {
  const response = await axiosx(true).get('/api/crm/v1/auth/profile');
  return response.data;
};
