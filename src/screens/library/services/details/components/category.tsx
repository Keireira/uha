import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { useRouter } from 'expo-router';

import db from '@db';
import { eq } from 'drizzle-orm';
import { categoriesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { useAccent } from '@hooks';
import { withAlpha } from '@lib/colors';

import { font, foregroundStyle, multilineTextAlignment, onTapGesture } from '@expo/ui/swift-ui/modifiers';
import { Text, Image, HStack, LabeledContent } from '@expo/ui/swift-ui';

import type { ServiceEditParams } from '@screens/library/services';

type Props = {
	categorySlug: ServiceEditParams['category_slug'];
};

const Category = ({ categorySlug }: Props) => {
	const router = useRouter();
	const { t } = useTranslation();
	const theme = useTheme();
	const settingAccent = useAccent();

	const { data: [category] = [] } = useLiveQuery(
		db.select().from(categoriesTable).where(eq(categoriesTable.slug, categorySlug)),
		[categorySlug]
	);

	const label = categorySlug
		? t(`category.${categorySlug}`, { defaultValue: category?.title ?? categorySlug })
		: '—';

	const openCategoryPicker = () => {
		router.push({
			pathname: '/(pickers)/select-category',
			params: { target: 'library_service_category' }
		});
	};

	return (
		<LabeledContent
			label={t('library.details.fields.category')}
			modifiers={[onTapGesture(openCategoryPicker)]}
		>
			<HStack spacing={6}>
				<Text
					modifiers={[
						multilineTextAlignment('trailing'),
						foregroundStyle(theme.text.secondary),
						font({ size: 16, weight: 'regular', design: 'rounded' })
					]}
				>
					{label}
				</Text>
				<Image systemName="chevron.right" size={12} color={withAlpha(settingAccent, 0.6)} />
			</HStack>
		</LabeledContent>
	);
};

export default Category;
