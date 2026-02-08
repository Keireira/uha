import React from 'react';
import { useRouter } from 'expo-router';
import { useUnit } from 'effector-react';
import { useTheme } from 'styled-components/native';
import { format } from 'date-fns';

import { useAppModel } from '@models';
import { useSearchParams } from '@hooks';

import { H3 } from '@ui';
import { GlassContainer } from 'expo-glass-effect';
import { FilterIcon, ListIcon, CalendarIcon } from '@ui/icons';
import { TitleInteractive } from './components';
import Root, { FilterBtn, GlassItem, ActiveDot } from './tx-header.styles';

const TxHeader = () => {
	const theme = useTheme();
	const router = useRouter();
	const { txViewMode } = useSearchParams();

	const { view_mode, lenses, tx_dates } = useAppModel();
	const lensesStore = useUnit(lenses.$store);
	const activeMonth = useUnit(tx_dates.activeMonth.$value);
	const calendarScale = useUnit(view_mode.calendar.$scale);

	const hasActiveFilters = lensesStore.filters.length > 0;

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

			{txViewMode === 'calendar' && calendarScale === 'month' && <H3>{format(activeMonth, 'MMMM')}</H3>}

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
