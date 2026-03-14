import React from 'react';

import useLoading from './use-loading';

import DBBackup from './db-backup';
import CSVBackup from './csv-backup';
import ICloudBackup from './icloud-backup';

const DataSync = () => {
	const { withLoading, loadingAction, isLoading } = useLoading();

	return (
		<>
			<ICloudBackup isLoading={isLoading} loadingAction={loadingAction} withLoading={withLoading} />
			<DBBackup isLoading={isLoading} loadingAction={loadingAction} withLoading={withLoading} />
			<CSVBackup isLoading={isLoading} loadingAction={loadingAction} withLoading={withLoading} />
		</>
	);
};

export default DataSync;
