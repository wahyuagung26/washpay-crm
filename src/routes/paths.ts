// ----------------------------------------------------------------------

const ROOTS = {
    AUTH: '/auth',
    DASHBOARD: '/dashboard',
    CLIENTS: '/clients',
    BASE: '',
};

// ----------------------------------------------------------------------

export const paths = {
    // AUTH
    auth: {
        signIn: `${ROOTS.AUTH}/sign-in`,
    },
    // DASHBOARD
    dashboard: {
        root: ROOTS.DASHBOARD,
    },
    // CLIENTS
    clients: {
        root: ROOTS.CLIENTS,
    },
};
