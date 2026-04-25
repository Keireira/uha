import React, { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from 'styled-components/native';
import { useShallow } from 'zustand/react/shallow';
import { SymbolView } from 'expo-symbols';

import { useAccent } from '@hooks';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';
import {
	EVENT_META,
	EVENT_ORDER,
	MIN_EVENT_DATE,
	availableEventTypes,
	isPricedEvent,
	isTrialEvent,
	isPauseEvent,
	isCancellationEvent,
	type EventTypeT
} from '@screens/crossroad/add-subscription/events';
import type {
	BillingCycleT,
	NewTimelineEventT,
	TimelineEventPatchT
} from '@screens/crossroad/add-subscription/hooks/use-draft-store';

import { TextField } from '@ui';
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
	TypePickerGrid,
	TypeChipWrap,
	TypeChip,
	TypeChipLabel,
	Card,
	Row,
	RowLabel,
	AmountWrap,
	CurrencyBadge,
	ReasonField,
	DurationBlock,
	StepperButton,
	StepperPressable,
	DurationValue,
	DurationUnit,
	UnitRow,
	UnitChipWrap,
	UnitChip,
	UnitLabel,
	Actions,
	PrimaryButton,
	PrimaryLabel,
	DeleteButton,
	WarningRow,
	WarningText
} from './edit-event.styles';

type SearchParamsT = { id?: string; type?: EventTypeT };

const UNITS: BillingCycleT[] = ['days', 'weeks', 'months', 'years'];
const MIN_DURATION = 1;
const MAX_DURATION = 365;
const clampDuration = (n: number) => Math.max(MIN_DURATION, Math.min(MAX_DURATION, n));

const unitLabel = (type: BillingCycleT, value: number) => {
	switch (type) {
		case 'days':
			return value === 1 ? 'day' : 'days';
		case 'weeks':
			return value === 1 ? 'week' : 'weeks';
		case 'months':
			return value === 1 ? 'month' : 'months';
		case 'years':
			return value === 1 ? 'year' : 'years';
	}
};

const parsePrice = (input: string): number | undefined => {
	const cleaned = input.replace(/[^\d.,]/g, '').replace(',', '.');
	if (!cleaned) return undefined;

	const n = parseFloat(cleaned);
	return Number.isFinite(n) ? n : undefined;
};

const isPricedType = (type: EventTypeT) =>
	type === 'first_payment' || type === 'price_up' || type === 'price_down' || type === 'refund';

const EditEventScreen = () => {
	const router = useRouter();
	const theme = useTheme();
	const accent = useAccent();
	const { id, type: typeParam } = useLocalSearchParams<SearchParamsT>();

	const { defaultCurrency, events, addEvent, updateEvent, removeEvent } = useDraftStore(
		useShallow((state) => ({
			defaultCurrency: state.currency ?? 'USD',
			events: state.timeline,
			addEvent: state.actions.addEvent,
			updateEvent: state.actions.updateEvent,
			removeEvent: state.actions.removeEvent
		}))
	);

	const existing = id ? events.find((event) => event.id === id) : undefined;
	const isEdit = !!existing;

	// Available types for this particular add/edit — excludes self when editing.
	const availableTypes = useMemo(() => availableEventTypes(events, existing?.id), [events, existing?.id]);

	// Resolve active type: existing event's type > ?type param > undefined (show picker).
	const activeType: EventTypeT | undefined = existing?.type ?? typeParam;

	/* ─── Shared state ─────────────────────────────── */
	const [date, setDate] = useState<Date>(() => (existing ? parseISO(existing.date) : new Date()));

	/* ─── Priced state (amount) ────────────────────── */
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

	/* ─── Trial state (duration) ───────────────────── */
	const [durationType, setDurationType] = useState<BillingCycleT>(() => {
		if (existing && isTrialEvent(existing)) return existing.duration_type;
		return 'days';
	});
	const [durationValue, setDurationValue] = useState<number>(() => {
		if (existing && isTrialEvent(existing)) return existing.duration_value;
		return 7;
	});

	/* ─── Pause / cancellation state (reason) ──────── */
	const [reason, setReason] = useState<string>(() => {
		if (existing && (isPauseEvent(existing) || isCancellationEvent(existing))) return existing.reason ?? '';
		return '';
	});

	const currency = existing && isPricedEvent(existing) ? existing.currency : defaultCurrency;

	/* ─── Prior-price lookup (for price_up / price_down sanity warning) ── */
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

	/* ─── Validation ───────────────────────────────── */
	const canSave = useMemo(() => {
		if (!activeType) return false;

		if (activeType === 'trial') {
			return durationValue >= MIN_DURATION && durationValue <= MAX_DURATION;
		}

		if (activeType === 'cancellation' || activeType === 'pause' || activeType === 'resume') {
			return true;
		}

		const parsed = parsePrice(amountText);
		return parsed != null && parsed > 0;
	}, [activeType, durationValue, amountText]);

	/* ─── Type picker view (new event, no type chosen) ─── */
	if (!activeType) {
		const handlePick = (next: EventTypeT) => () => {
			router.replace({
				pathname: '/(pickers)/edit-event',
				params: { type: next }
			});
		};

		return (
			<Root>
				<Section>
					<SectionLabel>Pick event type</SectionLabel>
					<TypePickerGrid>
						{EVENT_ORDER.filter((key) => availableTypes.has(key)).map((key) => {
							const meta = EVENT_META[key];
							const tone = theme.accents[meta.accent];
							return (
								<TypeChipWrap key={key}>
									<TypeChip $tone={tone} onPress={handlePick(key)}>
										<SymbolView name={meta.symbol} size={14} tintColor={tone} weight="bold" />
										<TypeChipLabel $tone={tone}>{meta.label}</TypeChipLabel>
									</TypeChip>
								</TypeChipWrap>
							);
						})}
					</TypePickerGrid>
				</Section>
			</Root>
		);
	}

	const meta = EVENT_META[activeType];
	const tone = theme.accents[meta.accent];

	/* ─── Save / delete ────────────────────────────── */
	const handleSave = () => {
		if (!canSave) return;

		const isoDate = format(date, 'yyyy-MM-dd');
		const trimmedReason = reason.trim() ? reason.trim() : null;

		let payload: NewTimelineEventT;

		switch (activeType) {
			case 'trial':
				payload = {
					type: 'trial',
					date: isoDate,
					duration_type: durationType,
					duration_value: clampDuration(durationValue)
				};
				break;

			case 'pause':
				payload = { type: 'pause', date: isoDate, reason: trimmedReason };
				break;

			case 'resume':
				payload = { type: 'resume', date: isoDate };
				break;

			case 'cancellation':
				payload = { type: 'cancellation', date: isoDate, reason: trimmedReason };
				break;

			case 'first_payment':
			case 'price_up':
			case 'price_down':
			case 'refund': {
				const amount = parsePrice(amountText);
				if (amount == null) return;
				payload = { type: activeType, date: isoDate, amount, currency };
				break;
			}
		}

		if (existing) {
			updateEvent(existing.id, payload as TimelineEventPatchT);
		} else {
			addEvent(payload);
		}

		router.back();
	};

	const handleDelete = () => {
		if (existing) removeEvent(existing.id);
		router.back();
	};

	const stepDuration = (delta: number) => () => {
		setDurationValue((prev) => clampDuration(prev + delta));
	};

	const amountRowLabel = activeType === 'refund' ? 'Refunded' : activeType === 'first_payment' ? 'Amount' : 'New price';

	return (
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

			{/* Trial duration */}
			{activeType === 'trial' && (
				<Section>
					<SectionLabel>Duration</SectionLabel>
					<Card>
						<DurationBlock>
							<StepperButton>
								<StepperPressable
									onPress={stepDuration(-1)}
									$disabled={durationValue <= MIN_DURATION}
									disabled={durationValue <= MIN_DURATION}
								>
									<SymbolView name="minus" size={18} tintColor={theme.text.primary} />
								</StepperPressable>
							</StepperButton>

							<DurationValue>{durationValue}</DurationValue>
							<DurationUnit>{unitLabel(durationType, durationValue)}</DurationUnit>

							<StepperButton>
								<StepperPressable
									onPress={stepDuration(1)}
									$disabled={durationValue >= MAX_DURATION}
									disabled={durationValue >= MAX_DURATION}
								>
									<SymbolView name="plus" size={18} tintColor={theme.text.primary} />
								</StepperPressable>
							</StepperButton>
						</DurationBlock>

						<UnitRow>
							{UNITS.map((unit) => {
								const active = unit === durationType;
								return (
									<UnitChipWrap key={unit}>
										<UnitChip $active={active} $accent={accent} onPress={() => setDurationType(unit)}>
											<UnitLabel $active={active} $accent={accent}>
												{unit}
											</UnitLabel>
										</UnitChip>
									</UnitChipWrap>
								);
							})}
						</UnitRow>
					</Card>
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

			<Actions>
				<PrimaryButton $accent={accent} $disabled={!canSave} disabled={!canSave} onPress={handleSave}>
					<SymbolView name={isEdit ? 'checkmark' : 'plus'} size={15} tintColor={theme.static.white} weight="bold" />
					<PrimaryLabel>{isEdit ? 'Save' : 'Add event'}</PrimaryLabel>
				</PrimaryButton>

				{isEdit && activeType !== 'first_payment' && (
					<DeleteButton onPress={handleDelete}>
						<SymbolView name="trash.fill" size={16} tintColor={theme.semantic.error} weight="semibold" />
					</DeleteButton>
				)}
			</Actions>
		</Root>
	);
};

export default EditEventScreen;
