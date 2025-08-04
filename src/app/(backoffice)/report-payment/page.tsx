import { CONFIG } from 'src/global-config';
import { AuthGuard } from 'src/modules/auth/guard';
import { DashboardLayout } from 'src/layouts/dashboard';
import { ReportPaymentPage } from 'src/modules/reports/payment';

// ----------------------------------------------------------------------

export const metadata = { title: `Laporan Non Tunai - ${CONFIG.appName}` };

export default function Page() {
    return (
        <AuthGuard>
            <DashboardLayout>
                <ReportPaymentPage />
            </DashboardLayout>
        </AuthGuard>
    );
}
