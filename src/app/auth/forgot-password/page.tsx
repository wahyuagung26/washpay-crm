import { CONFIG } from 'src/global-config';
import { ForgotPasswordView } from 'src/modules/auth/view/jwt';

// ----------------------------------------------------------------------

export const metadata = { title: `Lupa Kata Sandi | ${CONFIG.appName}` };

export default function Page() {
    return <ForgotPasswordView />;
}
