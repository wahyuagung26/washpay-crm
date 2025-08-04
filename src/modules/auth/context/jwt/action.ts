'use client';

import { postLogin } from 'src/infrastructure/api';

import { setSession, clearStorage } from './utils';

export type ForgotPasswordParams = {
    email: string;
};

export type SignInParams = {
    email: string;
    password: string;
};


/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ email, password }: SignInParams): Promise<void> => {
    try {
        const params = { email, password };

        const res = await postLogin(params);
        if (!res?.data?.token) {
            throw new Error('Access token not found in response');
        }

        setSession(res.data.token);
    } catch (error) {
        console.error('Error during sign in:', error);
        throw error;
    }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
    try {
        // @todo request to sign out endpoint

        await clearStorage();
    } catch (error) {
        console.error('Error during sign out:', error);
        throw error;
    }
};
