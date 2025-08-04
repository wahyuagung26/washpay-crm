import { CONFIG } from 'src/global-config';
import { AuthGuard } from 'src/modules/auth/guard';
import { CreateOrderPage } from 'src/modules/order';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export const metadata = { title: `Kasir - ${CONFIG.appName}` };

export default function Page() {
    return (
        <AuthGuard>
            <DashboardLayout>
                <CreateOrderPage />
            </DashboardLayout>
        </AuthGuard>
    );
}
