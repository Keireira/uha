import { requireNativeModule } from 'expo';
import type { NativeModule } from 'expo';

declare class NavBarFixModule extends NativeModule<{}> {
	removeBarButtonBackground(): Promise<void>;
}

export default requireNativeModule<NavBarFixModule>('NavBarFix');
