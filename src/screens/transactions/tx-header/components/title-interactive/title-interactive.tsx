import React from 'react';
import { format } from 'date-fns';
import { useUnit } from 'effector-react';

import useTitle from './use-title';
import { useAppModel } from '@models';
import { useTheme } from 'styled-components/native';

import { LargeText } from '@ui';
import { ArrowLeftIcon } from '@ui/icons';
import Root, { Title, GlassWrapper, GlassItem, YearButton, Stub } from './title-interactive.styles';

import { ALL_TIME_MODES } from '@screens/transactions/models/lenses';

const TitleInteractive = () => {
	const title = useTitle();
	const theme = useTheme();

	const { lenses, view_mode, tx_dates } = useAppModel();
	const viewMode = useUnit(view_mode.$mode);
	const lensesStore = useUnit(lenses.$store);
	const activeMonth = useUnit(tx_dates.activeMonth.$value);
	const calendarScale = useUnit(view_mode.calendar.$scale);

	if (viewMode === 'list') {
		const setNextTimeMode = () => {
			const timeMode = lensesStore.time_mode;
			const currentIndex = ALL_TIME_MODES.indexOf(timeMode);
			const nextIndex = (currentIndex + 1) % ALL_TIME_MODES.length;
			const nextTimeMode = ALL_TIME_MODES[nextIndex];
			lenses.time_mode.set(nextTimeMode);
		};

		return (
			<Root onPress={setNextTimeMode}>
				<Title>{title}</Title>
			</Root>
		);
	}

	if (viewMode === 'calendar') {
		const setNextCalendarScale = () => {
			const nextScale = calendarScale === 'year' ? 'month' : 'year';
			view_mode.calendar.setScale(nextScale);
		};

		if (calendarScale !== 'year') {
			return (
				<GlassWrapper>
					<GlassItem isInteractive>
						<YearButton onPress={setNextCalendarScale}>
							<ArrowLeftIcon width={24} height={24} color={theme.text.primary} />

							<LargeText numberOfLines={1}>{format(activeMonth, 'yyyy')}</LargeText>
						</YearButton>
					</GlassItem>
				</GlassWrapper>
			);
		}

		return (
			<GlassWrapper>
				<Stub />
			</GlassWrapper>
		);
	}

	return null;
};

export default TitleInteractive;
