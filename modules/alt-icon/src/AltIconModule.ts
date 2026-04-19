import { requireNativeModule } from 'expo';

type AltIconModuleT = {
	/** `UIApplication.supportsAlternateIcons`. Always `false` on simulators for some SDKs. */
	isSupported: () => Promise<boolean>;
	/** `null` means the primary (.icon) is active. */
	getCurrent: () => Promise<string | null>;
	/** Pass `null` to restore the primary icon. */
	setCurrent: (name: string | null) => Promise<void>;
};

const AltIconModule = requireNativeModule<AltIconModuleT>('AltIcon');

export const isSupported = (): Promise<boolean> => {
	return AltIconModule.isSupported();
};

export const getCurrent = (): Promise<string | null> => {
	return AltIconModule.getCurrent();
};

export const setCurrent = (name: string | null): Promise<void> => {
	return AltIconModule.setCurrent(name);
};
