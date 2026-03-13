import { Platform } from 'react-native';
import AICompat from '@modules/ai-compat';

/**
 * Check if AI features are available on this device.
 * Currently a stub — will integrate with Apple Intelligence APIs in the future.
 */
export const isAIAvailable = () => {
	if (Platform.OS !== 'ios') return false;

	try {
		return AICompat.isSupported();
	} catch {
		return false;
	}
};
