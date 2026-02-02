import React from 'react';
import { isSameMonth } from 'date-fns';

import { useSearchParams } from '@hooks';
import { useDay, useYear, useMonth, useSummariesQuery, useGetLastKnownRates } from './hooks';

import Root from './summaries.styles';
import { SummaryBlock } from './components';

const Summaries = () => {
	const { txViewMode } = useSearchParams();

	const summaryTxs = useSummariesQuery();
	const lastKnownRates = useGetLastKnownRates(
		summaryTxs.dates.dayFormatted,
		summaryTxs.dates.monthStartFormatted,
		summaryTxs.dates.yearStartFormatted
	);

	const day = useDay(summaryTxs, lastKnownRates);
	const year = useYear(summaryTxs, lastKnownRates);
	const month = useMonth(summaryTxs, lastKnownRates);

	return (
		<Root>
			{txViewMode === 'calendar' && (
				<SummaryBlock
					clavis="day"
					total={day.total}
					formattedDate={day.formattedDate}
					categories={day.categories}
					isDisabled={!isSameMonth(day.rawDate, month.rawDate)}
				/>
			)}

			<SummaryBlock
				clavis="month"
				total={month.total}
				formattedDate={month.formattedDate}
				categories={month.categories}
			/>

			<SummaryBlock clavis="year" total={year.total} formattedDate={year.formattedDate} categories={year.categories} />
		</Root>
	);
};

export default Summaries;
