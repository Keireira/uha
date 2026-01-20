import { useMemo, useCallback } from 'react';
import { splitEvery, groupBy } from 'ramda';
import {
	format,
	eachMonthOfInterval,
	startOfYear,
	endOfYear,
	lightFormat,
	interval,
	isWithinInterval,
	eachDayOfInterval,
	startOfMonth,
	endOfMonth
} from 'date-fns';

import { useAppModel } from '@models';
import { useUnit } from 'effector-react';

import type { HeaderRowT, QuarterRowT } from '../year.d';
import type { PreparedDbTxT } from '@hooks/use-transactions';

const useCalendar = (transactions: PreparedDbTxT[]) => {
	const { tx_dates } = useAppModel();
	const maxDate = useUnit(tx_dates.maxActiveDate.$value);
	const minDate = useUnit(tx_dates.minActiveDate.$value);

	const withTransactions = useMemo(() => {
		const makeGroups = groupBy((tx: PreparedDbTxT) => {
			return lightFormat(tx.date, 'yyyy-MM-dd');
		});

		const groupedByDate = makeGroups(transactions);

		const withTxs = Object.entries(groupedByDate).reduce(
			(acc, [key, txs]) => {
				if (!txs) return acc;

				return {
					...acc,
					[key]: txs.length > 0
				};
			},
			{} as Record<string, boolean>
		);

		return withTxs;
	}, [transactions]);

	const withTransactionsFn = useCallback(
		(date: Date) => {
			return withTransactions[lightFormat(date, 'yyyy-MM-dd')] ?? false;
		},
		[withTransactions]
	);

	const rows = useMemo(() => {
		const allMonthsList = eachMonthOfInterval({
			start: startOfYear(minDate),
			end: endOfYear(maxDate)
		});

		const quarters = splitEvery(3, allMonthsList);
		const years = splitEvery(4, quarters);

		const flatten = years.flatMap((yearQuarters) => {
			const january = yearQuarters[0][0];

			const headerRow: HeaderRowT = {
				kind: 'header',
				title: lightFormat(january, 'yyyy')
			};

			const quarterRows = yearQuarters.reduce((acc, quarter) => {
				const quarterRow: QuarterRowT = {
					kind: 'quarter',
					data: quarter.map((month) => {
						const isMonthInRange = isWithinInterval(month, interval(minDate, maxDate));

						const daysWithTransactions = eachDayOfInterval({
							start: startOfMonth(month),
							end: endOfMonth(month)
						}).filter(withTransactionsFn);

						return {
							list_key: `calendar-year-quarter-month-${lightFormat(month, 'dd-MM-yyyy')}`,
							monthDate: month,
							isMonthInRange,
							title: format(month, 'MMM'),
							daysWithTransactions
						};
					})
				};

				const withTransactionsInQuarter = quarterRow.data.some((month) => {
					return isWithinInterval(month.monthDate, interval(minDate, maxDate));
				});

				return withTransactionsInQuarter ? [...acc, quarterRow] : acc;
			}, [] as QuarterRowT[]);

			return [headerRow, ...quarterRows];
		});

		return flatten;
	}, [minDate, maxDate, withTransactionsFn]);

	return rows satisfies (HeaderRowT | QuarterRowT)[];
};

export default useCalendar;
