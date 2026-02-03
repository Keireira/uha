import * as SQLite from 'expo-sqlite';

import { drizzle } from 'drizzle-orm/expo-sqlite';

const uhaDb = SQLite.openDatabaseSync('db.db', { enableChangeListener: true });

if (__DEV__) {
	console.log('\x1b[34m[DEV SETUP]: \x1b[35mSetting up dev mode...\x1b[0m');
	uhaDb.execSync('PRAGMA journal_mode = WAL;');
	uhaDb.execSync('PRAGMA busy_timeout = 5000;');
	console.log('\x1b[34m[DEV SETUP]: \x1b[32mDev mode setup complete\x1b[0m');
}

const db = drizzle(uhaDb);

export default db;
