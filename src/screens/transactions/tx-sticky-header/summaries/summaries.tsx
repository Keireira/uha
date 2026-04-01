import React from 'react';
import { isSameMonth } from 'date-fns';
import { useRouter } from 'expo-router';

import { useSearchParams, useGetFilledDateRates } from '@hooks';
import { useDay, useYear, useMonth, useSummariesQuery } from './hooks';

import Root from './summaries.styles';
import { SummaryBlock } from './components';

const Summaries = () => {
	const router = useRouter();
	const { txViewMode } = useSearchParams();

	const summaryTxs = useSummariesQuery();
	const filledRates = useGetFilledDateRates(summaryTxs.dates.dayRaw);

	const day = useDay(summaryTxs, filledRates);
	const year = useYear(summaryTxs, filledRates);
	const month = useMonth(summaryTxs, filledRates);

	const openAnalytics = (clavis: string) => {
		router.push({ pathname: '/(tabs)/transactions/analytics', params: { clavis } });
	};

	return (
		<Root>
			{txViewMode === 'calendar' && (
				<SummaryBlock
					clavis="day"
					total={day.total}
					formattedDate={day.formattedDate}
					categories={day.categories}
					isDisabled={!isSameMonth(day.rawDate, month.rawDate)}
					onPress={() => openAnalytics('day')}
				/>
			)}

			<SummaryBlock
				clavis="month"
				total={month.total}
				formattedDate={month.formattedDate}
				categories={month.categories}
				onPress={() => openAnalytics('month')}
			/>

			<SummaryBlock
				clavis="year"
				total={year.total}
				formattedDate={year.formattedDate}
				categories={year.categories}
				onPress={() => openAnalytics('year')}
			/>
		</Root>
	);
};

export default Summaries;
