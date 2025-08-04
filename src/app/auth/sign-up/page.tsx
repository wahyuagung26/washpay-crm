import { CONFIG } from 'src/global-config';
import { SignUpView } from 'src/modules/auth/view/jwt';

// ----------------------------------------------------------------------

export const metadata = { title: `Pendaftaran | ${CONFIG.appName}` };

export default function Page() {
    return <SignUpView />;
}
