import { axiosx } from "src/utils";

import type { PostDepositRequest, GetListDepositRequest, GetDetailDepositRequest, GetPendingDepositRequest, PutEvidenceDepositRequest } from "../type";

export const postDepositRequest: PostDepositRequest = async (param) => {
    const response = await axiosx(true).post('/api/v1/deposits', param);
    return response.data;
}

export const putEvidenceDepositRequest: PutEvidenceDepositRequest = async (param) => {
    const response = await axiosx(true).put(`/api/v1/deposits/${param.id}/evidences`, param);
    return response.data;
}

export const getDetailDeposit: GetDetailDepositRequest = async (id) => {
    const response = await axiosx(true).get(`/api/v1/deposits/${id}`);
    return response.data;
}

export const getListDeposit: GetListDepositRequest = async (filter) => {
    const response = await axiosx(true).get('/api/v1/deposits', {
        params: filter,
    })
    return response.data;
}

export const getPendingDeposit: GetPendingDepositRequest = async () => {
    const response = await axiosx(true).get(`/api/v1/deposits/pending`);
    return response.data;
}