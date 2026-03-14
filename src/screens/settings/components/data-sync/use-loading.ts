import { useCallback, useState } from 'react';
import * as Haptics from 'expo-haptics';

export enum LOADING_ACTIONS {
	None = 'none',

	ICloudBackup = 'icloud_backup',
	ICloudRestore = 'icloud_restore',

	DBBackup = 'db_backup',
	DBRestore = 'db_restore',

	CSVBackup = 'csv_backup',
	CSVRestore = 'csv_restore'
}

export type UseLoadingReturnT = {
	withLoading: (key: LOADING_ACTIONS, fn: () => Promise<void>) => () => Promise<void>;
	loadingAction: LOADING_ACTIONS;
	isLoading: boolean;
};

const useLoading = (): UseLoadingReturnT => {
	const [loadingAction, setLoadingAction] = useState<LOADING_ACTIONS>(LOADING_ACTIONS.None);
	const isLoading = loadingAction !== LOADING_ACTIONS.None;

	const withLoading = useCallback(
		(key: LOADING_ACTIONS, fn: () => Promise<void>) => async () => {
			if (isLoading) return;

			setLoadingAction(key);
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

			try {
				await fn();
			} finally {
				setLoadingAction(LOADING_ACTIONS.None);
			}
		},
		[isLoading]
	);

	return {
		withLoading,
		loadingAction,
		isLoading
	} satisfies UseLoadingReturnT;
};

export default useLoading;
