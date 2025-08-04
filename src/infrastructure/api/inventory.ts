import { axiosx } from "src/utils";

import type { PutUpdateStockRequest , PutProductInventoryRequest, PostProductInventoryRequest, DeleteProductInventoryRequest, GetListProductInventoryRequest } from './../type/inventory';

export const postProductInventory: PostProductInventoryRequest = async (payload) => {
    const response = await axiosx(true).post('/api/v1/inventory', payload);
    return response.data;
};

export const putProductInventory: PutProductInventoryRequest = async (payload) => {
    const response = await axiosx(true).put(`/api/v1/inventory/${payload.id}`, payload);
    return response.data;
};

export const deleteProductInventory: DeleteProductInventoryRequest = async (payload) => {
    const response = await axiosx(true).delete(`/api/v1/inventory/${payload.id}`, { data: payload });
    return response.data;
};

export const getListProductInventory: GetListProductInventoryRequest = async (payload) => {
    const response = await axiosx(true).get('/api/v1/inventory', {
        params: payload,
    });
    return response.data;
};

export const patchUpdateStockRequest: PutUpdateStockRequest = async (payload) => {
    const response = await axiosx(true).patch(`/api/v1/inventory/${payload?.id}/stocks`, payload);
    return response.data;
}