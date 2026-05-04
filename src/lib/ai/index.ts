import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AICompat from '@modules/ai-compat';

/**
 * Check if AI features are available on this device.
 */
export const isAIAvailable = () => {
	if (Platform.OS !== 'ios') {
		return false;
	}

	try {
		return AICompat.isSupported();
	} catch {
		return false;
	}
};

export const useAIAvailability = () => {
	const [isAvailable, setIsAvailable] = useState(false);

	useEffect(() => {
		setIsAvailable(isAIAvailable());
	}, []);

	return isAvailable;
};
