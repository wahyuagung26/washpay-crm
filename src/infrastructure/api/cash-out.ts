import { axiosx } from "src/utils";

import type { PutCashOutRequest, PostCashOutRequest, DeleteCashOutRequest, GetListCashOutRequest } from "../type/cash-out";

export const postCashOut: PostCashOutRequest = async (payload) => {
    const response = await axiosx(true).post('/api/v1/cash-outs', payload);
    return response.data;
};

export const putCashOut: PutCashOutRequest = async (payload) => {
    const response = await axiosx(true).put(`/api/v1/cash-outs/${payload.id}`, payload);
    return response.data;
};

export const deleteCashOut: DeleteCashOutRequest = async (payload) => {
    const response = await axiosx(true).delete(`/api/v1/cash-outs/${payload.id}`, { data: payload });
    return response.data;
};

export const getListCashOut: GetListCashOutRequest = async (payload) => {
    const response = await axiosx(true).get('/api/v1/cash-outs', {
        params: payload,
    });
    return response.data;
};
