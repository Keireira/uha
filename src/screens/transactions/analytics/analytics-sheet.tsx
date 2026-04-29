import React, { useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';

import db from '@db';
import { eq } from 'drizzle-orm';
import { currenciesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { useSettingsValue, useGetFilledDateRates } from '@hooks';
import { useDay, useYear, useMonth, useSummariesQuery } from '../tx-sticky-header/summaries/hooks';

import { buildMerchantBreakdown, formatAmount } from './utils';
import useCategoryDetails from './use-category-details';
import AnalyticsHeader from './components/analytics-header';
import PeriodTabs from './components/period-tabs';
import AnalyticsChartCard from './components/analytics-chart-card';
import BreakdownList from './components/breakdown-list';
import Root from './analytics-sheet.styles';

import type { BreakdownRowT, BreakdownSectionT, ChartDatumT } from './analytics.d';

const ALL_TABS = ['day', 'month', 'year'] as const;
const OTHER_CATEGORY_ID = '__other_categories__';
const OTHER_CATEGORY_THRESHOLD = 0.08;
const MAX_CHART_CATEGORY_COUNT = 5;
const OTHER_CATEGORY_COLOR = '#8E8E93';
const OTHER_CATEGORY_EMOJI = '•••';

const AnalyticsSheet = () => {
	const { clavis } = useLocalSearchParams<{ clavis: string }>();
	const { t } = useTranslation();
	const [activeClavis, setActiveClavis] = useState(clavis ?? 'month');
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

	const tabs = useMemo(() => (clavis === 'day' ? ALL_TABS : ALL_TABS.filter((tab) => tab !== 'day')), [clavis]);
	const recalcCurrencyCode = useSettingsValue<string>('recalc_currency');

	const {
		data: [currency]
	} = useLiveQuery(db.select().from(currenciesTable).where(eq(currenciesTable.id, recalcCurrencyCode)).limit(1), [
		recalcCurrencyCode
	]);

	const summaryTxs = useSummariesQuery();
	const filledRates = useGetFilledDateRates(summaryTxs.dates.dayRaw);

	const day = useDay(summaryTxs, filledRates);
	const month = useMonth(summaryTxs, filledRates);
	const year = useYear(summaryTxs, filledRates);
	const activeSummary = activeClavis === 'day' ? day : activeClavis === 'year' ? year : month;

	const enrichedCategories = useCategoryDetails(activeSummary.categories, currency);
	const smallCategoryIds = useMemo(() => {
		if (activeSummary.total <= 0) return new Set<string>();

		return new Set(
			enrichedCategories
				.filter(
					(cat, index) =>
						index >= MAX_CHART_CATEGORY_COUNT || cat.amount / activeSummary.total < OTHER_CATEGORY_THRESHOLD
				)
				.map((cat) => cat.id)
		);
	}, [activeSummary.total, enrichedCategories]);
	const smallCategories = useMemo(
		() => enrichedCategories.filter((cat) => smallCategoryIds.has(cat.id)),
		[enrichedCategories, smallCategoryIds]
	);
	const otherCategoryAmount = smallCategories.reduce((acc, cat) => acc + cat.amount, 0);
	const otherCategory =
		smallCategories.length > 0 && currency
			? {
					id: OTHER_CATEGORY_ID,
					title: t('transactions.analytics.other_categories'),
					amount: otherCategoryAmount,
					formattedAmount: formatAmount(otherCategoryAmount, currency),
					color: OTHER_CATEGORY_COLOR,
					emoji: OTHER_CATEGORY_EMOJI
				}
			: null;
	const visibleCategories = otherCategory
		? [...enrichedCategories.filter((cat) => !smallCategoryIds.has(cat.id)), otherCategory]
		: enrichedCategories;
	const selectedCategory = enrichedCategories.find((cat) => cat.id === selectedCategoryId);
	const isOtherCategorySelected = selectedCategoryId === OTHER_CATEGORY_ID && Boolean(otherCategory);
	const merchantBreakdown = useMemo(() => {
		if (!currency || !selectedCategory) return [];

		return buildMerchantBreakdown(
			activeSummary.transactions.filter((tx) => tx.category_slug === selectedCategory.id),
			currency
		);
	}, [activeSummary.transactions, currency, selectedCategory]);

	const categoryMerchantCounts = useMemo(() => {
		const counts = new Map<string, Set<string>>();

		for (const tx of activeSummary.transactions) {
			if (!tx.category_slug) continue;

			const merchantIds = counts.get(tx.category_slug) ?? new Set<string>();
			merchantIds.add(tx.service_id || tx.slug || tx.title);
			counts.set(tx.category_slug, merchantIds);
		}

		return counts;
	}, [activeSummary.transactions]);

	const chartData: ChartDatumT[] = selectedCategory
		? merchantBreakdown.map((merchant) => ({
				id: merchant.id,
				value: merchant.amount,
				color: merchant.tx.color || selectedCategory.color
			}))
		: isOtherCategorySelected
			? smallCategories.map((cat) => ({
					id: cat.id,
					value: cat.amount,
					color: cat.color
				}))
			: visibleCategories.map((cat) => ({
					id: cat.id,
					value: cat.amount,
					color: cat.color
				}));

	const chartTotal = selectedCategory?.amount ?? (isOtherCategorySelected ? otherCategoryAmount : activeSummary.total);
	const formattedTotal = currency && chartTotal > 0 ? formatAmount(chartTotal, currency) : '—';
	const periodTitle =
		selectedCategory?.title ?? (isOtherCategorySelected ? otherCategory?.title : activeSummary.formattedDate);
	const servicesLabel = t('navbar.library.services', { defaultValue: 'Services' }).toLowerCase();

	const largeCategories = otherCategory
		? enrichedCategories.filter((cat) => !smallCategoryIds.has(cat.id))
		: enrichedCategories;
	const categoryRows: BreakdownRowT[] = largeCategories.map((cat) => ({
		type: 'category',
		id: cat.id,
		title: cat.title,
		subtitle: `${categoryMerchantCounts.get(cat.id)?.size ?? 0} ${servicesLabel}`,
		amount: cat.amount,
		formattedAmount: cat.formattedAmount,
		color: cat.color,
		emoji: cat.emoji
	}));

	const smallCategoryRows: BreakdownRowT[] = smallCategories.map((cat) => ({
		type: 'category',
		id: cat.id,
		title: cat.title,
		subtitle: `${categoryMerchantCounts.get(cat.id)?.size ?? 0} ${servicesLabel}`,
		amount: cat.amount,
		formattedAmount: cat.formattedAmount,
		color: cat.color,
		emoji: cat.emoji
	}));

	const merchantRows: BreakdownRowT[] = merchantBreakdown.map((merchant) => ({
		type: 'merchant',
		id: merchant.id,
		title: merchant.title,
		subtitle: selectedCategory?.title ?? '',
		amount: merchant.amount,
		formattedAmount: merchant.formattedAmount,
		tx: merchant.tx
	}));

	const handleTabChange = (tab: string) => {
		setSelectedCategoryId(null);
		setActiveClavis(tab);
	};

	const selectChartDatum = (id: string) => {
		if (selectedCategory) return;
		Haptics.selectionAsync();
		setSelectedCategoryId(id);
	};

	const selectCategory = (id: string) => {
		Haptics.selectionAsync();
		setSelectedCategoryId(id);
	};

	const resetDrilldown = () => {
		if (!selectedCategoryId) return;
		Haptics.selectionAsync();
		setSelectedCategoryId(null);
	};
	const topLevelSections: BreakdownSectionT[] = [
		...(categoryRows.length > 0 ? [{ id: 'categories', rows: categoryRows }] : []),
		...(otherCategory && smallCategoryRows.length > 0
			? [{ id: OTHER_CATEGORY_ID, title: otherCategory.title, rows: smallCategoryRows }]
			: [])
	];
	const sections: BreakdownSectionT[] = selectedCategory
		? [{ id: 'merchants', rows: merchantRows }]
		: isOtherCategorySelected
			? [{ id: OTHER_CATEGORY_ID, rows: smallCategoryRows }]
			: topLevelSections;

	return (
		<Root>
			<AnalyticsHeader
				title={periodTitle ?? activeSummary.formattedDate}
				isNested={Boolean(selectedCategory || isOtherCategorySelected)}
				onBack={resetDrilldown}
			/>

			<PeriodTabs tabs={tabs} activeTab={activeClavis} onChange={handleTabChange} />

			<AnalyticsChartCard data={chartData} total={formattedTotal} onPressDatum={selectChartDatum} />
			<BreakdownList sections={sections} onPressCategory={selectCategory} />
		</Root>
	);
};

export default AnalyticsSheet;
