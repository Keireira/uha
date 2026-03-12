import { useCallback, useState } from 'react';
import * as Haptics from 'expo-haptics';

const useLoading = () => {
	const [loadingAction, setLoadingAction] = useState<string | null>(null);
	const isLoading = loadingAction !== null;

	const withLoading = useCallback(
		(key: string, fn: () => Promise<void>) => async () => {
			if (isLoading) return;

			setLoadingAction(key);
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

			try {
				await fn();
			} finally {
				setLoadingAction(null);
			}
		},
		[isLoading]
	);

	return { withLoading, loadingAction, isLoading };
};

export default useLoading;
