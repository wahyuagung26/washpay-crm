import type { ResponseData } from "./global";

export interface UploadSinglePayload {
    file: File;
    folder?: string;
}

export interface UploadMultiplePayload {
    files: File[];
    folder?: string;
}

export interface UploadResponse {
    url: string;
    filename: string;
    size: number;
    mime_type: string;
    path: string;
}

export interface UploadMultipleResponse {
    files: UploadResponse[];
}

export interface DeleteFilePayload {
    url: string;
}

export interface CheckFilePayload {
    filename: string;
    checksum?: string;
}

export interface CheckFileResponse {
    exists: boolean;
    url?: string;
    filename?: string;
    size?: number;
    mime_type?: string;
}

export type PostUploadSingleRequest = (payload: UploadSinglePayload) => Promise<ResponseData<UploadResponse>>;
export type PostUploadMultipleRequest = (payload: UploadMultiplePayload) => Promise<ResponseData<UploadMultipleResponse>>;
export type DeleteFileRequest = (payload: DeleteFilePayload) => Promise<ResponseData<null>>;
export type PostCheckFileRequest = (payload: CheckFilePayload) => Promise<ResponseData<CheckFileResponse>>;