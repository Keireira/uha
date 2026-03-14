import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow, parseISO } from 'date-fns';

import useICloud from './use-icloud';
import { BACKUP_STATUS } from '@lib/backup';
import { LOADING_ACTIONS } from '../../use-loading';

import type { UseLoadingReturnT } from '../../use-loading';

const formatDate = (timestamp: string) => {
	try {
		return formatDistanceToNow(parseISO(timestamp), { addSuffix: true });
	} catch {
		return timestamp;
	}
};

const useStatusText = (loadingAction: UseLoadingReturnT['loadingAction']) => {
	const { t } = useTranslation();
	const [tick, setTick] = useState(0);
	const { iCloudStatus, lastBackupTimestamp } = useICloud();

	useEffect(() => {
		if (!lastBackupTimestamp) return;

		const interval = setInterval(() => setTick((prev) => prev + 1), 60_000);

		return () => clearInterval(interval);
	}, [lastBackupTimestamp]);

	/* Force React Compiler to treat tick as a dependency */
	void tick;

	/* You don't need useMemo here because React 19+ && React Compiler */
	switch (true) {
		case iCloudStatus === BACKUP_STATUS.CHECKING:
			return t('settings.data.icloud_checking');
		case iCloudStatus !== BACKUP_STATUS.AVAILABLE:
			return t('settings.data.icloud_unavailable');
		case loadingAction === LOADING_ACTIONS.ICloudBackup:
			return t('settings.data.icloud_backing_up');
		case loadingAction === LOADING_ACTIONS.ICloudRestore:
			return t('settings.data.icloud_restoring');
		default:
			return lastBackupTimestamp ? formatDate(lastBackupTimestamp) : t('settings.data.icloud_no_backup');
	}
};

export default useStatusText;
