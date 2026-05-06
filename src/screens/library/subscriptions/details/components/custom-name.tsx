import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { TextField, LabeledContent } from '@expo/ui/swift-ui';
import { font, foregroundStyle, multilineTextAlignment, contentShape, shapes } from '@expo/ui/swift-ui/modifiers';

type Props = {
	customName: string;
	onChangeCustomName: (value: string) => void;
};

const CustomName = ({ customName, onChangeCustomName }: Props) => {
	const theme = useTheme();
	const { t } = useTranslation();

	return (
		<LabeledContent
			label={t('library.details.fields.title')}
			modifiers={[contentShape(shapes.rectangle()), font({ size: 16, weight: 'regular', design: 'rounded' })]}
		>
			<TextField
				defaultValue={customName}
				onValueChange={onChangeCustomName}
				modifiers={[
					multilineTextAlignment('trailing'),
					foregroundStyle(theme.text.secondary),
					font({ size: 16, weight: 'regular', design: 'rounded' })
				]}
			/>
		</LabeledContent>
	);
};

export default CustomName;
