import { axiosx } from "src/utils";

import type { GetBankAccounts } from "../type";

export const getListBankAccounts: GetBankAccounts = async () => {
    const response = await axiosx(true).get('/api/v1/master-data/bank-accounts');
    return response.data;
};