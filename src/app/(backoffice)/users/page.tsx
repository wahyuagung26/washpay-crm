import { CONFIG } from 'src/global-config';
import { ListUserPage } from 'src/modules/users';
import { AuthGuard } from 'src/modules/auth/guard';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export const metadata = { title: `Pengguna - ${CONFIG.appName}` };

export default function Page() {
    return (
        <AuthGuard>
            <DashboardLayout>
                <ListUserPage />
            </DashboardLayout>
        </AuthGuard>
    );
}
