import React from 'react';
import { useUnit } from 'effector-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { format } from 'date-fns';

import { useAppModel } from '@models';
import { useFilterValues } from './hooks';

import { H3 } from '@ui';
import { GlassContainer } from 'expo-glass-effect';
import { FilterIcon, ListIcon, CalendarIcon } from '@ui/icons';
import { ContextMenuFilters, TitleInteractive } from './components';
import { Host, Button, ContextMenu, Divider } from '@expo/ui/swift-ui';
import Root, { FilterBtn, GlassItem } from './tx-header.styles';

const TxHeader = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const { view_mode, lenses, tx_dates } = useAppModel();
	const lensesStore = useUnit(lenses.$store);
	const viewMode = useUnit(view_mode.$mode);
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

	return (
		<Root>
			<TitleInteractive />

			{viewMode === 'calendar' && calendarScale === 'month' && <H3>{format(activeMonth, 'MMMM')}</H3>}

			{/* @TODO: Check if glass effect is supported, if not, use BlurView */}
			<GlassContainer>
				<GlassItem isInteractive>
					{viewMode === 'list' && (
						<FilterBtn onPress={() => view_mode.set('calendar')}>
							<CalendarIcon color={theme.text.primary} width={20} height={20} />
						</FilterBtn>
					)}

					{viewMode === 'calendar' && (
						<FilterBtn onPress={() => view_mode.set('list')}>
							<ListIcon color={theme.text.primary} width={20} height={20} />
						</FilterBtn>
					)}

					<Host>
						<ContextMenu dismissBehavior="disabled">
							<ContextMenu.Items>
								{viewMode === 'list' && (
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
