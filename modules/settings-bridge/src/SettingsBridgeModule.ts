import { requireNativeModule } from 'expo';

import type { NativeModule } from 'expo';
import type { SettingsBridgeModuleEvents } from './SettingsBridge.d';

declare class SettingsBridgeModule extends NativeModule<SettingsBridgeModuleEvents> {}

export default requireNativeModule<SettingsBridgeModule>('SettingsBridge');
