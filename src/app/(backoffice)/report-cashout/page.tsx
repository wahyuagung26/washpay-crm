import { CONFIG } from 'src/global-config';
import { AuthGuard } from 'src/modules/auth/guard';
import { DashboardLayout } from 'src/layouts/dashboard';
import { ReportCashOutPage } from 'src/modules/reports/cashout/report';

// ----------------------------------------------------------------------

export const metadata = { title: `Laporan Pengeluaran - ${CONFIG.appName}` };

export default function Page() {
    return (
        <AuthGuard>
            <DashboardLayout>
                <ReportCashOutPage />
            </DashboardLayout>
        </AuthGuard>
    );
}
