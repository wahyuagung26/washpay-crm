import { axiosx } from "src/utils";

import type { GetTransactionRequest, PostTransactionRequest, GetListTransactionRequest, PatchTransactionStatusRequest, GetTransactionHistoriesRequest, PatchTransactionInventoryRequest } from "../type";

export const getListTransaction: GetListTransactionRequest = async (payload) => {
    const response = await axiosx(true).get('/api/v1/transactions', {
        params: payload,
    });
    return response.data;
};

export const getTransaction: GetTransactionRequest = async (id) => {
    const response = await axiosx(true).get(`/api/v1/transactions/${id}`);
    return response.data;
};

export const postTransaction: PostTransactionRequest = async (payload) => {
    const response = await axiosx(true).post('/api/v1/transactions', payload);
    return response.data;
};

export const patchUpdateTransactionStatus: PatchTransactionStatusRequest = async (payload) => {
    const response = await axiosx(true).patch(`/api/v1/transactions/${payload.id}/status`, payload);
    return response.data;
};

export const patchUpdateTransactionNotes: PatchTransactionStatusRequest = async (payload) => {
    const response = await axiosx(true).patch(`/api/v1/transactions/${payload.id}/notes`, {
        notes: payload.notes
    });
    return response.data;
};

export const patchUpdateInventory: PatchTransactionInventoryRequest = async (payload) => {
    const response = await axiosx(true).patch(`/api/v1/transactions/${payload.transaction_id}/inventory`, {
        items: payload.items
    });
    return response.data;
};

export const getTransactionHistories: GetTransactionHistoriesRequest = async (id: number) => {
    const response = await axiosx(true).get(`/api/v1/transactions/${id}/histories`);
    return response.data;
}

export const getPaymentMethods = async () => {
    const response = await axiosx(true).get('/api/v1/payment-methods');
    return response.data;
};