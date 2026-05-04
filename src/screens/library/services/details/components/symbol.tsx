import React from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { useAccent } from '@hooks';
import { withAlpha } from '@lib/colors';

import { swipeActions } from '@modules/expo-ui-modifiers';
import { Text, Image, HStack, LabeledContent } from '@expo/ui/swift-ui';
import { font, foregroundStyle, multilineTextAlignment, onTapGesture } from '@expo/ui/swift-ui/modifiers';

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
			<HStack spacing={8}>
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
				<Image systemName="chevron.right" size={12} color={withAlpha(settingAccent, 0.6)} />
			</HStack>
		</LabeledContent>
	);
};

export default Symbol;
