import { CONFIG } from 'src/global-config';
import { AuthGuard } from 'src/modules/auth/guard';
import { ListCashOutPage } from 'src/modules/cash-out';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export const metadata = { title: `Pengeluaran - ${CONFIG.appName}` };

export default function Page() {
    return (
        <AuthGuard>
            <DashboardLayout>
                <ListCashOutPage />
            </DashboardLayout>
        </AuthGuard>
    );
}
