import React from 'react';
import { format } from 'date-fns';
import { useTheme } from 'styled-components/native';
import { withAlpha } from '@lib/colors';
import { parsePrice } from '@lib';
import { useAccent } from '@hooks';
import { useActiveEvent } from '@screens/crossroad/add-subscription/pickers/edit-event/hooks';
import { Section, HStack, Text, Image, Spacer, TextField } from '@expo/ui/swift-ui';
import {
	font,
	frame,
	padding,
	keyboardType,
	glassEffect,
	foregroundStyle,
	multilineTextAlignment
} from '@expo/ui/swift-ui/modifiers';

import type { Props } from './amount-section.d';

type ActiveEvent = ReturnType<typeof useActiveEvent>;

const ROW_LABELS: Record<string, string> = {
	refund: 'Refunded',
	first_payment: 'Amount',
	price_up: 'New price',
	price_down: 'New price'
};

const getPriorPrice = (activeEvent: ActiveEvent, date?: Date): number | undefined => {
	if (activeEvent.type !== 'price_up' && activeEvent.type !== 'price_down') return undefined;

	const isoDate = format(date ?? new Date(), 'yyyy-MM-dd');

	const prior = activeEvent.timeline
		.filter(
			(e) =>
				e.id !== activeEvent.event?.id &&
				(e.type === 'first_payment' || e.type === 'price_up' || e.type === 'price_down') &&
				e.date <= isoDate
		)
		.sort((a, b) => b.date.localeCompare(a.date))[0];

	return prior && 'amount' in prior ? prior.amount : undefined;
};

const getPriceWarning = (
	activeEvent: ActiveEvent,
	amountText: string,
	priorPrice: number | undefined
): string | null => {
	if (priorPrice == null) return null;

	const parsed = parsePrice(amountText);
	if (parsed == null || parsed <= 0) return null;

	const formattedPrior = `${priorPrice.toFixed(2)} ${activeEvent.currency}`;

	if (activeEvent.type === 'price_up' && parsed <= priorPrice) {
		return `New price should be higher than the previous ${formattedPrior}.`;
	}
	if (activeEvent.type === 'price_down' && parsed >= priorPrice) {
		return `New price should be lower than the previous ${formattedPrior}.`;
	}
	return null;
};

const AmountSection = ({ date, amountText, setAmountText }: Props) => {
	const theme = useTheme();
	const settingAccent = useAccent();
	const activeEvent = useActiveEvent();

	const priorPrice = getPriorPrice(activeEvent, date);
	const label = ROW_LABELS[activeEvent?.type ?? ''] ?? 'Amount';
	const priceWarning = getPriceWarning(activeEvent, amountText, priorPrice);

	const footer = priceWarning ? (
		<HStack spacing={5} alignment="center">
			<Image systemName="exclamationmark.triangle.fill" size={12} color={theme.accents.orange} />
			<Text modifiers={[foregroundStyle(theme.accents.orange), font({ size: 13, weight: 'medium' })]}>
				{priceWarning}
			</Text>
		</HStack>
	) : undefined;

	return (
		<Section title="Amount" footer={footer}>
			<HStack spacing={8} alignment="center">
				<Text modifiers={[font({ size: 16, weight: 'medium' })]}>{label}</Text>
				<Spacer />
				<TextField
					defaultValue={amountText}
					onValueChange={setAmountText}
					placeholder="0.00"
					modifiers={[
						font({ size: 17, weight: 'semibold' }),
						multilineTextAlignment('trailing'),
						keyboardType('decimal-pad'),
						frame({ minWidth: 60 })
					]}
				/>
				<HStack
					spacing={0}
					modifiers={[
						padding({ horizontal: 8, vertical: 4 }),
						glassEffect({
							glass: {
								interactive: false,
								variant: 'regular',
								tint: withAlpha(settingAccent, 0.2)
							},
							shape: 'capsule'
						})
					]}
				>
					<Text modifiers={[font({ size: 13, weight: 'bold' }), foregroundStyle(settingAccent)]}>
						{activeEvent.currency}
					</Text>
				</HStack>
			</HStack>
		</Section>
	);
};

export default AmountSection;
