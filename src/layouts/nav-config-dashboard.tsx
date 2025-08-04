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
            {
                title: 'Kasir',
                path: paths.cashier.root,
                icon: <Iconify icon="solar:monitor-smartphone-bold-duotone" width={20} height={20} />,
                roles: getAccessControl('cashier')
            },
            {
                title: 'Order',
                path: paths.order.root,
                icon: <Iconify icon="solar:cart-4-bold-duotone" width={20} height={20} />,
                roles: [...getAccessControl('orders'), ...getAccessControl('orders.view')]
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
                title: 'Pengeluaran',
                path: paths.cashOut.root,
                icon: <Iconify icon="solar:wallet-money-bold-duotone" width={20} height={20} />,
                roles: [...getAccessControl('cashouts'), ...getAccessControl('cashouts.view')]
            },
            {
                title: 'Inventori',
                path: paths.inventory.root,
                icon: <Iconify icon="solar:box-bold-duotone" width={20} height={20} />,
                roles: [...getAccessControl('inventory'), ...getAccessControl('inventory.view')]
            }
        ],
    },
    /**
     * Data Master
     */
    {
        subheader: 'Data Master',
        items: [
            {
                title: 'Cabang',
                path: paths.outlet.root,
                icon: <Iconify icon="solar:shop-2-bold-duotone" width={20} height={20} />,
                roles: getAccessControl('outlets')
            },
            {
                title: 'Pelanggan',
                path: paths.customer.root,
                icon: <Iconify icon="solar:users-group-rounded-bold-duotone" width={20} height={20} />,
                roles: getAccessControl('customers')
            },
            {
                title: 'Pengguna',
                path: paths.user.root,
                icon: <Iconify icon="solar:user-check-bold-duotone" width={20} height={20} />,
                roles: getAccessControl('users')
            },
            {
                title: 'Produk',
                path: paths.product.root,
                icon: <Iconify icon="solar:bag-5-bold-duotone" width={20} height={20} />,
                roles: [...getAccessControl('products'), ...getAccessControl('products.view')]
            },
        ],
    },
    /**
     * Laporan
     */
     {
        subheader: 'Laporan',
        items: [
            {
                title: 'Keuangan',
                path: paths.reportFinance.root,
                icon: <Iconify icon="material-symbols:finance-mode" width={20} height={20} />,
                roles: getAccessControl('report-finance')
            },
            {
                title: 'Pengeluaran',
                path: paths.reportCashOut.root,
                icon: <Iconify icon="solar:cash-out-bold-duotone" width={20} height={20} />,
                roles: getAccessControl('report-cashout')
            },
            {
                title: 'Transaksi',
                path: paths.reportTransaction.root,
                icon: <Iconify icon="icon-park-solid:transaction" width={20} height={20} />,
                roles: getAccessControl('report-transaction')
            },
            {
                title: 'Pembayaran',
                path: paths.reportPayment.root,
                icon: <Iconify icon="streamline-plump:credit-card-5-solid" width={20} height={20} />,
                roles: getAccessControl('report-payment')
            },
        ]
    },
];
