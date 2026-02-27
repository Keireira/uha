import { Platform } from 'react-native';

/**
 * Check if AI features are available on this device.
 * Currently a stub — will integrate with Apple Intelligence APIs in the future.
 */
export const isAIAvailable = (): boolean => {
	if (Platform.OS !== 'ios') return false;

	try {
		const AICompatModule = require('@modules/ai-compat').default;
		return AICompatModule.isSupported();
	} catch {
		return false;
	}
};

/**
 * Get AI-powered form suggestions.
 * Stub — no-op for now, will be implemented when on-device AI APIs are available.
 */
export const getFormSuggestions = async (_input: string): Promise<string[]> => {
	return [];
};
