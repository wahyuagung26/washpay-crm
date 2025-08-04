import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { getAccessControl } from 'src/modules/auth/context/jwt';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const navData: NavSectionProps['data'] = [
    /**
     * Overview
     */
    {
        subheader: 'Menu Utama',
        items: [
            {
                title: 'Dashboard',
                path: paths.dashboard.root,
                icon: <Iconify icon="dashicons:dashboard" width={20} height={20} />,
                roles: getAccessControl('dashboard')
            },
        ],
    },
    /**
     * Operasional
     */
    {
        subheader: 'Operasional',
        items: [
            {
                title: 'Klien',
                path: paths.clients.root,
                icon: <Iconify icon="solar:user-bold-duotone" width={20} height={20} />,
                roles: [...getAccessControl('clients')]
            },
            {
                title: 'Top Up',
                path: paths.topup.root,
                icon: <Iconify icon="solar:wallet-money-bold-duotone" width={20} height={20} />,
                roles: [...getAccessControl('topups')]
            },
        ],
    },
];
