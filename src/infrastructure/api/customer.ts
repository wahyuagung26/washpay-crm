import { axiosx } from "src/utils";

import type { PutCustomerRequest, PostCustomerRequest, DeleteCustomerRequest, GetListCustomerRequest } from "../type/customer";

export const postCustomer: PostCustomerRequest = async (payload) => {
    const response = await axiosx(true).post('/api/v1/customers', payload);
    return response.data;
};

export const putCustomer: PutCustomerRequest = async (payload) => {
    const response = await axiosx(true).put(`/api/v1/customers/${payload.id}`, payload);
    return response.data;
};

export const deleteCustomer: DeleteCustomerRequest = async (payload) => {
    const response = await axiosx(true).delete(`/api/v1/customers/${payload.id}`, { data: payload });
    return response.data;
};

export const getListCustomer: GetListCustomerRequest = async (payload) => {
    const response = await axiosx(true).get('/api/v1/customers', {
        params: payload,
    });
    return response.data;
};
