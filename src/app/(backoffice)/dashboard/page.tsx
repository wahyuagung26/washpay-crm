import { CONFIG } from 'src/global-config';
import { DashboardPage } from 'src/modules/dashboard';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <DashboardPage />;
}
