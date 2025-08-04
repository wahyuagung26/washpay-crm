import { USER_WORKSPACE, JWT_STORAGE_KEY, USER_STORAGE_KEY, ROLES_SUPER_ADMIN } from './constant';

type FeatureKey =
  | 'dashboard'
  | 'clients'
  | 'topups'
  ;

const accessControl: Record<FeatureKey, number[]> = {
    'dashboard': [ROLES_SUPER_ADMIN],
    'clients': [ROLES_SUPER_ADMIN],
    'topups': [ROLES_SUPER_ADMIN],
};

// ----------------------------------------------------------------------
export async function setSession(accessToken: string | null) {
    try {
        if (accessToken) {
            localStorage.setItem(JWT_STORAGE_KEY, accessToken);
        } else {
            localStorage.removeItem(JWT_STORAGE_KEY);
        }
    } catch (error) {
        console.error('Error during set session:', error);
        throw error;
    }
}

// ----------------------------------------------------------------------
export async function setUser(user: any) {
    try {
        if (user) {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(USER_STORAGE_KEY);
        }
    } catch (error) {
        console.error('Error during set user:', error);
        throw error;
    }
}

// ----------------------------------------------------------------------
export async function setWorkspace(workspace: any) {
    try {
        if (workspace) {
            localStorage.setItem(USER_WORKSPACE, JSON.stringify(workspace));
        } else {
            localStorage.removeItem(USER_WORKSPACE);
        }
    } catch (error) {
        console.error('Error during set workspace:', error);
        throw error;
    }
}

// ----------------------------------------------------------------------
export function getWorkspace() {
    try {
        const workspace = localStorage.getItem(USER_WORKSPACE);
        return workspace ? JSON.parse(workspace) : null;
    } catch (error) {
        console.error('Error during get workspace:', error);
        throw error;
    }
}

// ----------------------------------------------------------------------
export function getToken() {
    try {
        const token = localStorage.getItem(JWT_STORAGE_KEY);
        return token ?? null;
    } catch (error) {
        console.error('Error during get token:', error);
        throw error;
    }
}

// ----------------------------------------------------------------------
export function getUser() {
    try {
        const user = localStorage.getItem(USER_STORAGE_KEY);
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Error during get user:', error);
        throw error;
    }
}

// ----------------------------------------------------------------------
export function checkAccess(feature: FeatureKey): boolean {
    const user = getUser();
    if (!user || !user.role) return false;

    const role = user.role;

    return accessControl[feature]?.includes(role);
}

// ----------------------------------------------------------------------
export function getAccessControl(feature: FeatureKey): number[] {
    return accessControl[feature] ?? [];
}

// ----------------------------------------------------------------------
export function clearStorage() {
    try {
        localStorage.removeItem(JWT_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(USER_WORKSPACE);
    } catch (error) {
        console.error('Error during clear storage:', error);
        throw error;
    }
}