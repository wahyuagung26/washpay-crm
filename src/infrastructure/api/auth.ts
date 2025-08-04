import { axiosx } from "src/utils";

import type { LoginRequest, PostResetPasswordRequest, PostUpdatePasswordRequest } from "../type";

export const postLogin :LoginRequest= async (payload) => {
  const response = await axiosx(true).post('/api/v1/auth/login', payload);
  return response.data;
};

export const postResetPassword: PostResetPasswordRequest = async (payload) => {
  const response = await axiosx(true).post('/api/v1/auth/reset-password', payload);
  return response.data;
};

export const postUpdatePassword: PostUpdatePasswordRequest = async (payload) => {
  const response = await axiosx(true).post('/api/v1/auth/update-password', payload);
  return response.data;
};