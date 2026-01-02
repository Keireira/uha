import React from 'react';
import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';

import migrations from '../drizzle/migrations';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';

const uhaDb = SQLite.openDatabaseSync('db.db', { enableChangeListener: true });
export const db = drizzle(uhaDb);

type Props = React.PropsWithChildren;

const SqlMigrations = ({ children }: Props) => {
	const { error, success } = useMigrations(db, migrations);
	useDrizzleStudio(db.$client);

	if (error) {
		console.error('Migration error:', error);
	}

	if (success) {
		return children;
	}

	return null;
};

export default SqlMigrations;
