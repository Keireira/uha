import { useLocalSearchParams } from 'expo-router';

import db from '@db';
import { eq } from 'drizzle-orm';
import { categoriesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

type LocalSearchParams = {
	id: string;
	title: string;
	type: 'category';
};

const useInitDraft = () => {
	const { id } = useLocalSearchParams<LocalSearchParams>();

	const {
		data: [category]
	} = useLiveQuery(db.select().from(categoriesTable).where(eq(categoriesTable.slug, id)).limit(1), [id]);

	return category;
};

export default useInitDraft;
