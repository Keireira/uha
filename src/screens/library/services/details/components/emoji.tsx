import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { useAccent } from '@hooks';

import { font, foregroundStyle, multilineTextAlignment } from '@expo/ui/swift-ui/modifiers';
import { swipeActions } from '@modules/expo-ui-modifiers';
import { TextField, LabeledContent } from '@expo/ui/swift-ui';

import type { ServiceEditParams } from '@screens/library/services';

type Props = {
	emoji: ServiceEditParams['emoji'];
	onChangeEmoji: (value: string) => void;
	resetToInitialEmoji: () => void;
};

const Emoji = ({ emoji, onChangeEmoji, resetToInitialEmoji }: Props) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const settingAccent = useAccent();

	return (
		<LabeledContent
			label={t('library.details.fields.emoji')}
			modifiers={[
				font({ size: 16, weight: 'regular', design: 'rounded' }),
				...swipeActions({
					actions: [
						{
							id: 'reset',
							edge: 'leading',
							systemImage: 'arrow.counterclockwise',
							tint: settingAccent,
							onPress: resetToInitialEmoji
						}
					]
				})
			]}
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
