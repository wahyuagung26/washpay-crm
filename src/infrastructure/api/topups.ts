import { axiosx } from "src/utils";

import type { GetListTopUpRequest, PutApprovalTopUpRequest } from "../type";

export const getListTopUp: GetListTopUpRequest = async (params) => {
  const response = await axiosx(true).get('/api/crm/v1/topups', { params });
  return response.data;
};

export const putApprovalTopUp: PutApprovalTopUpRequest = async (payload) => {
  const response = await axiosx(true).put(`/api/crm/v1/topups/${payload.id}/approval`, payload);
  return response.data;
};