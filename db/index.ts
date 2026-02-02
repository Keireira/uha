import * as SQLite from 'expo-sqlite';

import { drizzle } from 'drizzle-orm/expo-sqlite';

const uhaDb = SQLite.openDatabaseSync('db.db', { enableChangeListener: true });

if (__DEV__) {
	console.log('Setting up dev mode...');
	uhaDb.execSync('PRAGMA journal_mode = WAL;');
	uhaDb.execSync('PRAGMA busy_timeout = 5000;');
	console.log('Dev mode setup complete');
}

const db = drizzle(uhaDb);

export default db;
