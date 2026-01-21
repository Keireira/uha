import React from 'react';
import { isSameMonth } from 'date-fns';

import { useSearchParams } from '@hooks';
import { useDay, useYear, useMonth, useSummariesQuery } from './hooks';

import Root from './summaries.styles';
import { SummaryBlock } from './components';

import { Props } from './summaries.d';

const Summaries = ({ transactions }: Props) => {
	const { txViewMode } = useSearchParams();

	const summaryTxs = useSummariesQuery(transactions);
	const day = useDay(summaryTxs);
	const year = useYear(summaryTxs);
	const month = useMonth(summaryTxs);

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
