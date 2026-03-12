import { useEffect, useState, useCallback } from 'react';
import { iCloud } from 'react-native-icloud-kit';
import { RECORD_TYPE, BACKUP_STATUS, ICLOUD_ERROR } from '@lib/backup';

import type { ICloudError } from '@lib/backup';

/**
 * Check whether iCloud is available (user signed in).
 */
const isICloudAvailable = async () => {
	try {
		return await iCloud.isAvailable();
	} catch (err) {
		console.error('[iCloud] ✗ Failed to check availability:', err);

		return false;
	}
};

/**
 * Get the last CloudKit backup timestamp string, or null if none exists.
 */
const getLastBackupTimestamp = async (): Promise<string | null> => {
	try {
		const records = await iCloud.query(RECORD_TYPE, undefined, 1);

		if (!records.length) {
			return null;
		}

		const timestamp = records[0].fields.timestamp;

		return typeof timestamp === 'string' ? timestamp : null;
	} catch (err) {
		if ((err as ICloudError).code !== ICLOUD_ERROR.RECORD_NOT_FOUND) {
			console.error('[iCloud] ✗ Failed to fetch backup info:', err);
		}

		return null;
	}
};

const useICloud = () => {
	const [status, setStatus] = useState<BACKUP_STATUS>(BACKUP_STATUS.CHECKING);
	const [lastBackupTimestamp, setLastBackupTimestamp] = useState<string | null>(null);

	const checkICloudMeta = useCallback(async () => {
		setStatus(BACKUP_STATUS.CHECKING);

		const isAvailable = await isICloudAvailable();

		if (!isAvailable) {
			console.log('[iCloud] ◆ Account unavailable');
			setStatus(BACKUP_STATUS.UNAVAILABLE);

			return;
		}

		setStatus(BACKUP_STATUS.AVAILABLE);

		const timestamp = await getLastBackupTimestamp();

		if (timestamp) {
			console.log(`[iCloud] ◆ Last backup: ${timestamp}`);
			setLastBackupTimestamp(timestamp);
		}
	}, []);

	useEffect(() => {
		checkICloudMeta();
	}, [checkICloudMeta]);

	return {
		status,
		checkICloudMeta,
		lastBackupTimestamp
	};
};

export default useICloud;
