import React, { useMemo } from 'react';
import { useUnit } from 'effector-react';
import { useTranslation } from 'react-i18next';
import { startOfToday, isSameYear, format } from 'date-fns';

import { useAppModel } from '@models';
import { ALL_TIME_MODES } from '@screens/transactions/models/lenses';

import Root, { Title } from './title-interactive.styles';

const useTitle = () => {
	const { t } = useTranslation();
	const appModel = useAppModel();
	const lenses = useUnit(appModel.lenses.$store);
	const viewMode = useUnit(appModel.viewMode.$mode);
	const activeMonth = useUnit(appModel.tx_dates.activeMonth.$value);

	const title = useMemo(() => {
		if (viewMode === 'list') {
			return t(`transactions.time_mode.${lenses.time_mode}`);
		}

		if (viewMode === 'calendar') {
			const isCurrentYear = isSameYear(activeMonth, startOfToday());

			return isCurrentYear ? format(activeMonth, 'LLLL') : format(activeMonth, 'LLLL, yyyy');
		}

		return t('transactions.view_mode.subscriptions');
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [lenses.time_mode, viewMode, activeMonth]);

	return title;
};

const TitleInteractive = () => {
	const title = useTitle();

	const { lenses } = useAppModel();
	const lensesStore = useUnit(lenses.$store);

	const setNextTimeMode = () => {
		const timeMode = lensesStore.time_mode;

		const currentIndex = ALL_TIME_MODES.indexOf(timeMode);
		const nextIndex = (currentIndex + 1) % ALL_TIME_MODES.length;
		const nextTimeMode = ALL_TIME_MODES[nextIndex];

		lenses.time_mode.set(nextTimeMode);
	};

	// So here is logic for pressing the title:
	// LIST MODE:
	// - If the time mode is "all", set it to "future"
	// - If the time mode is "future", set it to "all"

	// CALENDAR MODE:
	// - Show datepicker with month & year

	return (
		<Root onPress={setNextTimeMode}>
			<Title>{title}</Title>
		</Root>
	);
};

export default TitleInteractive;
