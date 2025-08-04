import { axiosx } from "src/utils";

import type { GetSummary } from "../type";

export const getSummary: GetSummary = async () => {
    const response = await axiosx(true).get('/api/v1/dashboard/summary');
    return response.data;
};

export const getOutletPerformance = async (type: 'transaction' | 'revenue') => {
    const response = await axiosx(true).get(`/api/v1/dashboard/outlets-performance/${type}`);
    return response.data;
};

export const getClientStatus = async () => {
    const response = await axiosx(true).get(`/api/v1/dashboard/client-status`);
    return response.data;
};