import { useUnit } from 'effector-react';
import { createEvent, createStore } from 'effector';

import { BACKUP_STATUS } from '@lib/backup';
import { isAvailable, getTimestamp } from '@modules/cloud-backup';

type ICloudMeta = {
	status: BACKUP_STATUS;
	lastBackupTimestamp: string | null;
};

const INITIAL: ICloudMeta = {
	status: BACKUP_STATUS.CHECKING,
	lastBackupTimestamp: null
};

const updated = createEvent<ICloudMeta>();
const $iCloudMeta = createStore(INITIAL).on(updated, (_, next) => next);

const fetchICloudMeta = async (): Promise<ICloudMeta> => {
	const available = await isAvailable();

	if (!available) {
		console.log('[iCloud] ◆ Account unavailable');

		return {
			status: BACKUP_STATUS.UNAVAILABLE,
			lastBackupTimestamp: null
		};
	}

	let timestamp: string | null = null;

	try {
		timestamp = await getTimestamp();
		if (timestamp) {
			console.log(`[iCloud] ◆ Last backup: ${timestamp}`);
		}
	} catch {
		console.log('[iCloud] ◆ No backup found');
	}

	return {
		status: BACKUP_STATUS.AVAILABLE,
		lastBackupTimestamp: timestamp
	};
};

const checkICloudMeta = async () => {
	updated(INITIAL);

	try {
		const result = await fetchICloudMeta();
		updated(result);
	} catch {
		updated({ status: BACKUP_STATUS.UNAVAILABLE, lastBackupTimestamp: null });
	}
};

/* auto-fetch on first import */
checkICloudMeta();

const useICloud = () => {
	const meta = useUnit($iCloudMeta);

	return {
		checkICloudMeta,
		iCloudStatus: meta.status,
		lastBackupTimestamp: meta.lastBackupTimestamp
	};
};

export default useICloud;
