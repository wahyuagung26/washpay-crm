import { axiosx } from "src/utils";

import type { GetReportCashout, GetReportFinance, GetReportPayment, GetReportTransaction } from "../type";

export const getFinanceSummary: GetReportFinance = async (period) => {
    const response = await axiosx(true).get(`/api/v1/reports/finance-summary`, { params: period });
    return response.data;
};

export const getReportCashout: GetReportCashout = async (filter) => {
    const response = await axiosx(true).get(`/api/v1/reports/cash-out`, { params: filter });
    return response.data;
};

export const getReportTransaction: GetReportTransaction = async (filter) => {
    const response = await axiosx(true).get(`/api/v1/reports/transactions`, { params: filter });
    return response.data;
};

export const getReportPayment: GetReportPayment = async (filter) => {
    const response = await axiosx(true).get(`/api/v1/reports/payments`, { params: filter });
    return response.data;
};