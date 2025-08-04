import { CONFIG } from 'src/global-config';
import { AuthGuard } from 'src/modules/auth/guard';
import { DashboardLayout } from 'src/layouts/dashboard';
import { ReportTransactionPage } from 'src/modules/reports/transaction/report';

// ----------------------------------------------------------------------

export const metadata = { title: `Laporan Transaksi - ${CONFIG.appName}` };

export default function Page() {
    return (
        <AuthGuard>
            <DashboardLayout>
                <ReportTransactionPage />
            </DashboardLayout>
        </AuthGuard>
    );
}
