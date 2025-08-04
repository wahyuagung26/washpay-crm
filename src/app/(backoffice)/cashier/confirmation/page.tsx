import { CONFIG } from 'src/global-config';
import { AuthGuard } from 'src/modules/auth/guard';
import { DashboardLayout } from 'src/layouts/dashboard';
import { ConfirmationOrderPage } from 'src/modules/order';

// ----------------------------------------------------------------------

export const metadata = { title: `Konfirmasi Pesanan - ${CONFIG.appName}` };

export default function Page() {
    return (
        <AuthGuard>
            <DashboardLayout>
                <ConfirmationOrderPage />
            </DashboardLayout>
        </AuthGuard>
    );
}
