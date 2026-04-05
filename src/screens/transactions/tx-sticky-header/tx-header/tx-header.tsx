import React from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';
import { format } from 'date-fns';

import { useLensesStore, useTxDatesStore } from '@screens/transactions/models';
import { useSearchParams } from '@hooks';

import { H3 } from '@ui';
import { TitleInteractive } from './components';
import { GlassContainer } from 'expo-glass-effect';
import { FilterIcon, ListIcon, CalendarIcon } from '@ui/icons';
import Root, { Title, FilterBtn, GlassItem, ActiveDot } from './tx-header.styles';

const TxHeader = () => {
	const theme = useTheme();
	const router = useRouter();
	const { txViewMode, calendarScale } = useSearchParams();

	const filters = useLensesStore((s) => s.filters);
	const activeMonth = useTxDatesStore((s) => s.activeMonth);

	const hasActiveFilters = filters.length > 0;

	const setCalendarViewMode = () => {
		router.setParams({ tx_view_mode: 'calendar' });
	};

	const setListViewMode = () => {
		router.setParams({ tx_view_mode: 'list' });
	};

	const openFilters = () => {
		router.push('/(tabs)/transactions/filters');
	};

	return (
		<Root>
			<TitleInteractive />

			{txViewMode === 'calendar' && calendarScale === 'month' && (
				<Title>
					<H3 $transform="capitalize">{format(activeMonth, 'LLLL')}</H3>
				</Title>
			)}

			<GlassContainer>
				<GlassItem isInteractive>
					{txViewMode === 'list' && (
						<FilterBtn onPress={setCalendarViewMode}>
							<CalendarIcon color={theme.text.primary} width={20} height={20} />
						</FilterBtn>
					)}

					{txViewMode === 'calendar' && (
						<FilterBtn onPress={setListViewMode}>
							<ListIcon color={theme.text.primary} width={20} height={20} />
						</FilterBtn>
					)}

					<FilterBtn onPress={openFilters}>
						<FilterIcon color={theme.text.primary} />
						{hasActiveFilters && <ActiveDot />}
					</FilterBtn>
				</GlassItem>
			</GlassContainer>
		</Root>
	);
};

export default TxHeader;
