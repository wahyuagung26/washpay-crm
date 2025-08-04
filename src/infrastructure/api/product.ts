import { axiosx } from "src/utils";

import type { PutProductRequest, PostProductRequest, DeleteProductRequest, GetListProductRequest, GetListProductCategoriesRequest } from "../type/product";

export const postProduct: PostProductRequest = async (payload) => {
    const response = await axiosx(true).post('/api/v1/products', payload);
    return response.data;
};

export const putProduct: PutProductRequest = async (payload) => {
    const response = await axiosx(true).put(`/api/v1/products/${payload.id}`, payload);
    return response.data;
};

export const deleteProduct: DeleteProductRequest = async (payload) => {
    const response = await axiosx(true).delete(`/api/v1/products/${payload.id}`, { data: payload });
    return response.data;
};

export const getListProduct: GetListProductRequest = async (payload) => {
    const response = await axiosx(true).get('/api/v1/products', {
        params: payload,
    });
    return response.data;
};

export const getListProductCategories: GetListProductCategoriesRequest = async (payload) => {
    const response = await axiosx(true).get('/api/v1/categories/product', {
        params: payload,
    });
    return response.data;
};
