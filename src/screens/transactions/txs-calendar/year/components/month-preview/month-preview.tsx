import React, { useMemo, useCallback } from 'react';

import { useTheme } from 'styled-components/native';
import { lightFormat, startOfMonth, getDay, getDaysInMonth } from 'date-fns';

import { MonthGridView } from '@modules/month-grid';

import type { Props } from './month-preview.d';

const ROW_HEIGHT = 24;

const MonthPreview = ({
	monthDate,
	daysWithTxs,
	title,
	isMonthInRange,
	selectedDate,
	weekStartsOn,
	onPressMonth
}: Props) => {
	const theme = useTheme();

	const colors = {
		emptyBg: `${theme.surface.default}30`,
		textPrimary: theme.text.primary,
		textHighlight: theme.static.white,
		markSelected: theme.accents.orange,
		markTx: theme.accents.purple,
		headerColor: theme.text.primary
	};

	const weekCount = useMemo(() => {
		const first = startOfMonth(monthDate);
		const dow = (getDay(first) - weekStartsOn + 7) % 7;

		return Math.ceil((dow + getDaysInMonth(monthDate)) / 7);
	}, [monthDate, weekStartsOn]);

	const handlePress = useCallback(() => {
		onPressMonth(monthDate);
	}, [monthDate, onPressMonth]);

	return (
		<MonthGridView
			style={{ flex: 1, height: ROW_HEIGHT + weekCount * ROW_HEIGHT }}
			title={title}
			year={monthDate.getFullYear()}
			month={monthDate.getMonth() + 1}
			weekStartsOn={weekStartsOn}
			isInRange={isMonthInRange}
			daysWithTxs={Array.from(daysWithTxs)}
			selectedDay={lightFormat(selectedDate, 'yyyy-MM-dd')}
			colors={colors}
			onPressMonth={handlePress}
		/>
	);
};

export default React.memo(MonthPreview);
