import type { QueryParams, ResponseData } from "./global";

export interface ParamListCustomer extends QueryParams {
    keyword?: string;
}

export interface Customer {
    id: number;
    name: string;   
    phone_number: string;
    address: string;
}

export interface CustomerResponse extends Customer {
    
}

export interface ParamDeleteCustomer {
    id: number;
    reason: string;
}

export type GetListCustomerRequest = (param: ParamListCustomer) => Promise<ResponseData<CustomerResponse[]>>;
export type PostCustomerRequest = (param: Customer) => Promise<ResponseData<CustomerResponse>>;
export type PutCustomerRequest = (param: Customer) => Promise<ResponseData<CustomerResponse>>;
export type DeleteCustomerRequest = (param: ParamDeleteCustomer) => Promise<ResponseData<any>>;