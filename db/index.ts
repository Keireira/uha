import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';

export const uhaDb = SQLite.openDatabaseSync('uha.db', { enableChangeListener: true });

if (__DEV__) {
	console.log('\x1b[34m[DEV SETUP]: \x1b[35mSetting up dev mode...\x1b[0m');
	uhaDb.execSync('PRAGMA journal_mode = WAL;');
	uhaDb.execSync('PRAGMA busy_timeout = 5000;');
	console.log('\x1b[34m[DEV SETUP]: \x1b[32mDev mode setup complete\x1b[0m');
}

const db = drizzle(uhaDb);

/** Silent connection for bulk writes — no change listener, avoids flooding useLiveQuery */
const silentClient = SQLite.openDatabaseSync('uha.db');
export const silentDb = drizzle(silentClient);

export default db;
