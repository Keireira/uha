import React from 'react';
import { useRouter } from 'expo-router';
import { useUnit } from 'effector-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { format } from 'date-fns';

import { useAppModel } from '@models';
import { useSearchParams } from '@hooks';
import { useFilterValues } from './hooks';

import { H3 } from '@ui';
import { GlassContainer } from 'expo-glass-effect';
import { FilterIcon, ListIcon, CalendarIcon } from '@ui/icons';
import { ContextMenuFilters, TitleInteractive } from './components';
import { Host, Button, ContextMenu, Divider } from '@expo/ui/swift-ui';
import Root, { FilterBtn, GlassItem } from './tx-header.styles';

const TxHeader = () => {
	const theme = useTheme();
	const router = useRouter();
	const { t } = useTranslation();
	const { txViewMode } = useSearchParams();

	const { view_mode, lenses, tx_dates } = useAppModel();
	const lensesStore = useUnit(lenses.$store);
	const activeMonth = useUnit(tx_dates.activeMonth.$value);
	const calendarScale = useUnit(view_mode.calendar.$scale);

	const entries = useFilterValues();

	const clearFilters = () => {
		lenses.filters.clear();
	};

	const setFutureTimeMode = () => {
		if (lensesStore.time_mode === 'future') return;

		lenses.time_mode.set('future');
	};

	const setAllTimeMode = () => {
		if (lensesStore.time_mode === 'all') return;

		lenses.time_mode.set('all');
	};

	const setCalendarViewMode = () => {
		router.setParams({ tx_view_mode: 'calendar' });
	};

	const setListViewMode = () => {
		router.setParams({ tx_view_mode: 'list' });
	};

	return (
		<Root>
			<TitleInteractive />

			{txViewMode === 'calendar' && calendarScale === 'month' && <H3>{format(activeMonth, 'MMMM')}</H3>}

			{/* @TODO: Check if glass effect is supported, if not, use BlurView */}
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

					<Host>
						<ContextMenu dismissBehavior="disabled">
							<ContextMenu.Items>
								{txViewMode === 'list' && (
									<>
										<Button systemImage="infinity" onPress={setAllTimeMode}>
											{t(`transactions.time_mode.all`)}
										</Button>

										<Button variant="bordered" systemImage="figure.run" onPress={setFutureTimeMode}>
											{t(`transactions.time_mode.future`)}
										</Button>
									</>
								)}

								<ContextMenuFilters
									entries={entries.categories}
									filterType="category"
									triggerLabel={t('transactions.filters.category')}
								/>
								<ContextMenuFilters
									entries={entries.services}
									filterType="service"
									triggerLabel={t('transactions.filters.service')}
								/>
								<ContextMenuFilters
									entries={entries.tenders}
									filterType="tender"
									triggerLabel={t('transactions.filters.tender')}
								/>
								<ContextMenuFilters
									entries={entries.currencies}
									filterType="currency"
									triggerLabel={t('transactions.filters.currency')}
								/>

								<Divider />

								{lensesStore.filters.length > 0 && (
									<Button variant="bordered" systemImage="xmark.circle" onPress={clearFilters}>
										{t('transactions.filters.clear')}
									</Button>
								)}
							</ContextMenu.Items>

							<ContextMenu.Trigger>
								<FilterBtn>
									<FilterIcon color={theme.text.primary} />
								</FilterBtn>
							</ContextMenu.Trigger>
						</ContextMenu>
					</Host>
				</GlassItem>
			</GlassContainer>
		</Root>
	);
};

export default TxHeader;
