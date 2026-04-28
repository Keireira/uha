import React, { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';
import {
	isPauseEvent,
	isPricedEvent,
	isCancellationEvent,
	type EventTypeT
} from '@screens/crossroad/add-subscription/events';

import {
	listStyle,
	scrollDismissesKeyboard,
	listRowSeparator,
	listRowBackground,
	listSectionMargins,
	listSectionSpacing
} from '@expo/ui/swift-ui/modifiers';
import { Host, List, Section } from '@expo/ui/swift-ui';
import { Header, Hero, WhenSection, AmountSection, ReasonSection } from './components';

type SearchParamsT = { id?: string; type?: EventTypeT };

const PRICED_TYPES: EventTypeT[] = ['first_payment', 'price_up', 'price_down', 'refund'];
const CANCELLED_TYPES: EventTypeT[] = ['pause', 'cancellation'];

const EditEventScreen = () => {
	const { id, type: typeParam } = useLocalSearchParams<SearchParamsT>();
	const events = useDraftStore((state) => state.timeline);

	const existing = id ? events.find((event) => event.id === id) : undefined;
	const activeType = existing?.type ?? typeParam;

	const [date, setDate] = useState<Date>(() => {
		if (existing) {
			return new Date(existing.date);
		}

		return new Date();
	});

	const [amountText, setAmountText] = useState<string>(() => {
		if (existing && isPricedEvent(existing) && typeof existing.amount === 'number') {
			return String(existing.amount);
		}

		if (typeParam === 'refund') {
			const [latestPriced] = events.filter(isPricedEvent).sort((a, b) => b.date.localeCompare(a.date));

			if (latestPriced && 'amount' in latestPriced && typeof latestPriced.amount === 'number' && latestPriced.amount > 0) {
				return String(latestPriced.amount);
			}
		}

		return '';
	});

	const [reason, setReason] = useState<string>(() => {
		if (existing && (isPauseEvent(existing) || isCancellationEvent(existing))) {
			return existing.reason ?? '';
		}

		return '';
	});

	const showAmount = PRICED_TYPES.includes(activeType as EventTypeT);
	const showReason = CANCELLED_TYPES.includes(activeType as EventTypeT);

	return (
		<>
			<Header amountText={amountText} date={date} reason={reason} />

			<Host style={{ flex: 1 }}>
				<List modifiers={[listStyle('insetGrouped'), scrollDismissesKeyboard('immediately')]}>
					{/* Hero */}
					<Section
						modifiers={[
							listSectionSpacing(0),
							listRowSeparator('hidden'),
							listRowBackground('transparent'),
							listSectionMargins({ length: 0, edges: 'all' })
						]}
					>
						<Hero activeType={activeType} />
					</Section>

					{/* When */}
					<Section title="When" modifiers={[listRowSeparator('hidden'), listSectionSpacing(0)]}>
						<WhenSection date={date} setDate={setDate} />
					</Section>

					{/* Amount (priced events) */}
					{showAmount && <AmountSection date={date} amountText={amountText} setAmountText={setAmountText} />}

					{/* Reason (pause / cancellation) */}
					{showReason && (
						<Section title="Reason (optional)">
							<ReasonSection activeType={activeType} reason={reason} setReason={setReason} />
						</Section>
					)}
				</List>
			</Host>
		</>
	);
};

export default EditEventScreen;
