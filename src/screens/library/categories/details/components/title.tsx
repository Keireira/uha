import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { TextField, LabeledContent } from '@expo/ui/swift-ui';
import { font, foregroundStyle, multilineTextAlignment } from '@expo/ui/swift-ui/modifiers';

import type { CategoryEditParams } from '@screens/library/categories';

type Props = {
	title: CategoryEditParams['title'];
	onChangeTitle: (value: string) => void;
};

const Title = ({ title, onChangeTitle }: Props) => {
	const theme = useTheme();
	const { t } = useTranslation();

	return (
		<LabeledContent
			label={t('library.details.fields.title')}
			modifiers={[font({ size: 16, weight: 'regular', design: 'rounded' })]}
		>
			<TextField
				defaultValue={title}
				placeholder={t('library.details.placeholders.title_override')}
				onValueChange={onChangeTitle}
				modifiers={[
					multilineTextAlignment('trailing'),
					foregroundStyle(theme.text.secondary),
					font({ size: 16, weight: 'regular', design: 'rounded' })
				]}
			/>
		</LabeledContent>
	);
};

export default Title;
