import React, { useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { SymbolView } from 'expo-symbols';
import * as Haptics from 'expo-haptics';
import { PieChart } from 'react-native-gifted-charts';

import db from '@db';
import { eq } from 'drizzle-orm';
import { currenciesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { useSettingsValue, useGetFilledDateRates } from '@hooks';
import { useDay, useYear, useMonth, useSummariesQuery } from '../tx-sticky-header/summaries/hooks';

import { LogoView } from '@ui';
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
	LegendColorDot,
	MerchantSection,
	MerchantItem,
	MerchantTextGroup,
	MerchantTitle,
	MerchantAmount
} from './analytics-sheet.styles';

import type { CurrencyT } from '@models';
import type { PreparedDbTxT } from '@hooks/use-transactions';

const ALL_TABS = ['day', 'month', 'year'] as const;

type MerchantBreakdownT = {
	id: string;
	title: string;
	amount: number;
	formattedAmount: string;
	tx: PreparedDbTxT;
};

const formatAmount = (amount: number, currency: CurrencyT): string =>
	amount.toLocaleString(currency.intl_locale, {
		style: 'currency',
		currency: currency.id,
		currencyDisplay: 'symbol',
		minimumFractionDigits: amount > 1000 ? 0 : currency.fraction_digits,
		maximumFractionDigits: amount > 1000 ? 0 : currency.fraction_digits
	});

const AnalyticsSheet = () => {
	const { clavis } = useLocalSearchParams<{ clavis: string }>();
	const router = useRouter();
	const { t } = useTranslation();
	const theme = useTheme();
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
	const selectedCategory = enrichedCategories.find((cat) => cat.id === selectedCategoryId);
	const isDrillingDown = Boolean(selectedCategory);
	const title = selectedCategory?.title ?? activeSummary.formattedDate;

	const formattedTotal = activeSummary.total > 0 && currency ? formatAmount(activeSummary.total, currency) : '—';

	const pieData = enrichedCategories.map((cat) => ({
		id: cat.id,
		value: cat.amount,
		color: cat.color
	}));

	const merchants = useMemo((): MerchantBreakdownT[] => {
		if (!selectedCategory || !currency) {
			return [];
		}

		const byMerchant = new Map<string, MerchantBreakdownT>();
		const txs = activeSummary.transactions.filter((tx) => tx.category_slug === selectedCategory.id);

		for (const tx of txs) {
			const key = tx.subscription_id;
			const denominator = tx.denominator || 1;
			const amount = tx.price / denominator;
			const current = byMerchant.get(key);

			if (current) {
				current.amount += amount;
				current.formattedAmount = formatAmount(current.amount, currency);
				continue;
			}

			byMerchant.set(key, {
				id: key,
				title: tx.customName || tx.title,
				amount,
				formattedAmount: formatAmount(amount, currency),
				tx
			});
		}

		return Array.from(byMerchant.values()).sort((a, b) => b.amount - a.amount);
	}, [activeSummary.transactions, currency, selectedCategory]);

	const filteredMerchants = useMemo(() => {
		if (!selectedCategory || !currency) {
			return [];
		}

		return merchants.filter((merchant) => merchant.id !== selectedCategory.id);
	}, [selectedCategory, currency, merchants]);

	const drilledMerchants = filteredMerchants.map((merchant) => ({
		id: merchant.id,
		value: merchant.amount,
		color: merchant.tx.color
	}));

	const formattedTotalFormatted =
		drilledMerchants.length > 0 && currency
			? formatAmount(
					drilledMerchants.reduce((acc, merchant) => acc + merchant.value, 0),
					currency
				)
			: '—';

	const centerMerchantLabel = () => (
		<CenterLabel>
			<TotalText>{formattedTotalFormatted}</TotalText>
		</CenterLabel>
	);

	const centerLabel = () => (
		<CenterLabel>
			<TotalText>{formattedTotal}</TotalText>
		</CenterLabel>
	);

	const handleTabPress = (tab: string) => {
		if (tab === activeClavis) return;
		Haptics.selectionAsync();
		setSelectedCategoryId(null);
		setActiveClavis(tab);
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

	return (
		<Root>
			<Header>
				<CloseGlass isInteractive>
					<CloseInner onPress={isDrillingDown ? resetDrilldown : () => router.back()} hitSlop={10}>
						<SymbolView
							name={isDrillingDown ? 'chevron.left' : 'xmark'}
							size={16}
							weight="bold"
							tintColor={theme.text.primary}
						/>
					</CloseInner>
				</CloseGlass>
				<Title numberOfLines={1} ellipsizeMode="tail">
					{title}
				</Title>
				{/* Spacer to balance close button for centering */}
				<CloseGlass style={{ opacity: 0 }} />
			</Header>

			<TabBarRow>
				{tabs.map((tab) => {
					const isActive = activeClavis === tab;

					return (
						<TabGlass
							key={tab}
							$active={isActive}
							isInteractive
							tintColor={isActive ? theme.accents.orange : undefined}
						>
							<TabInner onPress={() => handleTabPress(tab)}>
								<TabLabel $active={isActive}>{t(`dates.${tab}`)}</TabLabel>
							</TabInner>
						</TabGlass>
					);
				})}
			</TabBarRow>

			<ChartSection>
				{isDrillingDown && drilledMerchants.length > 0 && (
					<PieChart
						data={drilledMerchants}
						donut
						radius={120}
						innerRadius={80}
						innerCircleColor={theme.background.secondary}
						centerLabelComponent={centerMerchantLabel}
						onPress={(item: (typeof pieData)[number]) => selectCategory(item.id)}
						strokeWidth={4}
						strokeColor={theme.background.secondary}
					/>
				)}

				{!isDrillingDown && pieData.length > 0 && (
					<PieChart
						data={pieData}
						donut
						radius={120}
						innerRadius={80}
						innerCircleColor={theme.background.secondary}
						centerLabelComponent={centerLabel}
						onPress={(item: (typeof pieData)[number]) => selectCategory(item.id)}
						strokeWidth={4}
						strokeColor={theme.background.secondary}
					/>
				)}
			</ChartSection>

			{isDrillingDown ? (
				<MerchantSection>
					{merchants.map(({ id, title: merchantTitle, formattedAmount, tx }) => {
						const hasCustomLogo = Boolean(tx.custom_logo || tx.custom_symbol);
						const customSymbol = (tx.custom_symbol ?? undefined) as React.ComponentProps<typeof LogoView>['symbolName'];

						return (
							<MerchantItem key={id}>
								<LogoView
									url={tx.custom_logo ?? tx.logo_url}
									slug={hasCustomLogo ? null : tx.slug}
									symbolName={customSymbol}
									emoji={tx.emoji}
									name={merchantTitle}
									size={36}
									color={tx.color}
								/>

								<MerchantTextGroup>
									<MerchantTitle numberOfLines={1} ellipsizeMode="tail">
										{merchantTitle}
									</MerchantTitle>
									<MerchantAmount>{formattedAmount}</MerchantAmount>
								</MerchantTextGroup>
							</MerchantItem>
						);
					})}
				</MerchantSection>
			) : (
				<LegendSection>
					{enrichedCategories.map((cat) => (
						<LegendItem key={cat.id} onPress={() => selectCategory(cat.id)}>
							<LegendColorDot $color={cat.color} />
							<LegendEmoji>{cat.emoji}</LegendEmoji>
							<LegendTextGroup>
								<LegendTitle>{cat.title}</LegendTitle>
								<LegendAmount>{cat.formattedAmount}</LegendAmount>
							</LegendTextGroup>
						</LegendItem>
					))}
				</LegendSection>
			)}
		</Root>
	);
};

export default AnalyticsSheet;
