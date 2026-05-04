import { useLocalSearchParams } from 'expo-router';

import db from '@db';
import { eq } from 'drizzle-orm';
import { tendersTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

type LocalSearchParams = {
	id: string;
	title: string;
	type: 'payment';
};

const useInitDraft = () => {
	const { id } = useLocalSearchParams<LocalSearchParams>();

	const {
		data: [payment]
	} = useLiveQuery(db.select().from(tendersTable).where(eq(tendersTable.id, id)).limit(1), [id]);

	return payment;
};

export default useInitDraft;
