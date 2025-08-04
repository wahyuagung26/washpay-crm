import type { ResponseData } from "./global";

export interface PayloadLogin {
    email: string;
    password: string;
}

export type LoginRequest = (param: PayloadLogin) => Promise<ResponseData<any>>;
