import { CONFIG } from 'src/global-config';
import { ForbiddenView } from 'src/modules/error';

// ----------------------------------------------------------------------

export const metadata = { title: `403 forbidden | Error - ${CONFIG.appName}` };

export default function Page() {
  return <ForbiddenView />;
}
