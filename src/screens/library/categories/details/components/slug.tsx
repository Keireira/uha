import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { Text, TextField, LabeledContent } from '@expo/ui/swift-ui';
import { font, multilineTextAlignment, foregroundStyle, onLongPressGesture } from '@expo/ui/swift-ui/modifiers';

import type { CategoryEditParams } from '@screens/library/categories';

type Props = {
	isSystem: boolean;
	slug: CategoryEditParams['slug'];
	onChangeSlug: (value: string) => void;
};

const Slug = ({ isSystem, slug, onChangeSlug }: Props) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const [isSlugEditable, setIsSlugEditable] = useState(false);

	const enableSlugEdit = () => {
		if (isSystem) return;

		setIsSlugEditable(true);
	};

	if (isSlugEditable && !isSystem) {
		return (
			<LabeledContent label={t('library.details.fields.slug')}>
				<TextField
					defaultValue={slug}
					placeholder={t('library.details.placeholders.slug')}
					onValueChange={onChangeSlug}
					modifiers={[
						multilineTextAlignment('trailing'),
						foregroundStyle(theme.text.secondary),
						font({ size: 16, weight: 'regular', design: 'rounded' })
					]}
				/>
			</LabeledContent>
		);
	}

	return (
		<LabeledContent label={t('library.details.fields.slug')} modifiers={[onLongPressGesture(enableSlugEdit)]}>
			<Text
				modifiers={[
					multilineTextAlignment('trailing'),
					foregroundStyle(theme.text.secondary),
					font({ size: 16, weight: 'regular', design: 'rounded' })
				]}
			>
				{slug}
			</Text>
		</LabeledContent>
	);
};

export default Slug;
