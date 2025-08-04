import { CONFIG } from 'src/global-config';
import { AuthGuard } from 'src/modules/auth/guard';
import { DashboardLayout } from 'src/layouts/dashboard';
import { ReportFinancePage } from 'src/modules/reports/finance';

// ----------------------------------------------------------------------

export const metadata = { title: `Laporan Keuangan - ${CONFIG.appName}` };

export default function Page() {
    return (
        <AuthGuard>
            <DashboardLayout>
                <ReportFinancePage />
            </DashboardLayout>
        </AuthGuard>
    );
}
