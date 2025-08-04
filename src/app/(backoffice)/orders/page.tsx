import { CONFIG } from 'src/global-config';
import { AuthGuard } from 'src/modules/auth/guard';
import { DashboardLayout } from 'src/layouts/dashboard';
import { ListOrderPage } from 'src/modules/order/page/list';

// ----------------------------------------------------------------------

export const metadata = { title: `Daftar Order - ${CONFIG.appName}` };

export default function Page() {
    return (
        <AuthGuard>
            <DashboardLayout>
                <ListOrderPage />
            </DashboardLayout>
        </AuthGuard>
    );
}
