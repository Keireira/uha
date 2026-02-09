import React, { useState, useMemo, useCallback } from 'react';
import { Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useUnit } from 'effector-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { SymbolView } from 'expo-symbols';

import { useAppModel } from '@models';
import { useFilterValues, useEligibleIds, useAutoTimeMode } from './hooks';

import Root, {
	Header,
	TitleRow,
	Title,
	AccentRule,
	CountGlass,
	CountText,
	ClearGlass,
	ClearButtonText,
	TimeModeGlassGroup,
	TimeModeRow,
	TimeModeGlass,
	TimeModeInner,
	TimeModeLabel,
	TabBarRow,
	TabGlass,
	TabInner,
	TabLabel,
	ItemsSection,
	ItemPressable,
	CheckCircle,
	ImpliedDot,
	ItemTextGroup,
	ItemTitle,
	ItemSubtitle,
	DimWrapper,
	ItemSeparator,
	EligibilityDivider,
	EmptyState,
	EmptyText
} from './filters.styles';

import type { FilterTabT, FilterEntryT } from './filters.d';

const TABS: FilterTabT[] = ['category', 'service', 'tender', 'currency'];

const FilterSheet = () => {
	const { t } = useTranslation();
	const theme = useTheme();

	const { lenses } = useAppModel();
	const lensesStore = useUnit(lenses.$store);
	const entries = useFilterValues();
	const eligibleIds = useEligibleIds(lensesStore.filters);

	/* Auto-switch to 'all' when filters have no future results but have past ones */
	useAutoTimeMode(lensesStore.filters, lensesStore.time_mode, lenses.time_mode.set);

	const [activeTab, setActiveTab] = useState<FilterTabT>('category');

	const tabLabels: Record<FilterTabT, string> = useMemo(
		() => ({
			category: t('transactions.filters.tabs.category'),
			service: t('transactions.filters.tabs.service'),
			tender: t('transactions.filters.tabs.tender'),
			currency: t('transactions.filters.tabs.currency')
		}),
		[t]
	);

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
				return { title: localizedName || entry.id, subtitle: entry.id };
			}
			return { title: entry.title, subtitle: entry.subtitle };
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
			if (currentlySelected) lenses.filters.remove({ type: activeTab, value: id });
			else lenses.filters.add({ type: activeTab, value: id });
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		},
		[activeTab, lenses.filters]
	);

	const handleClear = useCallback(() => {
		lenses.filters.clear();
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
	}, [lenses.filters]);

	const handleTabPress = useCallback((tab: FilterTabT) => {
		setActiveTab(tab);
		Haptics.selectionAsync();
	}, []);

	const handleTimeModePress = useCallback(
		(mode: 'all' | 'future') => {
			lenses.time_mode.set(mode);
			Haptics.selectionAsync();
		},
		[lenses.time_mode]
	);

	const totalActiveCount = lensesStore.filters.length;
	const isAllMode = lensesStore.time_mode === 'all';

	return (
		<Root>
			<Header>
				<TitleRow>
					<Title>{t('transactions.filters.title')}</Title>
					{totalActiveCount > 0 && (
						<CountGlass tintColor={theme.accent.primary}>
							<CountText>{totalActiveCount}</CountText>
						</CountGlass>
					)}
				</TitleRow>

				{totalActiveCount > 0 && (
					<Pressable onPress={handleClear} hitSlop={8}>
						<ClearGlass glassEffectStyle="clear" isInteractive>
							<ClearButtonText>{t('transactions.filters.clear')}</ClearButtonText>
						</ClearGlass>
					</Pressable>
				)}
			</Header>

			<AccentRule />

			<TimeModeGlassGroup>
				<TimeModeRow>
					<TimeModeGlass $active={isAllMode} isInteractive>
						<TimeModeInner onPress={() => handleTimeModePress('all')}>
							<TimeModeLabel $active={isAllMode}>{t('transactions.time_mode.all')}</TimeModeLabel>
						</TimeModeInner>
					</TimeModeGlass>

					<TimeModeGlass $active={!isAllMode} isInteractive>
						<TimeModeInner onPress={() => handleTimeModePress('future')}>
							<TimeModeLabel $active={!isAllMode}>{t('transactions.time_mode.future')}</TimeModeLabel>
						</TimeModeInner>
					</TimeModeGlass>
				</TimeModeRow>
			</TimeModeGlassGroup>

			<TabBarRow>
				{TABS.map((tab) => {
					const isActive = activeTab === tab;

					return (
						<TabGlass
							key={tab}
							$active={isActive}
							isInteractive
							tintColor={isActive ? theme.accent.primary : undefined}
						>
							<TabInner onPress={() => handleTabPress(tab)}>
								<TabLabel $active={isActive}>{tabLabels[tab]}</TabLabel>
							</TabInner>
						</TabGlass>
					);
				})}
			</TabBarRow>

			<ItemsSection>
				{sortedEntries.length === 0 ? (
					<EmptyState>
						<EmptyText>{t('transactions.filters.empty')}</EmptyText>
					</EmptyState>
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
										{entry.subtitle ? <ItemSubtitle>{entry.subtitle}</ItemSubtitle> : null}
									</ItemTextGroup>
								</ItemPressable>
							</DimWrapper>

							{index < sortedEntries.length - 1 && index !== ineligibleStartIndex - 1 && <ItemSeparator />}
						</React.Fragment>
					))
				)}
			</ItemsSection>
		</Root>
	);
};

export default FilterSheet;
