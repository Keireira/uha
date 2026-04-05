import { create } from 'zustand';

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

const useICloudStore = create<ICloudMeta>(() => INITIAL);

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
	useICloudStore.setState(INITIAL);

	try {
		const result = await fetchICloudMeta();
		useICloudStore.setState(result);
	} catch {
		useICloudStore.setState({ status: BACKUP_STATUS.UNAVAILABLE, lastBackupTimestamp: null });
	}
};

/* auto-fetch on first import */
checkICloudMeta();

const markBackedUpNow = () => {
	useICloudStore.setState({
		status: BACKUP_STATUS.AVAILABLE,
		lastBackupTimestamp: new Date().toISOString()
	});
};

const useICloud = () => {
	const meta = useICloudStore();

	return {
		checkICloudMeta,
		markBackedUpNow,
		iCloudStatus: meta.status,
		lastBackupTimestamp: meta.lastBackupTimestamp
	};
};

export default useICloud;
