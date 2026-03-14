import { requireNativeModule } from 'expo';

type CloudBackupModuleT = {
	createBackup: (pathToBackup: string) => Promise<void>;
	fetchBackup: () => Promise<string>;
	isAvailable: () => Promise<boolean>;
	getTimestamp: () => Promise<string>;
	zip: (at: string, to: string) => Promise<void>;
	unzip: (at: string, to: string) => Promise<void>;
};

const CloudBackupModule = requireNativeModule<CloudBackupModuleT>('CloudBackup');

export const createBackup = (pathToBackup: string): Promise<void> => {
	return CloudBackupModule.createBackup(pathToBackup);
};

export const fetchBackup = (): Promise<string> => {
	return CloudBackupModule.fetchBackup();
};

export const isAvailable = (): Promise<boolean> => {
	return CloudBackupModule.isAvailable();
};

export const getTimestamp = (): Promise<string> => {
	return CloudBackupModule.getTimestamp();
};

export const zip = (at: string, to: string): Promise<void> => {
	return CloudBackupModule.zip(at, to);
};

export const unzip = (at: string, to: string): Promise<void> => {
	return CloudBackupModule.unzip(at, to);
};
