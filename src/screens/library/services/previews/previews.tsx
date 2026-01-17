import React, { useEffect, useState } from 'react';

import db from '@db';
import { asc, like } from 'drizzle-orm';
import { servicesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import PreviewItem from './preview-item';
import Section from '@screens/library/section';
import Root, { SnapMark } from './previews.styles';
import { ToAll, NoItems, useLength } from '@screens/library/shared';

import type { Props } from './previews.d';

const Previews = ({ search, setFound }: Props) => {
	const length = useLength(servicesTable);
	const [canRender, setCanRender] = useState(false);

	const { data: services } = useLiveQuery(
		db
			.select()
			.from(servicesTable)
			.where(like(servicesTable.title, `%${search.trim()}%`))
			.orderBy(asc(servicesTable.title))
			.limit(6),
		[search]
	);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setCanRender(true);
		}, 250);

		return () => clearTimeout(timeout);
	}, []);

	useEffect(() => {
		setFound(services.length);
	}, [setFound, services.length]);

	// For search results only
	if (!services.length && search.length > 0) {
		return null;
	}

	return (
		<Section title="Services (apps)" to="/(tabs)/library/services-list">
			<Root>
				<SnapMark $left />

				{!services.length && <NoItems title="No services" />}

				{canRender && services.map((service) => <PreviewItem key={service.id} {...service} />)}

				{canRender && services.length >= 1 && length > 6 && <ToAll to="/(tabs)/library/services-list" />}

				<SnapMark $right />
			</Root>
		</Section>
	);
};

export default Previews;
