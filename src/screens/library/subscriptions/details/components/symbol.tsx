import React from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { useAccent } from '@hooks';

import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

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

import type { SFSymbol } from 'expo-symbols';

type Props = {
	symbol: SFSymbol | undefined;
	color: string | undefined;
};

const Symbol = ({ symbol, color }: Props) => {
	const router = useRouter();
	const { t } = useTranslation();
	const theme = useTheme();
	const settingAccent = useAccent();
	const setLogoSymbol = useDraftStore((state) => state.actions.setLogoSymbol);

	const openLogoPicker = () => {
		router.push({
			pathname: '/(pickers)/select-symbol-logo',
			params: { target: 'add_subscription_logo' }
		});
	};

	const clearSymbol = () => {
		setLogoSymbol(undefined);
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
							id: 'clear',
							enabled: Boolean(symbol),
							systemImage: 'pencil.and.outline',
							tint: theme.semantic.error,
							onPress: clearSymbol,
							label: t('library.details.actions.clear')
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
