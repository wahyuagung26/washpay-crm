'use client';

import { useSetState } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';

import { getProfile } from 'src/infrastructure/api';

import { AuthContext } from '../auth-context';
import { setUser, getToken, setSession } from './utils';

import type { AuthState } from '../../types';

// ----------------------------------------------------------------------
type Props = {
    children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
    const { state, setState } = useSetState<AuthState>({ user: null, loading: true });

    const checkUserSession = useCallback(async () => {
        try {
            const accessToken = getToken();

            if (accessToken) {
                setSession(accessToken);

                const res = await getProfile();
                if (!res?.data) {
                    throw new Error('User data not found in response');
                }

                // Save user data to local storage
                setUser(res.data);

                setState({ user: { ...res?.data, accessToken }, loading: false });
            } else {
                setState({ user: null, loading: false });
            }
        } catch (error) {
            console.error(error);
            setState({ user: null, loading: false });
        }
    }, [setState]);

    useEffect(() => {
        checkUserSession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ----------------------------------------------------------------------

    const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

    const status = state.loading ? 'loading' : checkAuthenticated;

    const memoizedValue = useMemo(
        () => ({
            user: state.user ? { ...state.user, role: state.user?.role ?? 'admin' } : null,
            checkUserSession,
            loading: status === 'loading',
            authenticated: status === 'authenticated',
            unauthenticated: status === 'unauthenticated',
        }),
        [checkUserSession, state.user, status]
    );

    return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}