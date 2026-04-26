import React, { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from 'styled-components/native';
import { useShallow } from 'zustand/react/shallow';
import { SymbolView } from 'expo-symbols';

import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';
import {
	EVENT_META,
	MIN_EVENT_DATE,
	isPricedEvent,
	isPauseEvent,
	isCancellationEvent,
	type EventTypeT
} from '@screens/crossroad/add-subscription/events';

import { TextField } from '@ui';
import { Header } from './components';
import { Host, DatePicker } from '@expo/ui/swift-ui';
import { datePickerStyle, keyboardType } from '@expo/ui/swift-ui/modifiers';

import Root, {
	Section,
	SectionLabel,
	TypeHero,
	TypeHeroIcon,
	TypeHeroText,
	TypeHeroLabel,
	TypeHeroDescription,
	Card,
	Row,
	RowLabel,
	AmountWrap,
	CurrencyBadge,
	ReasonField,
	WarningRow,
	WarningText
} from './edit-event.styles';

type SearchParamsT = { id?: string; type?: EventTypeT };

const parsePrice = (input: string): number | undefined => {
	const cleaned = input.replace(/[^\d.,]/g, '').replace(',', '.');
	if (!cleaned) return undefined;

	const n = parseFloat(cleaned);
	return Number.isFinite(n) ? n : undefined;
};

const isPricedType = (type: EventTypeT) =>
	type === 'first_payment' || type === 'price_up' || type === 'price_down' || type === 'refund';

const EditEventScreen = () => {
	const theme = useTheme();
	const { id, type: typeParam } = useLocalSearchParams<SearchParamsT>();

	const { defaultCurrency, events } = useDraftStore(
		useShallow((state) => ({
			defaultCurrency: state.currency ?? 'USD',
			events: state.timeline
		}))
	);

	const existing = id ? events.find((event) => event.id === id) : undefined;
	const activeType = existing?.type ?? typeParam;

	const [date, setDate] = useState<Date>(() => (existing ? parseISO(existing.date) : new Date()));

	const [amountText, setAmountText] = useState<string>(() => {
		if (existing && isPricedEvent(existing)) return String(existing.amount);

		// New refund — default to the most recent known price (first_payment / price_up / price_down).
		if (typeParam === 'refund') {
			const latestPriced = events
				.filter((e) => e.type === 'first_payment' || e.type === 'price_up' || e.type === 'price_down')
				.sort((a, b) => b.date.localeCompare(a.date))[0];

			if (latestPriced && 'amount' in latestPriced && latestPriced.amount > 0) {
				return String(latestPriced.amount);
			}
		}

		return '';
	});

	const [reason, setReason] = useState<string>(() => {
		if (existing && (isPauseEvent(existing) || isCancellationEvent(existing))) return existing.reason ?? '';
		return '';
	});

	const currency = existing && isPricedEvent(existing) ? existing.currency : defaultCurrency;

	const priorPrice = useMemo(() => {
		if (activeType !== 'price_up' && activeType !== 'price_down') return undefined;

		const isoDate = format(date, 'yyyy-MM-dd');
		const candidates = events
			.filter((e) => e.id !== existing?.id)
			.filter((e) => e.type === 'first_payment' || e.type === 'price_up' || e.type === 'price_down')
			.filter((e) => e.date <= isoDate)
			.sort((a, b) => b.date.localeCompare(a.date));

		const prior = candidates[0];
		return prior && 'amount' in prior ? prior.amount : undefined;
	}, [events, existing?.id, activeType, date]);

	const priceWarning = useMemo(() => {
		if (priorPrice == null) return null;
		const parsed = parsePrice(amountText);
		if (parsed == null || parsed <= 0) return null;

		if (activeType === 'price_up' && parsed <= priorPrice) {
			return `New price should be higher than the previous ${priorPrice.toFixed(2)} ${currency}.`;
		}
		if (activeType === 'price_down' && parsed >= priorPrice) {
			return `New price should be lower than the previous ${priorPrice.toFixed(2)} ${currency}.`;
		}
		return null;
	}, [activeType, amountText, priorPrice, currency]);

	const meta = EVENT_META[activeType || 'first_payment'];
	const tone = theme.accents[meta.accent];

	const amountRowLabel = activeType === 'refund' ? 'Refunded' : activeType === 'first_payment' ? 'Amount' : 'New price';

	return (
		<>
			<Header amountText={amountText} reason={reason} />

			<Root>
				<TypeHero $tone={tone}>
					<TypeHeroIcon $tone={tone}>
						<SymbolView name={meta.symbol} size={18} tintColor={theme.static.white} weight="bold" />
					</TypeHeroIcon>
					<TypeHeroText>
						<TypeHeroLabel $tone={tone}>{meta.label}</TypeHeroLabel>
						<TypeHeroDescription>{meta.description}</TypeHeroDescription>
					</TypeHeroText>
				</TypeHero>

				<Section>
					<SectionLabel>When</SectionLabel>
					<Card>
						<Row $isLast>
							<RowLabel>Date</RowLabel>
							<Host matchContents>
								<DatePicker
									selection={date}
									displayedComponents={['date']}
									onDateChange={setDate}
									range={{ start: MIN_EVENT_DATE }}
									modifiers={[datePickerStyle('compact')]}
								/>
							</Host>
						</Row>
					</Card>
				</Section>

				{/* Priced events — amount + currency */}
				{isPricedType(activeType) && (
					<Section>
						<SectionLabel>Amount</SectionLabel>
						<Card>
							<Row $isLast>
								<RowLabel>{amountRowLabel}</RowLabel>
								<AmountWrap>
									<TextField
										defaultValue={amountText}
										onValueChange={setAmountText}
										placeholder="0.00"
										fontSize={17}
										fontWeight="semibold"
										align="trailing"
										modifiers={[keyboardType('decimal-pad')]}
										matchContents={{ vertical: true }}
										style={{ flex: 1 }}
									/>
									<CurrencyBadge>{currency}</CurrencyBadge>
								</AmountWrap>
							</Row>
						</Card>

						{priceWarning && (
							<WarningRow>
								<SymbolView
									name="exclamationmark.triangle.fill"
									size={14}
									tintColor={theme.accents.orange}
									weight="semibold"
								/>
								<WarningText>{priceWarning}</WarningText>
							</WarningRow>
						)}
					</Section>
				)}

				{/* Pause / Cancellation — reason */}
				{(activeType === 'pause' || activeType === 'cancellation') && (
					<Section>
						<SectionLabel>Reason (optional)</SectionLabel>
						<Card>
							<ReasonField
								value={reason}
								onChangeText={setReason}
								placeholder={activeType === 'pause' ? 'Why did you pause?' : 'Why did you cancel?'}
							/>
						</Card>
					</Section>
				)}
			</Root>
		</>
	);
};

export default EditEventScreen;
