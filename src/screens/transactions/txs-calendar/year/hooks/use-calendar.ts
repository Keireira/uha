import { useMemo } from 'react';
import { splitEvery } from 'ramda';
import { format, eachMonthOfInterval, startOfYear, endOfYear, lightFormat, interval, isWithinInterval } from 'date-fns';

import { useTxDatesStore } from '@screens/transactions/models';
import useDaysWithTxs from './use-days-with-txs';

import type { PreparedDbTxT } from '@hooks/use-transactions';
import type { ItemT, HeaderRowT, QuarterRowT } from '../year.d';

const useCalendar = (transactions: PreparedDbTxT[]) => {
	const maxDate = useTxDatesStore((s) => s.maxActiveDate);
	const minDate = useTxDatesStore((s) => s.minActiveDate);

	const daysWithTxsFn = useDaysWithTxs(transactions);

	const rows = useMemo(() => {
		const allMonthsList = eachMonthOfInterval({
			start: startOfYear(minDate),
			end: endOfYear(maxDate)
		});

		const quarters = splitEvery(3, allMonthsList);
		const years = splitEvery(4, quarters);

		const flattenYears = years.flatMap((yearQuarters) => {
			const january = yearQuarters[0][0];

			const headerRow: HeaderRowT = {
				kind: 'header',
				title: lightFormat(january, 'yyyy')
			};

			const quarterRows: QuarterRowT[] = [];

			for (const quarter of yearQuarters) {
				const mappedMonths = quarter.map((month) => ({
					list_key: `calendar-year-quarter-month-${lightFormat(month, 'yyyy-MM')}`,
					monthDate: month,
					title: format(month, 'LLL'),
					daysWithTxs: daysWithTxsFn(month),
					isMonthInRange: isWithinInterval(month, interval(minDate, maxDate))
				}));

				const isQuarterInRange = mappedMonths.some((m) => m.isMonthInRange);

				if (isQuarterInRange) {
					quarterRows.push(mappedMonths);
				}
			}

			return [headerRow, ...quarterRows];
		});

		return flattenYears;
	}, [minDate, maxDate, daysWithTxsFn]);

	return rows satisfies ItemT[];
};

export default useCalendar;
