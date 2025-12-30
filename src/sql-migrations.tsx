import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';

import migrations from '../drizzle/migrations';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';

const uhaDb = SQLite.openDatabaseSync('db.db', { enableChangeListener: true });
export const db = drizzle(uhaDb);

const SqlMigrations = () => {
	const { error } = useMigrations(db, migrations);
	useDrizzleStudio(db.$client);

	if (error) {
		console.error('Migration error:', error);
	}

	return null;
};

export default SqlMigrations;
