import { useEffect, useState, useCallback } from 'react';
import { isICloudAvailable, getLastBackupInfo } from '@lib/backup/cloudkit-backup';

type ICloudStatus = 'checking' | 'available' | 'unavailable';

const useICloud = () => {
	const [status, setStatus] = useState<ICloudStatus>('checking');
	const [lastBackup, setLastBackup] = useState<number | null>(null);

	const check = useCallback(async () => {
		setStatus('checking');

		const available = await isICloudAvailable();

		if (!available) {
			setStatus('unavailable');
			return;
		}

		setStatus('available');

		const info = await getLastBackupInfo();
		if (info) setLastBackup(info.timestamp);
	}, []);

	useEffect(() => {
		check();
	}, [check]);

	return { status, lastBackup, refresh: check };
};

export default useICloud;
