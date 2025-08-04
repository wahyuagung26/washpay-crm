import { CONFIG } from 'src/global-config';
import { AuthGuard } from 'src/modules/auth/guard';
import { DashboardLayout } from 'src/layouts/dashboard';
import { ListOutletPage } from 'src/modules/outlets/page';

// ----------------------------------------------------------------------

export const metadata = { title: `Cabang - ${CONFIG.appName}` };

export default function Page() {
    return (
        <AuthGuard>
            <DashboardLayout>
                <ListOutletPage />
            </DashboardLayout>
        </AuthGuard>
    );
}
