import { axiosx } from "src/utils";

import type { GetListCategoryRequest } from "../type";

export const getListCategory: GetListCategoryRequest = async (param) => {
    const response = await axiosx(true).get('/api/v1/categories/' + param.type);
    return response.data;
};