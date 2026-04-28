import React from 'react';
import { format } from 'date-fns';
import { parsePrice } from '@lib';
import { useAccent } from '@hooks';
import { withAlpha } from '@lib/colors';
import { useLocales } from 'expo-localization';
import { useTheme } from 'styled-components/native';
import { useActiveEvent } from '@screens/crossroad/add-subscription/pickers/edit-event/hooks';

import db from '@db';
import { eq } from 'drizzle-orm';
import { currenciesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import {
	font,
	frame,
	padding,
	keyboardType,
	glassEffect,
	foregroundStyle,
	multilineTextAlignment
} from '@expo/ui/swift-ui/modifiers';
import { Section, HStack, Text, Image, TextField } from '@expo/ui/swift-ui';

import type { Props } from './amount-section.d';
import type { EventTypeT } from '@screens/crossroad/add-subscription/events';

type ActiveEvent = ReturnType<typeof useActiveEvent>;

const ROW_LABELS: Partial<Record<EventTypeT, string>> = {
	refund: 'Refunded',
	first_payment: 'Amount',
	price_up: 'New price',
	price_down: 'New price'
};

const getPriorPrice = (activeEvent: ActiveEvent, date?: Date) => {
	if (!['price_up', 'price_down'].includes(activeEvent?.type || '')) return;

	const isoDate = format(date ?? new Date(), 'yyyy-MM-dd');

	const [prior] = activeEvent.timeline
		.filter((event) => {
			const isOlderEvent = event.date <= isoDate;
			const isNotCurrentEvent = event.id !== activeEvent.event?.id;
			const isEligibleEvent = ['first_payment', 'price_up', 'price_down'].includes(event.type);

			return isNotCurrentEvent && isEligibleEvent && isOlderEvent;
		})
		.sort((a, b) => b.date.localeCompare(a.date));

	if (prior && 'amount' in prior && typeof prior.amount === 'number') {
		return prior.amount;
	}

	return;
};

const useGetPriceWarning = (currencyCode = '') => {
	const [locale] = useLocales();

	const {
		data: [currency]
	} = useLiveQuery(db.select().from(currenciesTable).where(eq(currenciesTable.id, currencyCode)).limit(1), [
		currencyCode
	]);

	const getPriceWarning = (activeEvent: ActiveEvent, amountText: string, priorPrice?: number) => {
		if (!(priorPrice && currency)) return;

		const parsed = parsePrice(amountText);
		if (!parsed) return;

		const formattedPrior = priorPrice.toLocaleString(locale.languageTag, {
			style: 'currency',
			currency: currency.id,
			currencyDisplay: 'symbol',
			minimumFractionDigits: priorPrice > 1000 ? 0 : currency.fraction_digits,
			maximumFractionDigits: priorPrice > 1000 ? 0 : currency.fraction_digits
		});

		if (activeEvent.type === 'price_up' && parsed <= priorPrice) {
			return `New price should be higher than ${formattedPrior}.`;
		}

		if (activeEvent.type === 'price_down' && parsed >= priorPrice) {
			return `New price should be lower than ${formattedPrior}.`;
		}

		return;
	};

	return getPriceWarning;
};

const AmountSection = ({ date, amountText, setAmountText }: Props) => {
	const theme = useTheme();
	const settingAccent = useAccent();
	const activeEvent = useActiveEvent();
	const getPriceWarning = useGetPriceWarning(activeEvent.currency);

	const priorPrice = getPriorPrice(activeEvent, date);
	const label = activeEvent?.type ? ROW_LABELS[activeEvent.type] : 'Amount';
	const priceWarning = getPriceWarning(activeEvent, amountText, priorPrice);

	return (
		<Section
			title="Amount"
			footer={
				<HStack spacing={12} alignment="center">
					{priceWarning && (
						<Image systemName="exclamationmark.triangle.fill" size={16} color={theme.semantic.warning} />
					)}

					<Text modifiers={[foregroundStyle(theme.semantic.warning), font({ size: 14, weight: 'regular' })]}>
						{priceWarning}
					</Text>
				</HStack>
			}
		>
			<HStack spacing={8} alignment="center">
				<Text modifiers={[font({ size: 16, weight: 'medium' })]}>{label}</Text>

				<TextField
					defaultValue={amountText}
					onValueChange={setAmountText}
					placeholder="0.00"
					modifiers={[
						font({ size: 24, weight: 'semibold' }),
						multilineTextAlignment('trailing'),
						keyboardType('decimal-pad'),
						frame({ minWidth: 120, alignment: 'center' })
					]}
				/>

				<HStack
					spacing={0}
					modifiers={[
						padding({
							horizontal: 8,
							vertical: 4
						}),
						glassEffect({
							glass: {
								variant: 'regular',
								interactive: false,
								tint: withAlpha(settingAccent, 0.2)
							},
							shape: 'capsule'
						})
					]}
				>
					<Text modifiers={[font({ size: 17, weight: 'bold' }), foregroundStyle(settingAccent)]}>
						{activeEvent.currency}
					</Text>
				</HStack>
			</HStack>
		</Section>
	);
};

export default AmountSection;
