import { useEffect, useState } from 'react';
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

const useICloud = () => {
	const [meta, setMeta] = useState<ICloudMeta>(INITIAL);

	const checkICloudMeta = async () => {
		setMeta(INITIAL);

		try {
			const result = await fetchICloudMeta();
			setMeta(result);
		} catch {
			setMeta({ status: BACKUP_STATUS.UNAVAILABLE, lastBackupTimestamp: null });
		}
	};

	useEffect(() => {
		checkICloudMeta();
	}, []);

	return {
		checkICloudMeta,
		iCloudStatus: meta.status,
		lastBackupTimestamp: meta.lastBackupTimestamp
	};
};

export default useICloud;
