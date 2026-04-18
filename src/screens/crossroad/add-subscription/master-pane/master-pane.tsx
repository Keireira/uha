import React from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';

import db from '@db';
import { eq } from 'drizzle-orm';
import { categoriesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { useDraftStore } from '../hooks';

import LogoRow from './logo-row';
import { H3, TextField } from '@ui';
import { Pressable } from 'react-native';
import Root, { TitleField } from './master-pane.styles';

const MasterPane = () => {
	const router = useRouter();
	const { t } = useTranslation();

	const draft = useDraftStore(
		useShallow((state) => ({
			title: state.title,
			category_slug: state.category_slug,
			logoSnapshot: state.logoSnapshot,
			setTitle: state.actions.setTitle
		}))
	);

	const {
		data: [category]
	} = useLiveQuery(db.select().from(categoriesTable).where(eq(categoriesTable.slug, draft.category_slug)), []);

	const showCurrencyPicker = () => {
		router.push({
			pathname: `/(pickers)/select-currency`,
			params: {
				target: 'add_subscription_currency'
			}
		});
	};

	return (
		<Root>
			<LogoRow />

			<TitleField>
				<TextField
					defaultValue={draft.title}
					onValueChange={draft.setTitle}
					placeholder="Service name"
					align="center"
					fontSize={22}
					fontWeight="bold"
				/>
			</TitleField>

			<H3>
				<H3>10.99</H3>
				<Pressable onPress={showCurrencyPicker}>
					<H3>USD</H3>
				</Pressable>
			</H3>

			<H3>First Payment Date</H3>
			<H3>Billing Cycle</H3>
			<H3>With Trial</H3>

			<H3>{category?.title ?? t(`category.${draft.category_slug}`)}</H3>
			<H3>Payment Method</H3>
		</Root>
	);
};

export default MasterPane;
