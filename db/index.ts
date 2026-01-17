import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

const uhaDb = SQLite.openDatabaseSync('db.db', { enableChangeListener: true });
const db = drizzle(uhaDb);

export default db;
