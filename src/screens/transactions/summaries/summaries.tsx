import React from 'react';
import { isSameMonth } from 'date-fns';
import { useUnit } from 'effector-react';

import { useAppModel } from '@models';
import { useDay, useYear, useMonth, useSummariesQuery } from './hooks';

import Root from './summaries.styles';
import { SummaryBlock } from './components';

const Summaries = () => {
	const { view_mode } = useAppModel();
	const viewMode = useUnit(view_mode.$mode);
	const isCalendarMode = viewMode === 'calendar';

	const transactions = useSummariesQuery();
	const day = useDay(transactions);
	const year = useYear(transactions);
	const month = useMonth(transactions);

	return (
		<Root>
			{isCalendarMode && (
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
