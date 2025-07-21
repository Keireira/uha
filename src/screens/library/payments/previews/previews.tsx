import React from 'react';
import { asc } from 'drizzle-orm';
import { db } from '@src/sql-migrations';
import { paymentMethodsTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import NoItems from './no-items';
import PreviewItem from './preview-item';
import Root, { SnapMark } from './previews.styles';

const Previews = () => {
	const { data: payments } = useLiveQuery(
		db.select().from(paymentMethodsTable).orderBy(asc(paymentMethodsTable.title)).limit(6)
	);

	return (
		<Root>
			<SnapMark $left />

			{!payments.length && <NoItems />}

			{payments.map((payment) => (
				<PreviewItem key={payment.id} {...payment} />
			))}

			<SnapMark $right />
		</Root>
	);
};

export default Previews;
