import type { QueryParams, ResponseData } from "./global";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export interface RegisterPayload {
    user: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        phone_number: string;
    };
    client: {
        name: string;
        phone_number: string;
        address: string;
    };
}

export interface RegisterResponse {
    user: {
        id: number;
        name: string;
        email: string;
        email_verified_at: string | null;
        phone_number: string;
        client_id: number;
        user_role_id: number;
    },
    client: {
        id: number;
        name: string;
        phone_number: string;
        address: string;
        owner_user_id: string;
        subscription_package_id: number;
        subscription_cycle: string | null;
        subscription_expired_at: string | null;
        balance: number;
    }
}

interface AccessOutlet {
    id: number;
    name: string;
    logo: string | null;
}
export interface ProfileResponse {
    id: number;
    name: string;
    email: string;
    access_outlets: AccessOutlet[];
}

export type LoginRequest = (payload: LoginPayload) => Promise<ResponseData<LoginResponse>>;

export type RegisterRequest = (payload: RegisterPayload) => Promise<ResponseData<RegisterResponse>>;

export type GetProfileRequest = () => Promise<ResponseData<ProfileResponse>>;

export interface ParamListUser extends QueryParams {
    keyword?: string;
}

export interface User {
    id?: number;
    name: string;   
    email: string;
    password?: string;
    password_confirmation?: string;
    phone_number: string;
    user_role_id: number;
}

export interface UserResponse extends User {
    
}

export interface ListUserResponse extends User {
    role: {
        id: number;
        name: string
    };
}

export interface ParamDeleteUser {
    id: number;
    reason: string;
}

export interface PayloadUpdatePassword {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;

}

export type PostResetPasswordRequest = (payload: { email: string }) => Promise<ResponseData<any>>;
export type PostUpdatePasswordRequest = (payload: PayloadUpdatePassword) => Promise<ResponseData<any>>;
export type GetListUserRequest = (param: ParamListUser) => Promise<ResponseData<ListUserResponse[]>>;
export type PostUserRequest = (param: User) => Promise<ResponseData<UserResponse>>;
export type PutUserRequest = (param: User) => Promise<ResponseData<UserResponse>>;
export type DeleteUserRequest = (param: ParamDeleteUser) => Promise<ResponseData<any>>;
