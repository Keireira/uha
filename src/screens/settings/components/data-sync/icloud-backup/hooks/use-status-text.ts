import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow, parseISO, differenceInHours } from 'date-fns';

import useICloud from './use-icloud';
import { BACKUP_STATUS } from '@lib/backup';
import { LOADING_ACTIONS } from '../../use-loading';

import type { UseLoadingReturnT } from '../../use-loading';

const ONE_MINUTE = 60_000;
const ONE_HOUR = 3_600_000;

const getRefreshInterval = (timestamp: string): number | null => {
	const hours = differenceInHours(new Date(), parseISO(timestamp));

	if (hours >= 24) return null;
	if (hours >= 1) return ONE_HOUR;
	return ONE_MINUTE;
};

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
		setTick(0);
	}, [lastBackupTimestamp]);

	useEffect(() => {
		if (!lastBackupTimestamp) return;

		const interval = getRefreshInterval(lastBackupTimestamp);
		if (!interval) return;

		const id = setInterval(() => setTick((prev) => prev + 1), interval);

		return () => clearInterval(id);
	}, [lastBackupTimestamp, tick]);

	/* Force React Compiler to treat tick as a dependency */
	void tick;

	/* You don't need useMemo here because React 19+ && React Compiler */
	switch (true) {
		case iCloudStatus === BACKUP_STATUS.CHECKING:
			return t('settings.data.icloud.statuses.checking');
		case iCloudStatus !== BACKUP_STATUS.AVAILABLE:
			return t('settings.data.icloud.statuses.unavailable');
		case loadingAction === LOADING_ACTIONS.ICloudBackup:
			return t('settings.data.icloud.statuses.backing_up');
		case loadingAction === LOADING_ACTIONS.ICloudRestore:
			return t('settings.data.icloud.statuses.restoring');
		default:
			return lastBackupTimestamp ? formatDate(lastBackupTimestamp) : t('settings.data.icloud.statuses.no_backup');
	}
};

export default useStatusText;
