import { ROLES_OWNER, ROLES_CASHIER, USER_WORKSPACE, ROLES_INVESTOR, JWT_STORAGE_KEY, USER_STORAGE_KEY } from './constant';

type FeatureKey =
  | 'dashboard'
  | 'cashier'
  | 'orders'
  | 'orders.view'
  | 'cashouts'
  | 'cashouts.view'
  | 'inventory'
  | 'inventory.view'
  | 'outlets'
  | 'customers'
  | 'users'
  | 'products'
  | 'products.view'
  | 'report-finance'
  | 'report-cashout'
  | 'report-transaction'
  | 'report-payment'
  | 'auth'
  | 'topup'
  ;

const accessControl: Record<FeatureKey, number[]> = {
    'dashboard': [ROLES_OWNER, ROLES_CASHIER, ROLES_INVESTOR],
    'cashier': [ROLES_OWNER, ROLES_CASHIER],
    'orders': [ROLES_OWNER, ROLES_CASHIER],
    'orders.view': [ROLES_INVESTOR],
    'cashouts': [ROLES_OWNER, ROLES_CASHIER],
    'cashouts.view': [ROLES_INVESTOR],
    'inventory': [ROLES_OWNER, ROLES_CASHIER],
    'inventory.view': [ROLES_INVESTOR],
    'outlets': [ROLES_OWNER],
    'customers': [ROLES_OWNER, ROLES_CASHIER],
    'users': [ROLES_OWNER],
    'products': [ROLES_OWNER, ROLES_CASHIER],
    'products.view': [ROLES_INVESTOR],
    'report-finance': [ROLES_OWNER, ROLES_INVESTOR],
    'report-cashout': [ROLES_OWNER, ROLES_INVESTOR],
    'report-transaction': [ROLES_OWNER, ROLES_INVESTOR],
    'report-payment': [ROLES_OWNER, ROLES_INVESTOR],
    'auth': [ROLES_OWNER, ROLES_CASHIER, ROLES_INVESTOR],
    'topup': [ROLES_OWNER],
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