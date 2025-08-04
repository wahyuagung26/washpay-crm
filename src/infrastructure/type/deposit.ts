import type { QueryParams, ResponseData } from "./global";

export interface ParamListDeposit extends QueryParams {
    keyword?: string;
    status?: '0' | '1' | '2' | '3'; // 0: pending, 1: success, 2: failed, 3: cancelled
}

export interface DepositResponse {
    id: number;
    bank_accounts_id: number;
    amount: number;
    unique_code: string;
    approved_amount: number;
    source_bank_name: string;
    source_account_number: string;
    source_account_holder_name: string;
    destination_bank_name: string;
    destination_account_number: string;
    destination_account_holder_name: string;
    status_text: string;
    status_notes: string;
    status: number;
    created_at: string;
}

export interface PayloadDeposit {
    bank_accounts_id: number;
    amount: number;
    unique_code: string;
}

export interface PayloadConfirmTransfer {
    id: number;
    source_bank_name: string;
    source_account_number: string;
    source_account_holder_name: string;
}


export interface ParamDeleteDeposit {
    id: number;
    reason: string;
}

export type GetListDepositRequest = (param: ParamListDeposit) => Promise<ResponseData<DepositResponse[]>>;
export type GetDetailDepositRequest = (id: number) => Promise<ResponseData<DepositResponse>>;
export type GetPendingDepositRequest = () => Promise<ResponseData<DepositResponse[]>>;
export type PostDepositRequest = (param: PayloadDeposit) => Promise<ResponseData<DepositResponse>>;
export type PutEvidenceDepositRequest = (param: PayloadConfirmTransfer) => Promise<ResponseData<DepositResponse>>;
