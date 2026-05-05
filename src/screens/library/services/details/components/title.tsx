import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { TextField, LabeledContent } from '@expo/ui/swift-ui';
import { font, foregroundStyle, multilineTextAlignment, contentShape, shapes } from '@expo/ui/swift-ui/modifiers';

import type { ServiceEditParams } from '@screens/library/services';

type Props = {
	title: ServiceEditParams['title'];
	onChangeTitle: (value: string) => void;
};

const Title = ({ title, onChangeTitle }: Props) => {
	const theme = useTheme();
	const { t } = useTranslation();

	return (
		<LabeledContent
			label={t('library.details.fields.title')}
			modifiers={[contentShape(shapes.rectangle()), font({ size: 16, weight: 'regular', design: 'rounded' })]}
		>
			<TextField
				defaultValue={title}
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
