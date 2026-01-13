import React from 'react';
import { useUnit } from 'effector-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { useAppModel } from '@models';
import { db } from '@src/sql-migrations';
import { eq, isNull, inArray } from 'drizzle-orm';
import { categoriesTable, currenciesTable, servicesTable, subscriptionsTable, tendersTable } from '@db/schema';

import { H2 } from '@ui';
import { FilterIcon } from '@ui/icons';
import { Host, Button, Switch, ContextMenu, Divider } from '@expo/ui/swift-ui';
import Root, { TitlePress, FilterBtn } from './lenses.styles';

import { ALL_TIME_MODES } from '@models/shared/lenses';

const useGetActiveEntries = () => {
	const { data: services } = useLiveQuery(
		db
			.selectDistinct({
				id: servicesTable.id,
				title: servicesTable.title
			})
			.from(servicesTable)
			.where(
				inArray(
					servicesTable.id,
					db
						.select({ id: subscriptionsTable.service_id })
						.from(subscriptionsTable)
						.where(isNull(subscriptionsTable.cancellation_date))
				)
			)
	);

	const { data: categories } = useLiveQuery(
		db
			.selectDistinct({
				id: categoriesTable.id,
				title: categoriesTable.title
			})
			.from(categoriesTable)
			.where(
				inArray(
					categoriesTable.id,
					db
						.select({ id: servicesTable.category_id })
						.from(servicesTable)
						.innerJoin(subscriptionsTable, eq(subscriptionsTable.service_id, servicesTable.id))
						.where(isNull(subscriptionsTable.cancellation_date))
				)
			)
	);

	const { data: tenders } = useLiveQuery(
		db
			.selectDistinct({
				id: tendersTable.id,
				title: tendersTable.title
			})
			.from(tendersTable)
			.where(
				inArray(
					tendersTable.id,
					db
						.select({ id: subscriptionsTable.tender_id })
						.from(subscriptionsTable)
						.where(isNull(subscriptionsTable.cancellation_date))
				)
			)
	);

	const { data: currencies } = useLiveQuery(
		db
			.selectDistinct({
				id: currenciesTable.id,
				symbol: currenciesTable.symbol
			})
			.from(currenciesTable)
			.where(
				inArray(
					currenciesTable.id,
					db
						.select({ id: subscriptionsTable.current_currency_id })
						.from(subscriptionsTable)
						.where(isNull(subscriptionsTable.cancellation_date))
				)
			)
	);

	return { services, categories, tenders, currencies };
};

const Lenses = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const { lenses } = useAppModel();
	const lensesStore = useUnit(lenses.$store);

	const entries = useGetActiveEntries();

	const setNextTimeMode = () => {
		const timeMode = lensesStore.time_mode;

		const currentIndex = ALL_TIME_MODES.indexOf(timeMode);
		const nextIndex = (currentIndex + 1) % ALL_TIME_MODES.length;
		const nextTimeMode = ALL_TIME_MODES[nextIndex];

		lenses.setTimeMode(nextTimeMode);
	};

	return (
		<Root>
			<TitlePress onPress={setNextTimeMode}>
				<H2>{t(`lenses.${lensesStore.time_mode}`)}</H2>
			</TitlePress>

			<Host>
				<ContextMenu dismissBehavior="disabled">
					<ContextMenu.Items>
						<Button systemImage="infinity" onPress={() => lenses.setTimeMode('all')}>
							{t(`lenses.all`)}
						</Button>

						<Button variant="bordered" systemImage="figure.run" onPress={() => lenses.setTimeMode('future')}>
							{t(`lenses.future`)}
						</Button>

						<ContextMenu dismissBehavior="disabled">
							<ContextMenu.Items>
								{entries.categories.map((category) => (
									<Switch
										key={category.id}
										label={category.title}
										value={lensesStore.filters.some(
											(filter) => filter.type === 'category' && filter.value === category.id
										)}
										onValueChange={(value) => {
											if (value) {
												lenses.filters.add({ type: 'category', value: category.id });
											} else {
												lenses.filters.remove({ type: 'category', value: category.id });
											}
										}}
									/>
								))}
							</ContextMenu.Items>

							<ContextMenu.Trigger>
								<Button systemImage="camera.filters">By Category</Button>
							</ContextMenu.Trigger>
						</ContextMenu>

						<ContextMenu dismissBehavior="disabled">
							<ContextMenu.Items>
								{entries.services.map((service) => (
									<Switch
										key={service.id}
										label={service.title}
										value={lensesStore.filters.some(
											(filter) => filter.type === 'service' && filter.value === service.id
										)}
										onValueChange={(value) => {
											if (value) {
												lenses.filters.add({ type: 'service', value: service.id });
											} else {
												lenses.filters.remove({ type: 'service', value: service.id });
											}
										}}
									/>
								))}
							</ContextMenu.Items>

							<ContextMenu.Trigger>
								<Button systemImage="camera.filters">By Service</Button>
							</ContextMenu.Trigger>
						</ContextMenu>

						<ContextMenu dismissBehavior="disabled">
							<ContextMenu.Items>
								{entries.tenders.map((tender) => (
									<Switch
										key={tender.id}
										label={tender.title}
										value={lensesStore.filters.some((filter) => filter.type === 'tender' && filter.value === tender.id)}
										onValueChange={(value) => {
											if (value) {
												lenses.filters.add({ type: 'tender', value: tender.id });
											} else {
												lenses.filters.remove({ type: 'tender', value: tender.id });
											}
										}}
									/>
								))}
							</ContextMenu.Items>

							<ContextMenu.Trigger>
								<Button systemImage="camera.filters">By Tender</Button>
							</ContextMenu.Trigger>
						</ContextMenu>

						<ContextMenu dismissBehavior="disabled">
							<ContextMenu.Items>
								{entries.currencies.map((currency) => (
									<Switch
										key={currency.id}
										label={currency.id}
										value={lensesStore.filters.some(
											(filter) => filter.type === 'currency' && filter.value === currency.id
										)}
										onValueChange={(value) => {
											if (value) {
												lenses.filters.add({ type: 'currency', value: currency.id });
											} else {
												lenses.filters.remove({ type: 'currency', value: currency.id });
											}
										}}
									/>
								))}
							</ContextMenu.Items>

							<ContextMenu.Trigger>
								<Button systemImage="camera.filters">By Base Currency</Button>
							</ContextMenu.Trigger>
						</ContextMenu>

						<Divider />

						{lensesStore.filters.length > 0 && (
							<Button variant="bordered" systemImage="xmark.circle" onPress={() => lenses.filters.clear()}>
								Clear Filters
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
		</Root>
	);
};

export default Lenses;
