import type { QueryParams, ResponseData } from "./global";

export interface ParamListProductInventory extends QueryParams {
    keyword?: string;
    outlet_id?: number;
}

export interface ProductInventory {
    id: number;
    name: string;   
    stock: number;
    stock_min: number;
    unit: string;
    description: string;
}

export interface ProductInventoryResponse extends ProductInventory {
    
}

export interface ParamDeleteProductInventory {
    id: number;
    reason: string;
}

export type GetListProductInventoryRequest = (param: ParamListProductInventory) => Promise<ResponseData<ProductInventoryResponse[]>>;
export type PostProductInventoryRequest = (param: ProductInventory) => Promise<ResponseData<ProductInventoryResponse>>;
export type PutProductInventoryRequest = (param: ProductInventory) => Promise<ResponseData<ProductInventoryResponse>>;
export type DeleteProductInventoryRequest = (param: ParamDeleteProductInventory) => Promise<ResponseData<any>>;
export type PutUpdateStockRequest = (param: any) => Promise<ResponseData<any>>;
