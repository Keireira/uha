import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';

import migrations from '../drizzle/migrations';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';

const uhaDb = SQLite.openDatabaseSync('uha.db');
const db = drizzle(uhaDb);

const SqlMigrations = () => {
	useDrizzleStudio(db.$client); // @TODO: Maybe add guard so it will work only in dev mode
	useMigrations(db, migrations);

	return null;
};

export default SqlMigrations;
