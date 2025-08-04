import { CONFIG } from 'src/global-config';
import { TopUpPage } from 'src/modules/topup';
import { AuthGuard } from 'src/modules/auth/guard';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export const metadata = { title: `Top Up Saldo - ${CONFIG.appName}` };

export default function Page() {
    return (
        <AuthGuard>
            <DashboardLayout>
                <TopUpPage />
            </DashboardLayout>
        </AuthGuard>
    );
}
