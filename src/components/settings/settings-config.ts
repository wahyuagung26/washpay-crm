import { CONFIG } from 'src/global-config';
import { themeConfig } from 'src/theme/theme-config';

import type { SettingsState } from './types';

// ----------------------------------------------------------------------

export const SETTINGS_STORAGE_KEY: string = 'app-settings';

export const defaultSettings: SettingsState = {
    colorScheme: themeConfig.defaultMode,
    direction: themeConfig.direction,
    contrast: 'default',
    navLayout: 'vertical',
    primaryColor: 'default',
    navColor: 'integrate',
    compactLayout: false,
    fontSize: 14,
    fontFamily: themeConfig.fontFamily.primary,
    version: CONFIG.appVersion,
};
