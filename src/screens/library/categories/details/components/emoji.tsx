import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { TextField, LabeledContent } from '@expo/ui/swift-ui';
import { font, foregroundStyle, multilineTextAlignment } from '@expo/ui/swift-ui/modifiers';

import type { CategoryEditParams } from '@screens/library/categories';

type Props = {
	emoji: CategoryEditParams['emoji'];
	onChangeEmoji: (value: string) => void;
};

const Emoji = ({ emoji, onChangeEmoji }: Props) => {
	const theme = useTheme();
	const { t } = useTranslation();

	return (
		<LabeledContent
			label={t('library.details.fields.emoji')}
			modifiers={[font({ size: 16, weight: 'regular', design: 'rounded' })]}
		>
			<TextField
				defaultValue={emoji}
				placeholder="One emoji to symbolize"
				onValueChange={onChangeEmoji}
				modifiers={[
					multilineTextAlignment('trailing'),
					foregroundStyle(theme.text.secondary),
					font({ size: 16, weight: 'regular', design: 'rounded' })
				]}
			/>
		</LabeledContent>
	);
};

export default Emoji;
