import { requireNativeModule, NativeModule } from 'expo';

import type { TabMenuConfig, TabContextMenuModuleEvents } from './TabContextMenu.d';

declare class TabContextMenuModule extends NativeModule<TabContextMenuModuleEvents> {
	configure(configs: TabMenuConfig[]): void;
}

export default requireNativeModule<TabContextMenuModule>('TabContextMenu');
