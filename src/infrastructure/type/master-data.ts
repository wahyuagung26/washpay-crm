import type { ResponseData } from "./global";

export interface BankAccountResponse {
    id: number;
    bank_name: string;
    account_number: string;
    account_holder_name: string;
}

export type GetBankAccounts = () => Promise<ResponseData<BankAccountResponse[]>>;
