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
                        title: 'Hi, Selamat datang',
                        subtitle: 'Simala adalah partner yang akan membantu memantau bisnis laundry anda.',
                    },
                }}
            >{children}</AuthSplitLayout>
        </GuestGuard>
    );
}
