import React, { useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { SymbolView } from 'expo-symbols';
import * as Haptics from 'expo-haptics';
import { format } from 'date-fns';
import { PieChart } from 'react-native-gifted-charts';

import db from '@db';
import { eq } from 'drizzle-orm';
import { currenciesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { useSettingsValue } from '@hooks';
import { useDay, useYear, useMonth, useSummariesQuery, useGetLastKnownRates } from '../summaries/hooks';

import useCategoryDetails from './use-category-details';
import Root, {
	Header,
	CloseGlass,
	CloseInner,
	Title,
	TabBarRow,
	TabGlass,
	TabInner,
	TabLabel,
	ChartSection,
	CenterLabel,
	TotalText,
	LegendSection,
	LegendItem,
	LegendEmoji,
	LegendTextGroup,
	LegendTitle,
	LegendAmount,
	LegendColorDot
} from './analytics-sheet.styles';

const ALL_TABS = ['day', 'month', 'year'] as const;

const DATE_FORMATS: Record<string, string> = {
	day: 'd MMMM',
	month: 'MMMM yyyy',
	year: 'yyyy'
};

const AnalyticsSheet = () => {
	const { clavis } = useLocalSearchParams<{ clavis: string }>();
	const router = useRouter();
	const { t } = useTranslation();
	const theme = useTheme();
	const [activeClavis, setActiveClavis] = useState(clavis ?? 'month');

	const tabs = useMemo(() => (clavis === 'day' ? ALL_TABS : ALL_TABS.filter((tab) => tab !== 'day')), [clavis]);

	const recalcCurrencyCode = useSettingsValue<string>('recalc_currency_code');

	const {
		data: [currency]
	} = useLiveQuery(db.select().from(currenciesTable).where(eq(currenciesTable.id, recalcCurrencyCode)).limit(1), [
		recalcCurrencyCode
	]);

	const summaryTxs = useSummariesQuery();
	const lastKnownRates = useGetLastKnownRates(
		summaryTxs.dates.dayFormatted,
		summaryTxs.dates.monthStartFormatted,
		summaryTxs.dates.yearStartFormatted
	);

	const day = useDay(summaryTxs, lastKnownRates);
	const month = useMonth(summaryTxs, lastKnownRates);
	const year = useYear(summaryTxs, lastKnownRates);

	const activeSummary = activeClavis === 'day' ? day : activeClavis === 'year' ? year : month;
	const titleDate = format(activeSummary.rawDate, DATE_FORMATS[activeClavis] ?? 'MMMM yyyy');
	const enrichedCategories = useCategoryDetails(activeSummary.categories, currency);

	const formattedTotal =
		activeSummary.total > 0 && currency
			? activeSummary.total.toLocaleString(currency.intl_locale, {
					style: 'currency',
					currency: currency.id,
					currencyDisplay: 'symbol',
					minimumFractionDigits: activeSummary.total > 1000 ? 0 : currency.fraction_digits,
					maximumFractionDigits: activeSummary.total > 1000 ? 0 : currency.fraction_digits
				})
			: '—';

	const pieData = enrichedCategories.map((cat) => ({
		value: cat.amount,
		color: cat.color
	}));

	const centerLabel = () => (
		<CenterLabel>
			<TotalText>{formattedTotal}</TotalText>
		</CenterLabel>
	);

	const handleTabPress = (tab: string) => {
		if (tab === activeClavis) return;
		Haptics.selectionAsync();
		setActiveClavis(tab);
	};

	return (
		<Root contentContainerStyle={{ paddingBottom: 48 }}>
			<Header>
				<CloseGlass isInteractive>
					<CloseInner onPress={() => router.back()} hitSlop={10}>
						<SymbolView name="xmark" size={16} weight="bold" tintColor={theme.text.primary} />
					</CloseInner>
				</CloseGlass>
				<Title>{titleDate}</Title>
				{/* Spacer to balance close button for centering */}
				<CloseGlass style={{ opacity: 0 }} />
			</Header>

			<TabBarRow>
				{tabs.map((tab) => {
					const isActive = activeClavis === tab;

					return (
						<TabGlass key={tab} $active={isActive} isInteractive tintColor={isActive ? theme.accent.orange : undefined}>
							<TabInner onPress={() => handleTabPress(tab)}>
								<TabLabel $active={isActive}>{t(`dates.${tab}`)}</TabLabel>
							</TabInner>
						</TabGlass>
					);
				})}
			</TabBarRow>

			<ChartSection>
				{pieData.length > 0 && (
					<PieChart
						data={pieData}
						donut
						radius={120}
						innerRadius={80}
						innerCircleColor={theme.background.secondary}
						centerLabelComponent={centerLabel}
						strokeWidth={4}
						strokeColor={theme.background.secondary}
					/>
				)}
			</ChartSection>

			<LegendSection>
				{enrichedCategories.map((cat) => (
					<LegendItem key={cat.id}>
						<LegendColorDot $color={cat.color} />
						<LegendEmoji>{cat.emoji}</LegendEmoji>
						<LegendTextGroup>
							<LegendTitle>{cat.title}</LegendTitle>
							<LegendAmount>{cat.formattedAmount}</LegendAmount>
						</LegendTextGroup>
					</LegendItem>
				))}
			</LegendSection>
		</Root>
	);
};

export default AnalyticsSheet;
