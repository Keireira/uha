import { File } from 'expo-file-system';

export const DB_NAME = 'db.db';
export const SQLITE_MAGIC = 'SQLite format 3';

export const RECORD_ID = 'latest-backup';
export const RECORD_TYPE = 'DatabaseBackup';
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

export const bytesToBase64 = (bytes: Uint8Array) => {
	let binary = '';

	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i]);
	}

	return btoa(binary) satisfies string;
};

export const base64ToBytes = (b64: string) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)) satisfies Uint8Array;
