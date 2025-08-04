import { CONFIG } from 'src/global-config';
import { AuthGuard } from 'src/modules/auth/guard';
import { DetailOrderPage } from 'src/modules/order';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export const metadata = { title: `Detail Pesanan - ${CONFIG.appName}` };

export default function Page() {
    return (
        <AuthGuard>
            <DashboardLayout>
                <DetailOrderPage />
            </DashboardLayout>
        </AuthGuard>
    );
}
