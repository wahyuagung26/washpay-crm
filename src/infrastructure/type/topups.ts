import type { QueryParams, ResponseData } from "./global";

export interface TopUpResponse {
    id: number;
    code: string;
    net_amount: number;
    approved_amount: number;
    status: number;
    status_text: string;
    status_notes: string;
    destination_bank_name: string;
    destination_account_number: string;
    destination_account_holder_name: string;
    source_bank_name: string;
    source_account_number: string;
    source_account_holder_name: string;
    update_evidence_at: string;
    processed_at: string;
    processed_by: string;
    client_name: string;
    client_id: string;
    owner_name: string;
    owner_phone: string;
}

export interface PayloadApprovalTopUp {
    id: number;
    status: number;
    status_notes: string;
    approved_amount: number;
}

export interface ParamListTopUp extends QueryParams {
    keyword?: string;
}

export type GetListTopUpRequest = (param: ParamListTopUp) => Promise<ResponseData<TopUpResponse[]>>;
export type PutApprovalTopUpRequest = (payload: PayloadApprovalTopUp) => Promise<ResponseData<TopUpResponse>>;