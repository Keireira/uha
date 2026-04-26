import React, { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useTheme } from 'styled-components/native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';

import { useAccent } from '@hooks';
import { useShallow } from 'zustand/react/shallow';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import { isPricedEvent } from '@screens/crossroad/add-subscription/events';

import type { EventTypeT } from '@screens/crossroad/add-subscription/events';
import type { NewTimelineEventT, TimelineEventPatchT } from '@screens/crossroad/add-subscription/hooks/use-draft-store';

type SearchParamsT = {
	id?: string;
	type?: EventTypeT;
};

type Props = {
	reason: string;
	amountText: string;
};

const parsePrice = (input: string): number | undefined => {
	const cleaned = input.replace(/[^\d.,]/g, '').replace(',', '.');
	if (!cleaned) return undefined;

	const n = parseFloat(cleaned);
	return Number.isFinite(n) ? n : undefined;
};

const Header = ({ amountText, reason }: Props) => {
	const theme = useTheme();
	const router = useRouter();
	const settingAccent = useAccent();
	const { id, type: typeParam } = useLocalSearchParams<SearchParamsT>();

	const events = useDraftStore((state) => state.timeline);
	const defaultCurrency = useDraftStore((state) => state.currency);
	const { addEvent, updateEvent, removeEvent } = useDraftStore(
		useShallow((state) => ({
			addEvent: state.actions.addEvent,
			updateEvent: state.actions.updateEvent,
			removeEvent: state.actions.removeEvent
		}))
	);

	const existing = id ? events.find((event) => event.id === id) : undefined;
	const activeType: EventTypeT | undefined = existing?.type ?? typeParam;
	const isEdit = Boolean(existing);

	const [date] = useState<Date>(() => (existing ? parseISO(existing.date) : new Date()));
	const currency = existing && isPricedEvent(existing) ? existing.currency : defaultCurrency;

	const canSave = useMemo(() => {
		if (!activeType) return false;

		if (activeType === 'cancellation' || activeType === 'pause' || activeType === 'resume') {
			return true;
		}

		const parsed = parsePrice(amountText);
		return parsed != null && parsed > 0;
	}, [activeType, amountText]);

	const onSaveHd = () => {
		if (!canSave) return;

		const isoDate = format(date, 'yyyy-MM-dd');
		const trimmedReason = reason.trim() ? reason.trim() : null;

		let payload: NewTimelineEventT;

		switch (activeType) {
			case 'pause':
				payload = { type: 'pause', date: isoDate, reason: trimmedReason };
				break;

			case 'resume':
				payload = { type: 'resume', date: isoDate };
				break;

			case 'cancellation':
				payload = { type: 'cancellation', date: isoDate, reason: trimmedReason };
				break;

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

	const onDeleteHd = () => {
		if (existing) {
			removeEvent(existing.id);
		}

		router.back();
	};

	return (
		<>
			{isEdit && activeType !== 'first_payment' && (
				<Stack.Toolbar placement="left">
					<Stack.Toolbar.Button variant="plain" icon="trash" onPress={onDeleteHd} tintColor={theme.accents.red} />
				</Stack.Toolbar>
			)}

			<Stack.Toolbar placement="right">
				<Stack.Toolbar.Button variant="done" icon="checkmark" onPress={onSaveHd} tintColor={settingAccent} />
			</Stack.Toolbar>
		</>
	);
};

export default Header;
