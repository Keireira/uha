import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';

import db from '@db';
import migrations from '../../../drizzle/migrations';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';

const useSqlMigrations = () => {
	const { error, success } = useMigrations(db, migrations);
	useDrizzleStudio(db.$client);

	if (error) {
		console.error('Migration error:', error);
	}

	return success;
};

export default useSqlMigrations;
