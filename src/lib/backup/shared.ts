import { File } from 'expo-file-system';

export const DB_NAME = 'db.db';
export const SQLITE_MAGIC = 'SQLite format 3';

export enum BACKUP_STATUS {
	CHECKING = 'checking',
	AVAILABLE = 'available',
	UNAVAILABLE = 'unavailable'
}

/** Delete a file if it exists. */
export const safeDelete = (file: File) => {
	if (file.exists) {
		file.delete();
	}
};

export const toPath = (uri: string) => uri.replace(/^file:\/\//, '');
