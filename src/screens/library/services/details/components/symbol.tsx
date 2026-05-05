import React from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { useAccent } from '@hooks';

import {
	font,
	shapes,
	contentShape,
	onTapGesture,
	foregroundStyle,
	multilineTextAlignment
} from '@expo/ui/swift-ui/modifiers';
import { swipeActions } from '@modules/expo-ui-modifiers';
import { Text, Image, LabeledContent } from '@expo/ui/swift-ui';

import type { ServiceEditParams } from '@screens/library/services';

type Props = {
	symbol: ServiceEditParams['symbol'];
	color: ServiceEditParams['color'];
	resetSymbol: () => void;
	resetToInitialSymbol: () => void;
};

const Symbol = ({ symbol, color, resetSymbol, resetToInitialSymbol }: Props) => {
	const router = useRouter();
	const { t } = useTranslation();
	const theme = useTheme();
	const settingAccent = useAccent();

	const openLogoPicker = () => {
		router.push({
			pathname: '/(pickers)/select-symbol-logo',
			params: { target: 'library_service_logo' }
		});
	};

	return (
		<LabeledContent
			label={t('library.details.fields.symbol')}
			modifiers={[
				contentShape(shapes.rectangle()),
				onTapGesture(openLogoPicker),
				...swipeActions({
					actions: [
						{
							id: 'reset',
							edge: 'leading',
							systemImage: 'arrow.counterclockwise',
							tint: settingAccent,
							onPress: resetToInitialSymbol
						},
						{
							id: 'delete',
							enabled: Boolean(symbol),
							systemImage: 'pencil.and.outline',
							tint: theme.semantic.error,
							onPress: resetSymbol,
							label: 'Clear'
						}
					]
				})
			]}
		>
			{symbol ? (
				<Image systemName={symbol} size={22} color={color || settingAccent} />
			) : (
				<Text
					modifiers={[
						multilineTextAlignment('trailing'),
						foregroundStyle(theme.text.secondary),
						font({ size: 16, weight: 'regular', design: 'rounded' })
					]}
				>
					—
				</Text>
			)}
		</LabeledContent>
	);
};

export default Symbol;
