import React from 'react';
import { asc } from 'drizzle-orm';
import { db } from '@src/sql-migrations';
import { servicesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import NoItems from './no-items';
import PreviewItem from './preview-item';
import Root, { SnapMark } from './previews.styles';

const Previews = () => {
	const { data: services } = useLiveQuery(db.select().from(servicesTable).orderBy(asc(servicesTable.title)).limit(6));

	return (
		<Root>
			<SnapMark $left />

			{!services.length && <NoItems />}

			{services.map((service) => (
				<PreviewItem key={service.id} {...service} />
			))}

			<SnapMark $right />
		</Root>
	);
};

export default Previews;
