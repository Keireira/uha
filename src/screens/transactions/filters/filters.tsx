import React, { useState, useMemo, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { useUnit } from 'effector-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { SymbolView } from 'expo-symbols';

import { useAppModel } from '@models';
import { useFilterValues, useEligibleIds, useAutoTimeMode } from './hooks';

import { Header, NoFilters } from './components';
import Root, {
	Content,
	ItemsSection,
	ItemPressable,
	CheckCircle,
	ImpliedDot,
	ItemTextGroup,
	ItemTitle,
	ItemSubtitle,
	DimWrapper,
	ItemSeparator,
	EligibilityDivider
} from './filters.styles';

import type { FilterTabT, FilterEntryT } from './filters.d';

const FilterSheet = () => {
	useAutoTimeMode();

	const { t } = useTranslation();
	const theme = useTheme();

	const { lenses } = useAppModel();
	const lensesStore = useUnit(lenses.$store);
	const entries = useFilterValues();
	const eligibleIds = useEligibleIds(lensesStore.filters);

	const [activeTab, setActiveTab] = useState<FilterTabT>('category');

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

	const handleItemPress = useCallback(
		(id: string, currentlySelected: boolean) => {
			if (currentlySelected) {
				lenses.filters.remove({ type: activeTab, value: id });
			} else {
				lenses.filters.add({ type: activeTab, value: id });
			}

			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		},
		[activeTab, lenses.filters]
	);

	return (
		<Root>
			<Header activeTab={activeTab} setActiveTab={setActiveTab} />

			<Content>
				<ItemsSection>
					{sortedEntries.length === 0 ? (
						<NoFilters />
					) : (
						sortedEntries.map((entry, index) => (
							<React.Fragment key={entry.id}>
								{index === ineligibleStartIndex && index > 0 && <EligibilityDivider />}

								<DimWrapper $dimmed={!entry.isEligible && !entry.isSelected}>
									<ItemPressable onPress={() => handleItemPress(entry.id, entry.isSelected)}>
										<CheckCircle $selected={entry.isSelected} $implied={entry.isImplied}>
											{entry.isSelected ? (
												<SymbolView name="checkmark" size={13} weight="bold" tintColor={theme.text.inverse} />
											) : entry.isImplied ? (
												<ImpliedDot />
											) : null}
										</CheckCircle>

										<ItemTextGroup>
											<ItemTitle $hasSubtitle={Boolean(entry.subtitle)}>{entry.title}</ItemTitle>

											{entry.subtitle && <ItemSubtitle>{entry.subtitle}</ItemSubtitle>}
										</ItemTextGroup>
									</ItemPressable>
								</DimWrapper>

								{index < sortedEntries.length - 1 && index !== ineligibleStartIndex - 1 && <ItemSeparator />}
							</React.Fragment>
						))
					)}
				</ItemsSection>
			</Content>
		</Root>
	);
};

export default FilterSheet;
