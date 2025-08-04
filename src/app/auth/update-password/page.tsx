import { CONFIG } from 'src/global-config';
import { UpdatePasswordView } from 'src/modules/auth/view/jwt';

// ----------------------------------------------------------------------

export const metadata = { title: `Perbarui Kata Sandi | ${CONFIG.appName}` };

export default function Page() {
    return <UpdatePasswordView />;
}
