import { axiosx } from "src/utils";

import type { GetListRoleRequest } from "../type";

export const getListRole: GetListRoleRequest = async (payload) => {
    const response = await axiosx(true).get('/api/v1/roles', {
        params: payload,
    });
    return response.data;
};