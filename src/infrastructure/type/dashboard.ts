import type { ResponseData } from "./global";

export interface SummaryTransaction {
    total_transaction: number;
    total_revenue: number;
}

export interface SummaryResponse {
    today: SummaryTransaction;
    this_month: SummaryTransaction;
}

export interface ClientStatusResponse {
    client_balance: number;
    subscription_package_name: string;
    subscription_expired_at: string;
    total_outlets: number;
    total_users: number;
}

export type GetSummary = () => Promise<ResponseData<SummaryResponse>>;
export type GetClientStatus = () => Promise<ResponseData<ClientStatusResponse>>;
export type GetOutletPerformance = (type: 'transaction' | 'revenue') => Promise<ResponseData<any>>;
