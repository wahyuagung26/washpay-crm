import type { QueryParams, ResponseData } from "./global";

export interface ClientResponse {
    id: string;
    name: string;
    owner_name: string;
    owner_phone: string;
    subscription_name: string;
    subscription_expired_at: string;
    balance: number;
    total_outlet: number;
    total_user: number;
    total_transaction_today: number;
    created_at: string;
}

export interface ParamListClient extends QueryParams {
    keyword?: string;
}

export type GetListClientRequest = (param: ParamListClient) => Promise<ResponseData<ClientResponse[]>>;