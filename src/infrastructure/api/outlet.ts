import { axiosx } from "src/utils";

import type { PutOutletRequest, PostOutletRequest, DeleteOutletRequest, GetListOutletRequest } from "../type/outlet";

export const postOutlet: PostOutletRequest = async (payload) => {
    const response = await axiosx(true).post('/api/v1/outlets', payload);
    return response.data;
};

export const putOutlet: PutOutletRequest = async (payload) => {
    const response = await axiosx(true).put(`/api/v1/outlets/${payload.id}`, payload);
    return response.data;
};

export const deleteOutlet: DeleteOutletRequest = async (payload) => {
    const response = await axiosx(true).delete(`/api/v1/outlets/${payload.id}`, { data: payload });
    return response.data;
};

export const getListOutlet: GetListOutletRequest = async (payload) => {
    const response = await axiosx(true).get('/api/v1/outlets', {
        params: payload,
    });
    return response.data;
};
