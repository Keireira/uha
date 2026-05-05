import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import {
	font,
	shapes,
	contentShape,
	foregroundStyle,
	onLongPressGesture,
	multilineTextAlignment
} from '@expo/ui/swift-ui/modifiers';
import { Text, TextField, LabeledContent } from '@expo/ui/swift-ui';

import type { ServiceEditParams } from '@screens/library/services';

type Props = {
	slug: ServiceEditParams['slug'];
	onChangeSlug: (value: string) => void;
};

const Slug = ({ slug, onChangeSlug }: Props) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const [isEditable, setIsEditable] = useState(false);

	const valueMods = [
		multilineTextAlignment('trailing'),
		foregroundStyle(theme.text.secondary),
		font({ size: 16, weight: 'regular', design: 'rounded' })
	];

	if (isEditable) {
		return (
			<LabeledContent label={t('library.details.fields.slug')}>
				<TextField
					autoFocus
					defaultValue={slug}
					placeholder="slug"
					onValueChange={onChangeSlug}
					modifiers={valueMods}
				/>
			</LabeledContent>
		);
	}

	return (
		<LabeledContent
			label={t('library.details.fields.slug')}
			modifiers={[contentShape(shapes.rectangle()), onLongPressGesture(() => setIsEditable(true))]}
		>
			<Text modifiers={valueMods}>{slug || '—'}</Text>
		</LabeledContent>
	);
};

export default Slug;
