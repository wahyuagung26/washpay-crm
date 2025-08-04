import type { QueryParams, ResponseData } from "./global";

export interface ParamListTransaction extends QueryParams {
    keyword?: string;
    outlet_id?: number | string;
    status?: string;
}

export interface TransactionResponse {
    id: number;
    code: string;
    customer: {
        id: number;
        name: string;
        phone: string | null;
    };
    outlet: {
        id: number;
        name: string;
        address: string;
        phone: string | null;
    },
    is_discount: boolean;
    discount_type: string | null;
    discount_nominal: number | null;
    total_price: number;
    total_final: number;
    total_payment_cash: number | null;
    total_payment_debt: number | null;
    is_payment_complete: boolean;
    payment_type: string;
    payment_method_id: number | null;
    payment_method_name: string | null;
    payment_method_type: string | null;
    completed_at: string | null; // format: YYYY-MM-DD HH:mm:ss
    estimation_day: number;
    estimation_date: string;
    last_notes: string;
    is_priority: boolean;
    status: string;
    created: {
        id: number;
        name: string;
        at: string;
    }
    items: Array<{
        id: number;
        product_id: number;
        name: string;
        qty: number;
        price: number;
    }> | null;
    inventory: Array<{
        id: number;
        product_id: number;
        name: string;
        qty: number;
    }> | null;
}
export interface PayloadCreateTransaction {
    customer_id: number;
    is_discount: boolean;
    discount_type: string | null;
    discount_nominal: number | null;
    total_price: number;
    total_final: number;
    payment_type: string;
    payment_method_id: number | null;
    estimation_day: number;
    notes: string;
    is_priority: boolean;
    items: Array<{
        product_id: number;
        qty: number;
        price: number;
    }>;
}

export interface PayloadUpdateTransactionStatus {
    id: number;
    status: string;
    notes?: string;
    payment_method_id?: number | null;
}

export interface PayloadUpdateTransactionInventory {
    items: Array<{
        product_id: number;
        name: string;
        qty: number;
    }>;
    transaction_id: number;
}

export interface PayloadUpdateTransactionNotes {
    id: number;
    notes: string;
}

export interface TransactionHistoryResponse {
    id: number;
    transaction_id: number;
    title: string;
    activity: string;
    created_user_name: string;
    created_user_id: number;
    created_at: string;
}

export interface PayloadPrintReceipt {
  type: "transaction";
  data: {
    outlet_name: string;
    outlet_address: string;
    outlet_phone: string;
    order_code: string;
    completed_at: string; // format: DD/MM/YYYY HH:mm:ss
    cashier_name: string;
    last_note: string;
    payment_method_name: string;
    items: {
      name: string;
      qty: string;
      price: string;
      sub_total: string;
    }[];
    discount_nominal: string;
    total_final: string;
  };
}

export interface PayloadPrintLabel {
  type: "label";
  data: {
    customer_name: string;
    order_code: string;
    created_at: string; // format: DD/MM/YYYY HH:mm:ss
    estimation_day: number;
    estimation_date: string; // format: DD/MM/YYYY
    payment_type: string;
    total_final: number;
    last_notes: string;
    items: {
      name: string;
      qty: string;
    }[];
  };
}

export type GetListTransactionRequest = (param: ParamListTransaction) => Promise<ResponseData<TransactionResponse[]>>;
export type GetTransactionRequest = (id: number) => Promise<ResponseData<TransactionResponse>>;
export type GetTransactionHistoriesRequest = (id: number) => Promise<ResponseData<TransactionHistoryResponse[]>>;
export type PostTransactionRequest = (param: PayloadCreateTransaction) => Promise<ResponseData<any>>;
export type PatchTransactionStatusRequest = (param: PayloadUpdateTransactionStatus) => Promise<ResponseData<any>>;
export type PatchTransactionInventoryRequest = (param: PayloadUpdateTransactionInventory) => Promise<ResponseData<any>>;
export type PatchTransactionNotesRequest = (param: PayloadUpdateTransactionNotes) => Promise<ResponseData<any>>;
export type GetPaymentMethodsRequest = () => Promise<ResponseData<{ id: number; name: string; type: string }[]>>;