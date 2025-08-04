import { axiosx } from "src/utils";

import type { DeleteFileRequest, PostCheckFileRequest, PostUploadSingleRequest, PostUploadMultipleRequest } from "../type";

export const postUploadSingle: PostUploadSingleRequest = async (payload) => {
    const formData = new FormData();
    formData.append('file', payload.file);
    if (payload.folder) {
        formData.append('folder', payload.folder);
    }

    const response = await axiosx(true).post('/api/v1/uploads/single', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const postUploadMultiple: PostUploadMultipleRequest = async (payload) => {
    const formData = new FormData();
    payload.files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
    });
    if (payload.folder) {
        formData.append('folder', payload.folder);
    }

    const response = await axiosx(true).post('/api/v1/uploads/multiple', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteFile: DeleteFileRequest = async (payload) => {
    const response = await axiosx(true).delete('/api/v1/uploads/file', {
        data: payload,
    });
    return response.data;
};

export const postCheckFile: PostCheckFileRequest = async (payload) => {
    const response = await axiosx(true).post('/api/v1/uploads/check', payload);
    return response.data;
};