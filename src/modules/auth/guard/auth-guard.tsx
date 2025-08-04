'use client';

import { useState, useEffect } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';
import { checkAccess } from '../context/jwt';

// ----------------------------------------------------------------------

type AuthGuardProps = {
    children: React.ReactNode;
};

const signInPaths = {
    jwt: paths.auth.signIn,
    auth0: paths.auth.signIn,
    amplify: paths.auth.signIn,
    firebase: paths.auth.signIn,
    supabase: paths.auth.signIn,
};

export function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();

    const { authenticated, loading } = useAuthContext();

    const [isChecking, setIsChecking] = useState<boolean>(true);

    const createRedirectPath = (currentPath: string) => {
        const queryString = new URLSearchParams({ returnTo: pathname }).toString();
        return `${currentPath}?${queryString}`;
    };

    const checkPermissions = async (): Promise<void> => {
        if (loading) {
            return;
        }

        if (!authenticated) {
            const { method } = CONFIG.auth;

            const signInPath = signInPaths[method];
            const redirectPath = createRedirectPath(signInPath);

            router.replace(redirectPath);

            return;
        }
    };

    const checkAccessRole = async (): Promise<void> => {
        if (loading) {
            return;
        }

        if (!authenticated) {
            return;
        }

        // get first word if split by /
        let pathFeature = pathname.split('/')[1] || '';
        // remove all slash
        pathFeature = pathFeature.replace(/\//g, '');
        console.log('pathFeature', pathFeature);
        if (checkAccess(pathFeature as any) || checkAccess(`${pathFeature}.view` as any)) {
            setIsChecking(false);
            return;
        } else {
            router.replace('/forbidden');
            return;
        }
    };

    useEffect(() => {
        checkPermissions();
        checkAccessRole();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authenticated, loading]);

    if (isChecking) {
        return <SplashScreen />;
    }

    return <>{children}</>;
}
