import type { QueryParams, ResponseData } from "./global";

export interface ParamListOutlet extends QueryParams {
    keyword?: string;
}

export interface Outlet {
    id: number;
    name: string;   
    phone_number: string;
    address: string;
    print_footer_note: string | null;
    logo_url: string | null;
}

export interface OutletResponse extends Outlet {
    
}

export interface ParamDeleteOutlet {
    id: number;
    reason: string;
}

export type GetListOutletRequest = (param: ParamListOutlet) => Promise<ResponseData<OutletResponse[]>>;
export type PostOutletRequest = (param: Outlet) => Promise<ResponseData<OutletResponse>>;
export type PutOutletRequest = (param: Outlet) => Promise<ResponseData<OutletResponse>>;
export type DeleteOutletRequest = (param: ParamDeleteOutlet) => Promise<ResponseData<any>>;