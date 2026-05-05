import React from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import db from '@db';
import { eq } from 'drizzle-orm';
import { categoriesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import {
	font,
	shapes,
	contentShape,
	onTapGesture,
	foregroundStyle,
	multilineTextAlignment
} from '@expo/ui/swift-ui/modifiers';
import { Text, LabeledContent } from '@expo/ui/swift-ui';

import type { ServiceEditParams } from '@screens/library/services';

type Props = {
	categorySlug: ServiceEditParams['category_slug'];
};

const Category = ({ categorySlug }: Props) => {
	const theme = useTheme();
	const router = useRouter();
	const { t } = useTranslation();

	const { data: [category] = [] } = useLiveQuery(
		db.select().from(categoriesTable).where(eq(categoriesTable.slug, categorySlug)),
		[categorySlug]
	);

	const openCategoryPicker = () => {
		router.push({
			pathname: '/(pickers)/select-category',
			params: { target: 'library_service_category' }
		});
	};

	return (
		<LabeledContent
			label={t('library.details.fields.category')}
			modifiers={[contentShape(shapes.rectangle()), onTapGesture(openCategoryPicker)]}
		>
			<Text
				modifiers={[
					multilineTextAlignment('trailing'),
					foregroundStyle(theme.text.secondary),
					font({ size: 16, weight: 'regular', design: 'rounded' })
				]}
			>
				{category?.title || t(`category.${categorySlug}`, { defaultValue: categorySlug })}
			</Text>
		</LabeledContent>
	);
};

export default Category;
