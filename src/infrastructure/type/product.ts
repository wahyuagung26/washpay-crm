import type { QueryParams, ResponseData } from "./global";

export interface ParamListProduct extends QueryParams {
    keyword?: string;
    category_id?: number | string;
    outlet_id?: number | string;
}

export interface ParamListProductCategories {
    keyword?: string;
}

export interface Product {
    id: number;
    name: string;   
    category: {
        id: number;
        name: string;
    };
    price: number;
}

export interface ProductResponse extends Product {
    
}

export interface ParamDeleteProduct {
    id: number;
    reason: string;
}

export interface ProductCategoriesResponse {
    id: number;
    name: string;
    type: string;
}

export type GetListProductRequest = (param: ParamListProduct) => Promise<ResponseData<ProductResponse[]>>;
export type PostProductRequest = (param: Product) => Promise<ResponseData<ProductResponse>>;
export type PutProductRequest = (param: Product) => Promise<ResponseData<ProductResponse>>;
export type DeleteProductRequest = (param: ParamDeleteProduct) => Promise<ResponseData<any>>;
export type GetListProductCategoriesRequest = (param: ParamListProductCategories) => Promise<ResponseData<ProductCategoriesResponse[]>>;