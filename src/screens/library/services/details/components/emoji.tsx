import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { useAccent } from '@hooks';

import { swipeActions } from '@modules/expo-ui-modifiers';
import { TextField, LabeledContent } from '@expo/ui/swift-ui';
import { font, foregroundStyle, multilineTextAlignment, contentShape, shapes } from '@expo/ui/swift-ui/modifiers';

import type { ServiceEditParams } from '@screens/library/services';

type Props = {
	emoji: ServiceEditParams['emoji'];
	onChangeEmoji: (value: string) => void;
	resetToInitialEmoji: () => void;
	resetEmoji: () => void;
};

const Emoji = ({ emoji, onChangeEmoji, resetToInitialEmoji, resetEmoji }: Props) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const settingAccent = useAccent();

	return (
		<LabeledContent
			label={t('library.details.fields.emoji')}
			modifiers={[
				contentShape(shapes.rectangle()),
				font({ size: 16, weight: 'regular', design: 'rounded' }),
				...swipeActions({
					actions: [
						{
							id: 'reset',
							edge: 'leading',
							systemImage: 'arrow.counterclockwise',
							tint: settingAccent,
							onPress: resetToInitialEmoji
						},
						{
							id: 'delete',
							enabled: Boolean(emoji),
							systemImage: 'pencil.and.outline',
							tint: theme.semantic.error,
							onPress: resetEmoji,
							label: 'Clear'
						}
					]
				})
			]}
		>
			<TextField
				defaultValue={emoji || ''}
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
