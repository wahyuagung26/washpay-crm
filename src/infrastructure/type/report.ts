import type { ResponseData } from "./global";

export interface ReportFinanceResponse {
    total_payment: number;
    gross_revenue: number;
    unpaid_order: number;
    total_expense: number;
    net_profit: number;
    total_cash_payment: number;
    total_cashless_payment: number;
}

export interface ReportCashoutResponse {
    transaction_category_name: string;
    description: string;
    date: string;
    amount: number;
}

export interface ReportTransactionResponse {
    code: string;
    payment_type_name: string;
    customer_name: string;
    date: string;
    amount: number;
}

export interface ReportPaymentResponse {
    order_code: string;
    payment_method_name: string;
    customer_name: string;
    date: string;
    amount: number;
}

export interface PeriodFilter {
    start_date: string;
    end_date: string;
}

export interface ParamReportCashout extends PeriodFilter {
    transaction_category_id: number;
}

export interface ParamReportTransaction extends PeriodFilter {
    customer_id: number;
    payment_type?: string;
}

export interface ParamReportPayment extends PeriodFilter {
    customer_id: number;
    payment_method_id?: number;
}

export type GetReportFinance = (period: PeriodFilter) => Promise<ResponseData<ReportFinanceResponse>>;
export type GetReportCashout = (period: ParamReportCashout) => Promise<ResponseData<ReportCashoutResponse[]>>;
export type GetReportTransaction = (period: ParamReportTransaction) => Promise<ResponseData<ReportTransactionResponse[]>>;
export type GetReportPayment = (period: ParamReportPayment) => Promise<ResponseData<ReportPaymentResponse[]>>;
