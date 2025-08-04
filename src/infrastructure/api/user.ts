import { axiosx } from "src/utils";

import type { PutUserRequest, RegisterRequest, PostUserRequest, GetProfileRequest, DeleteUserRequest, GetListUserRequest } from "../type";

export const postRegister: RegisterRequest = async (payload) => {
    const response = await axiosx(false).post('/api/v1/users/register', payload);
    return response.data;
};

export const getProfile: GetProfileRequest = async () => {
    const response = await axiosx(true).get('/api/v1/users/profile');
    return response.data;
};

export const postUser: PostUserRequest = async (payload) => {
    const response = await axiosx(true).post('/api/v1/users', payload);
    return response.data;
};

export const putUser: PutUserRequest = async (payload) => {
    const response = await axiosx(true).put(`/api/v1/users/${payload.id}`, payload);
    return response.data;
};

export const deleteUser: DeleteUserRequest = async (payload) => {
    const response = await axiosx(true).delete(`/api/v1/users/${payload.id}`, { data: payload });
    return response.data;
};

export const getListUser: GetListUserRequest = async (payload) => {
    const response = await axiosx(true).get('/api/v1/users', {
        params: payload,
    });
    return response.data;
};