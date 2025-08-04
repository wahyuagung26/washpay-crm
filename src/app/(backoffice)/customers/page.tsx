import { CONFIG } from 'src/global-config';
import { AuthGuard } from 'src/modules/auth/guard';
import { DashboardLayout } from 'src/layouts/dashboard';
import { ListCustomerPage } from 'src/modules/customers';

// ----------------------------------------------------------------------

export const metadata = { title: `Pelanggan - ${CONFIG.appName}` };

export default function Page() {
    return (
        <AuthGuard>
            <DashboardLayout>
                <ListCustomerPage />
            </DashboardLayout>
        </AuthGuard>
    );
}
