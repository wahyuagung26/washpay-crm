import { axiosx } from "src/utils";

import type { GetListClientRequest } from "../type";

export const getListClients: GetListClientRequest = async (params) => {
  const response = await axiosx(true).get('/api/crm/v1/clients', { params });
  return response.data;
};