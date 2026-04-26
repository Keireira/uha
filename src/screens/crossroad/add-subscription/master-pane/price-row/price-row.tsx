import React from 'react';
import { useRouter } from 'expo-router';
import { useShallow } from 'zustand/react/shallow';

import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';
import { keyboardType } from '@expo/ui/swift-ui/modifiers';

import { TextButton, TextField } from '@ui';
import Root, { PriceField } from './price-row.styles';

const parsePrice = (input: string) => {
	const cleaned = input.replace(/[^\d.,]/g, '').replace(',', '.');

	if (!cleaned) return undefined;

	const n = parseFloat(cleaned);
	return Number.isFinite(n) ? n : undefined;
};

const PriceRow = () => {
	const router = useRouter();

	const { price, currency, setPrice } = useDraftStore(
		useShallow((state) => ({
			price: state.price,
			currency: state.currency,
			setPrice: state.actions.setPrice
		}))
	);

	const handleValueChange = (text: string) => {
		const parsed = parsePrice(text);

		setPrice(parsed ?? 0);
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
		<Root>
			<PriceField>
				<TextField
					defaultValue={typeof price === 'number' ? String(price) : ''}
					onValueChange={handleValueChange}
					placeholder="0.00"
					fontSize={34}
					fontWeight="bold"
					modifiers={[keyboardType('decimal-pad')]}
					matchContents={{ vertical: true }}
				/>
			</PriceField>

			<TextButton title={currency ?? 'USD'} onPress={showCurrencyPicker} />
		</Root>
	);
};

export default PriceRow;
