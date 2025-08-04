import { CONFIG } from 'src/global-config';
import { AuthGuard } from 'src/modules/auth/guard';
import { DashboardLayout } from 'src/layouts/dashboard';
import { ListProductPage } from 'src/modules/products/page';

// ----------------------------------------------------------------------

export const metadata = { title: `Produk - ${CONFIG.appName}` };

export default function Page() {
    return (
        <AuthGuard>
            <DashboardLayout>
                <ListProductPage />
            </DashboardLayout>
        </AuthGuard>
    );
}
