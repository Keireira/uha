import { requireNativeModule, NativeModule } from 'expo';

import type { SettingsBridgeModuleEvents, SettingsColorSchemeName } from './SettingsBridge.d';

declare class SettingsBridgeModule extends NativeModule<SettingsBridgeModuleEvents> {
	getColorScheme(): SettingsColorSchemeName;
}

export default requireNativeModule<SettingsBridgeModule>('SettingsBridge');
