import { CONFIG } from 'src/global-config';
import { AuthGuard } from 'src/modules/auth/guard';
import { DashboardLayout } from 'src/layouts/dashboard';
import { ListInventoryPage } from 'src/modules/inventory';

// ----------------------------------------------------------------------

export const metadata = { title: `Inventori - ${CONFIG.appName}` };

export default function Page() {
    return (
        <AuthGuard>
            <DashboardLayout>
                <ListInventoryPage />
            </DashboardLayout>
        </AuthGuard>
    );
}
