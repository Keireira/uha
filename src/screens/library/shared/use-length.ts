import { useEffect, useState } from 'react';
import { db } from '@src/sql-migrations';

import type { Table } from 'drizzle-orm';

const useLength = (table: Table) => {
	const [length, setLength] = useState(0);

	useEffect(() => {
		const query = async () => {
			const result = await db.$count(table);

			return result;
		};

		query().then(setLength);
	}, [table]);

	return length;
};

export default useLength;
