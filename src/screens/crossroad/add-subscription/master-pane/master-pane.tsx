import React from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useNewSubStore } from '../hooks';

import db from '@db';
import { eq } from 'drizzle-orm';
import { categoriesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { LogoView, H3 } from '@ui';
import { GlassView } from 'expo-glass-effect';
import Root, { LogoWrap, PressableWrap } from './master-pane.styles';

// import type { ServiceT } from '@models';

const MasterPane = () => {
	const router = useRouter();
	// const settingAccent = useAccent();

	const { t } = useTranslation();
	const service = useNewSubStore((state) => state);
	const {
		data: [category]
	} = useLiveQuery(db.select().from(categoriesTable).where(eq(categoriesTable.slug, service.category_slug)), []);

	const color = service.color || category?.color || '#fafafa';

	const goToColorLogoPicker = () => {
		router.push({
			pathname: '/edit-logo-sheet',
			params: {
				logo_url: service.logo_url || '',
				symbol: service.symbol || '',
				color: service.color || ''
			}
		});
	};

	return (
		<>
			<Root>
				<LogoWrap>
					<PressableWrap onPress={goToColorLogoPicker}>
						<LogoView
							name={service.title}
							symbolName={service?.symbol}
							emoji={category?.emoji}
							url={service.logo_url}
							color={color}
							slug={service.slug}
							size={96}
						/>
					</PressableWrap>
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
		</>
	);
};

export default MasterPane;
