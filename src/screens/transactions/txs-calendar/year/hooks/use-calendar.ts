import { useMemo } from 'react';
import { splitEvery } from 'ramda';
import { format, eachMonthOfInterval, startOfYear, endOfYear, lightFormat, interval, isWithinInterval } from 'date-fns';

import { useAppModel } from '@models';
import { useUnit } from 'effector-react';
import useDaysWithTxs from './use-days-with-txs';

import type { PreparedDbTxT } from '@hooks/use-transactions';
import type { ItemT, HeaderRowT, QuarterRowT } from '../year.d';

const LIST_KEY_PREFIX = 'calendar-year-quarter-month';

const useCalendar = (transactions: PreparedDbTxT[]) => {
	const { tx_dates } = useAppModel();
	const maxDate = useUnit(tx_dates.maxActiveDate.$value);
	const minDate = useUnit(tx_dates.minActiveDate.$value);

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
					list_key: `${LIST_KEY_PREFIX}-${lightFormat(month, 'yyyy-MM')}`,
					monthDate: month,
					title: format(month, 'MMM'),
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
