import React from 'react';
import { format } from 'date-fns';
import { useTheme } from 'styled-components/native';
import { Stack, useRouter } from 'expo-router';

import { parsePrice } from '@lib';
import { useAccent } from '@hooks';
import { useShallow } from 'zustand/react/shallow';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';
import { useActiveEvent } from '@screens/crossroad/add-subscription/pickers/edit-event/hooks';

import type { NewTimelineEventT } from '@screens/crossroad/add-subscription/hooks/use-draft-store';

type Props = {
	date: Date;
	reason: string;
	amountText: string;
};

const useData = () => {
	const activeEvent = useActiveEvent();

	const { addEvent, updateEvent, removeEvent } = useDraftStore(
		useShallow((state) => ({
			addEvent: state.actions.addEvent,
			updateEvent: state.actions.updateEvent,
			removeEvent: state.actions.removeEvent
		}))
	);

	return {
		id: activeEvent.id,
		currency: activeEvent.currency,
		activeEvent: activeEvent.event,
		isEditMode: Boolean(activeEvent.event),
		activeType: activeEvent.type,

		addEvent,
		updateEvent,
		removeEvent
	};
};

const Header = ({ amountText, date, reason }: Props) => {
	const theme = useTheme();
	const router = useRouter();
	const settingAccent = useAccent();
	const { currency, activeType, isEditMode, activeEvent, addEvent, updateEvent, removeEvent } = useData();

	const createPayload = (): NewTimelineEventT | null => {
		const isoDate = format(date, 'yyyy-MM-dd');

		switch (activeType) {
			case 'pause':
			case 'cancellation':
				return {
					type: activeType,
					date: isoDate,
					reason: reason.trim() || null
				};

			case 'price_up':
			case 'price_down':
			case 'refund':
				return {
					date: isoDate,
					type: activeType,
					currency: currency ?? 'USD',
					amount: parsePrice(amountText) ?? 0
				};

			case 'resume':
				return {
					type: 'resume',
					date: isoDate
				};

			default:
				return null;
		}
	};

	const onSaveHd = () => {
		if (!activeType) return;

		const payload = createPayload();
		if (!payload) return;

		if (activeEvent) {
			updateEvent(activeEvent.id, payload);
		} else {
			addEvent(payload);
		}

		router.back();
	};

	const onDeleteHd = () => {
		if (activeEvent) {
			removeEvent(activeEvent.id);
		}

		router.back();
	};

	return (
		<>
			{isEditMode && activeType !== 'first_payment' && (
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
