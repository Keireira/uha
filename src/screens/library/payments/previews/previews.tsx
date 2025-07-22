import React, { useEffect, useState } from 'react';
import { asc, like } from 'drizzle-orm';
import { db } from '@src/sql-migrations';
import { paymentMethodsTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import PreviewItem from './preview-item';
import Section from '@screens/library/section';
import Root, { SnapMark } from './previews.styles';
import { ToAll, NoItems, useLength } from '@screens/library/shared';

import type { Props } from './previews.d';

const Previews = ({ search, setFound }: Props) => {
	const length = useLength(paymentMethodsTable);
	const [canRender, setCanRender] = useState(false);

	const { data: payments } = useLiveQuery(
		db
			.select()
			.from(paymentMethodsTable)
			.where(like(paymentMethodsTable.title, `%${search.trim()}%`))
			.orderBy(asc(paymentMethodsTable.title))
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
		setFound(payments.length);
	}, [setFound, payments.length]);

	// For search results only
	if (!payments.length && search.length > 0) {
		return null;
	}

	return (
		<Section title="Payment methods (tenders)" to="/(tabs)/library/payments-list">
			<Root>
				<SnapMark $left />

				{!payments.length && <NoItems title="No payment methods" />}

				{canRender && payments.map((payment) => <PreviewItem key={payment.id} {...payment} />)}

				{canRender && payments.length >= 1 && length > 6 && <ToAll to="/(tabs)/library/payments-list" />}

				<SnapMark $right />
			</Root>
		</Section>
	);
};

export default Previews;
