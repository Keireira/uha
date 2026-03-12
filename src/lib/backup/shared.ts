import { File } from 'expo-file-system';

export const DB_NAME = 'db.db';
export const SQLITE_MAGIC = 'SQLite format 3';

/** Delete a file, ignoring "path does not exist" errors. */
export const safeDelete = (file: File) => {
	try {
		file.delete();
	} catch {
		// File may already be cleaned up by the OS
	}
};
