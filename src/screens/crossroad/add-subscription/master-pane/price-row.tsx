import React from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';

import { useAccent } from '@hooks';
import { withAlpha } from '@lib/colors';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';
import { selectCurrencyId, selectCurrentAmount } from '@screens/crossroad/add-subscription/events';
import {
	font,
	padding,
	glassEffect,
	buttonStyle,
	controlSize,
	keyboardType,
	foregroundStyle,
	multilineTextAlignment
} from '@expo/ui/swift-ui/modifiers';
import { HStack, Button, TextField } from '@expo/ui/swift-ui';

const parsePrice = (input: string) => {
	const cleaned = input.replace(/[^\d.,]/g, '').replace(',', '.');

	if (!cleaned) {
		return undefined;
	}

	const price = Number.parseFloat(cleaned);

	return Number.isFinite(price) ? Math.abs(price) : undefined;
};

type Props = {
	focusVersion: number;
};

const PriceRow = ({ focusVersion }: Props) => {
	const theme = useTheme();
	const router = useRouter();
	const settingAccent = useAccent();

	const timeline = useDraftStore((state) => state.timeline);
	const currency = selectCurrencyId(timeline);
	const price = selectCurrentAmount(timeline);
	const setPrice = useDraftStore((state) => state.actions.setFirstPaymentAmount);

	const handleValueChange = (text: string) => {
		const parsed = parsePrice(text);

		setPrice(parsed ?? null);
	};

	const showCurrencyPicker = () => {
		router.push({
			pathname: `/(pickers)/select-currency`,
			params: {
				target: 'add_subscription_currency'
			}
		});
	};

	return (
		<HStack modifiers={[padding({ bottom: 18 })]}>
				<TextField
					key={focusVersion}
					defaultValue={typeof price === 'number' ? String(price) : ''}
				onValueChange={handleValueChange}
				placeholder="0.00"
				modifiers={[
					font({ size: 34, weight: 'bold' }),
					foregroundStyle(theme.text.primary),
					multilineTextAlignment('leading'),
					keyboardType('decimal-pad')
				]}
			/>

			<Button
				role="default"
				label={currency ?? 'USD'}
				onPress={showCurrencyPicker}
				modifiers={[
					glassEffect({
						glass: {
							interactive: true,
							variant: 'regular',
							tint: withAlpha(settingAccent, 0.2)
						},
						shape: 'capsule'
					}),
					controlSize('regular'),
					buttonStyle('bordered'),
					foregroundStyle(theme.static.white)
				]}
			/>
		</HStack>
	);
};

export default PriceRow;
