import React from 'react';
import { useTranslation } from 'react-i18next';

import useAddSubcriptionStore from '../store';

import db from '@db';
import { eq } from 'drizzle-orm';
import { categoriesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { Text, LogoView, H3 } from '@ui';
import Root, { LogoWrap } from './master-pane.styles';

import type { ServiceT } from '@models';

const MasterPane = () => {
	const { t } = useTranslation();
	const service = useAddSubcriptionStore((state) => state);
	const {
		data: [category]
	} = useLiveQuery(db.select().from(categoriesTable).where(eq(categoriesTable.slug, service.category_slug)), []);

	const color = service.color || category?.color || 'transparent';

	return (
		<Root>
			<LogoWrap>
				<LogoView
					name={service.title}
					emoji={category?.emoji}
					url={service.logo_url}
					color={color}
					slug={service.slug}
					size={96}
				/>
			</LogoWrap>

			<H3>{service.title}</H3>

			<H3>
				<H3>10.99</H3>
				<H3>USD</H3>
			</H3>

			<H3>First Payment Date</H3>
			<H3>Billing Cycle</H3>
			<H3>With Trial</H3>

			<H3>{category?.title ?? t(`category.${service.category_slug}`) ?? 'No Category'}</H3>
			<H3>Payment Method</H3>
		</Root>
	);
};

export default MasterPane;
