import { axiosx } from "src/utils";

import type { LoginRequest } from "../type/auth";

export const postLogin :LoginRequest= async (payload) => {
  const response = await axiosx(true).post('/api/v1/auth/login', payload);
  return response.data;
};