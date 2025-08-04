import type { QueryParams, ResponseData } from "./global";

export interface ParamListRole extends QueryParams {
    keyword?: string;
}

export interface RoleResponse {
    id: number;
    name: string;
}

export type GetListRoleRequest = (param: ParamListRole) => Promise<ResponseData<RoleResponse[]>>;
