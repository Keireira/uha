import React, { useState, useMemo, useCallback } from 'react';
import { useUnit } from 'effector-react';
import { useTranslation } from 'react-i18next';

import { useAppModel } from '@models';
import { useFilterValues, useEligibleIds, useAutoTimeMode } from './hooks';

import Root, { Content } from './filters.styles';
import { Header, NoFilters, FilterEntry } from './components';

import type { FilterTabT, FilterEntryT } from './filters.d';

const FilterSheet = () => {
	useAutoTimeMode();

	const { t } = useTranslation();

	const { lenses } = useAppModel();
	const lensesStore = useUnit(lenses.$store);
	const entries = useFilterValues();
	const eligibleIds = useEligibleIds(lensesStore.filters);

	const [activeTab, setActiveTab] = useState<FilterTabT>('service');

	const entriesMap = useMemo(
		() => ({
			category: entries.categories,
			service: entries.services,
			tender: entries.tenders,
			currency: entries.currencies
		}),
		[entries]
	);

	const resolveTitle = useCallback(
		(tab: FilterTabT, entry: { id: string; title: string; subtitle?: string }) => {
			if (tab === 'currency') {
				const localizedName = t(`currencies.${entry.id}`, { defaultValue: '' });

				return {
					title: localizedName || entry.id,
					subtitle: entry.id
				};
			}

			return {
				title: entry.title,
				subtitle: entry.subtitle
			};
		},
		[t]
	);

	const sortedEntries: FilterEntryT[] = useMemo(() => {
		const currentEntries = entriesMap[activeTab];
		const activeIds = new Set(lensesStore.filters.filter((f) => f.type === activeTab).map((f) => f.value));
		const eligible = eligibleIds[activeTab];
		const hasOtherFilters = lensesStore.filters.some((f) => f.type !== activeTab);

		const selected: FilterEntryT[] = [];
		const unselectedEligible: FilterEntryT[] = [];
		const unselectedIneligible: FilterEntryT[] = [];

		for (const entry of currentEntries) {
			const { title, subtitle } = resolveTitle(activeTab, entry);
			const isSelected = activeIds.has(entry.id);
			const isEligible = !hasOtherFilters || eligible.has(entry.id);
			const isImplied =
				activeTab === 'service' && activeIds.size > 0
					? false
					: !isSelected && hasOtherFilters && eligible.has(entry.id);

			const enriched: FilterEntryT = {
				id: entry.id,
				title,
				subtitle,
				isSelected,
				isEligible,
				isImplied
			};

			if (isSelected) {
				selected.push(enriched);
			} else if (isEligible) {
				unselectedEligible.push(enriched);
			} else {
				unselectedIneligible.push(enriched);
			}
		}

		return [...selected, ...unselectedEligible, ...unselectedIneligible];
	}, [entriesMap, activeTab, lensesStore.filters, eligibleIds, resolveTitle]);

	const ineligibleStartIndex = useMemo(() => {
		const idx = sortedEntries.findIndex((e) => !e.isEligible && !e.isSelected);

		return idx === -1 ? -1 : idx;
	}, [sortedEntries]);

	return (
		<Root>
			<Header activeTab={activeTab} setActiveTab={setActiveTab} />

			<Content>
				{sortedEntries.map((entry, index) => (
					<FilterEntry
						key={entry.id}
						id={entry.id}
						activeTab={activeTab}
						isImplied={entry.isImplied}
						isEligible={entry.isEligible}
						isSelected={entry.isSelected}
						title={entry.title}
						subtitle={entry.subtitle}
						showDivider={index === ineligibleStartIndex && index > 0}
						withSeparator={index < sortedEntries.length - 1 && index !== ineligibleStartIndex - 1}
					/>
				))}

				{!sortedEntries.length && <NoFilters />}
			</Content>
		</Root>
	);
};

export default FilterSheet;
