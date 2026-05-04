import { useLocalSearchParams } from 'expo-router';

import db from '@db';
import { eq } from 'drizzle-orm';
import { servicesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

type LocalSearchParams = {
	id: string;
	title: string;
	type: 'service';
};

const useInitDraft = () => {
	const { id } = useLocalSearchParams<LocalSearchParams>();

	const {
		data: [service]
	} = useLiveQuery(db.select().from(servicesTable).where(eq(servicesTable.id, id)).limit(1), [id]);

	return service;
};

export default useInitDraft;
