import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

const useAICompat = () => {
	const [isSupported, setIsSupported] = useState(false);
	const [isChecked, setIsChecked] = useState(false);

	useEffect(() => {
		if (Platform.OS !== 'ios') {
			setIsChecked(true);
			return;
		}

		try {
			const AICompatModule = require('@modules/ai-compat').default;
			const result = AICompatModule.isSupported();
			setIsSupported(result);
		} catch {
			setIsSupported(false);
		} finally {
			setIsChecked(true);
		}
	}, []);

	return { isSupported, isChecked };
};

export default useAICompat;
