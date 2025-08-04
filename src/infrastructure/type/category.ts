import type { QueryParams, ResponseData } from "./global";

export interface ParamListCategory extends QueryParams {
    type?: "inventory" | "product" | "cashout";
}

export interface CategoryResponse {
    id: number;
    name: string;
}

export type GetListCategoryRequest = (param: ParamListCategory) => Promise<ResponseData<CategoryResponse[]>>;
