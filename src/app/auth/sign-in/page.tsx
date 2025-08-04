import { CONFIG } from 'src/global-config';
import { SignInView } from 'src/modules/auth/view/jwt';

// ----------------------------------------------------------------------

export const metadata = { title: `Login | ${CONFIG.appName}` };

export default function Page() {
    return <SignInView />;
}
