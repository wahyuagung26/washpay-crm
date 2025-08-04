import type { QueryParams, ResponseData } from "./global";

export interface ParamListCashOut extends QueryParams {
    keyword?: string;
    outlet_id?: number;
    category_id?: number;
}

export interface CashOut {
    id: number;
    category: {
        id: number;
        name: string;
    };
    category_id: number;
    description: string;
    amount: number;
    created?: {
        at: string;
    };
}

export interface CashOutResponse extends CashOut {
    
}

export interface ParamDeleteCashOut {
    id: number;
    reason: string;
}

export type GetListCashOutRequest = (param: ParamListCashOut) => Promise<ResponseData<CashOutResponse[]>>;
export type PostCashOutRequest = (param: CashOut) => Promise<ResponseData<CashOutResponse>>;
export type PutCashOutRequest = (param: CashOut) => Promise<ResponseData<CashOutResponse>>;
export type DeleteCashOutRequest = (param: ParamDeleteCashOut) => Promise<ResponseData<any>>;