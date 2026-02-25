import React, { useRef, useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useUnit } from 'effector-react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppModel } from '@models';
import { TABS } from './components/header';
import { useFilterValues, useEligibleIds, useAutoTimeMode } from './hooks';

import { Header, NoFilters, FilterEntry, SearchBar } from './components';
import Root, { Content, Entries, SectionHeader } from './filters.styles';

import type { ScrollView } from 'react-native';
import type { FilterTabT, FilterEntryT, SearchSectionT } from './filters.d';

const FilterSheet = () => {
	useAutoTimeMode();

	const { t } = useTranslation();
	const insets = useSafeAreaInsets();

	const [searchQuery, setSearchQuery] = useState('');
	const isSearching = searchQuery.trim().length > 0;

	const { lenses } = useAppModel();
	const lensesStore = useUnit(lenses.$store);
	const entries = useFilterValues();
	const eligibleIds = useEligibleIds(lensesStore.filters);

	const contentRef = useRef<ScrollView>(null);
	const [activeTab, setActiveTab] = useState<FilterTabT>(TABS[0]);

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

	/* Default mode (wo search) */
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

	/* Search mode */
	const searchResults: SearchSectionT[] = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return [];

		const sections: SearchSectionT[] = [];

		for (const tab of TABS) {
			const currentEntries = entriesMap[tab];
			const activeIds = new Set(lensesStore.filters.filter((f) => f.type === tab).map((f) => f.value));

			const matched: FilterEntryT[] = [];

			for (const entry of currentEntries) {
				const { title, subtitle } = resolveTitle(tab, entry);

				if (!title.toLowerCase().includes(q) && !subtitle?.toLowerCase().includes(q)) {
					continue;
				}

				matched.push({
					id: entry.id,
					title,
					subtitle,
					isSelected: activeIds.has(entry.id),
					isEligible: true,
					isImplied: false
				});
			}

			if (matched.length > 0) {
				sections.push({
					tab,
					label: t(`transactions.filters.tabs.${tab}`),
					entries: matched
				});
			}
		}

		return sections.sort((a, b) => {
			if (a.tab === activeTab) return -1;
			if (b.tab === activeTab) return 1;
			return 0;
		});
	}, [searchQuery, entriesMap, lensesStore.filters, resolveTitle, t, activeTab]);

	const ineligibleStartIndex = useMemo(() => {
		const idx = sortedEntries.findIndex((e) => !e.isEligible && !e.isSelected);

		return idx === -1 ? -1 : idx;
	}, [sortedEntries]);

	const setActiveTabProxy = (tab: FilterTabT) => {
		const isSameTab = tab === activeTab;

		if (!isSameTab) {
			setActiveTab(tab);
		}

		contentRef.current?.scrollTo({
			y: 0,
			animated: isSameTab
		});
	};

	return (
		<>
			<Root>
				<Header activeTab={activeTab} setActiveTab={setActiveTabProxy} />

				<Content
					ref={contentRef}
					contentContainerStyle={{
						paddingTop: 136,
						paddingRight: 24,
						paddingLeft: 24,
						paddingBottom: insets.bottom + 64
					}}
				>
					<Entries>
						{isSearching &&
							searchResults.length > 0 &&
							searchResults.map((section) => (
								<React.Fragment key={section.tab}>
									<SectionHeader>{section.label}</SectionHeader>

									{section.entries.map((entry, index) => (
										<FilterEntry
											key={entry.id}
											id={entry.id}
											activeTab={section.tab}
											isImplied={entry.isImplied}
											isEligible={entry.isEligible}
											isSelected={entry.isSelected}
											title={entry.title}
											subtitle={entry.subtitle}
											showDivider={false}
											withSeparator={index < section.entries.length - 1}
										/>
									))}
								</React.Fragment>
							))}

						{!isSearching &&
							sortedEntries.length > 0 &&
							sortedEntries.map((entry, index) => (
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

						{((isSearching && !searchResults.length) || !sortedEntries.length) && <NoFilters />}
					</Entries>
				</Content>
			</Root>

			<SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
		</>
	);
};

export default FilterSheet;
