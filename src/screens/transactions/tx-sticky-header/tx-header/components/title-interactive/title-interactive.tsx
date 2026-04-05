import React from 'react';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';

import useTitle from './use-title';
import { useLensesStore, useTxDatesStore } from '@screens/transactions/models';
import { useSearchParams } from '@hooks';
import { useTheme } from 'styled-components/native';

import { LargeText } from '@ui';
import { ArrowLeftIcon } from '@ui/icons';
import Root, { Title, GlassWrapper, GlassItem, YearButton, Stub } from './title-interactive.styles';

import { ALL_TIME_MODES } from '@screens/transactions/models/lenses';

const TitleInteractive = () => {
	const title = useTitle();
	const theme = useTheme();
	const router = useRouter();
	const { txViewMode, calendarScale } = useSearchParams();

	const timeMode = useLensesStore((s) => s.time_mode);
	const setTimeMode = useLensesStore((s) => s.setTimeMode);
	const activeMonth = useTxDatesStore((s) => s.activeMonth);

	if (txViewMode === 'list') {
		const setNextTimeMode = () => {
			const currentIndex = ALL_TIME_MODES.indexOf(timeMode);
			const nextIndex = (currentIndex + 1) % ALL_TIME_MODES.length;
			const nextTimeMode = ALL_TIME_MODES[nextIndex];
			setTimeMode(nextTimeMode);
		};

		return (
			<Root onPress={setNextTimeMode}>
				<Title>{title}</Title>
			</Root>
		);
	}

	if (txViewMode === 'calendar') {
		const setNextCalendarScale = () => {
			const nextScale = calendarScale === 'year' ? 'month' : 'year';
			router.setParams({ calendar_scale: nextScale });
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
