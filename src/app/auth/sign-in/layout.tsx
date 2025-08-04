import { GuestGuard } from 'src/modules/auth/guard';
import { AuthSplitLayout } from 'src/layouts/auth-split';

// ----------------------------------------------------------------------

type Props = {
    children: React.ReactNode;
};

export default function Layout({ children }: Props) {
    return (
        <GuestGuard>
            <AuthSplitLayout
                slotProps={{
                    section: {
                        title: 'CRM WashPay',
                        subtitle: 'Silakan masuk ke akun Anda untuk melanjutkan.',
                    },
                }}
            >
                {children}
            </AuthSplitLayout>
        </GuestGuard>
    );
}
