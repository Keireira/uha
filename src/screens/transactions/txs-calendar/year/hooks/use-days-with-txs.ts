import { useMemo, useCallback } from 'react';
import { lightFormat } from 'date-fns';

import type { PreparedDbTxT } from '@hooks/use-transactions';

const EMPTY_SET = new Set<string>();

const useDaysWithTxs = (transactions: PreparedDbTxT[]) => {
	const txDatesByMonths = useMemo(() => {
		const map = new Map<string, Set<string>>();

		for (const tx of transactions) {
			const monthKey = lightFormat(tx.date, 'yyyy-MM');

			if (!map.has(monthKey)) {
				map.set(monthKey, new Set<string>());
			}

			map.get(monthKey)!.add(lightFormat(tx.date, 'yyyy-MM-dd'));
		}

		return map;
	}, [transactions]);

	const daysWithTxsFn = useCallback(
		(monthDate: Date) => {
			const dateKey = lightFormat(monthDate, 'yyyy-MM');

			return txDatesByMonths.get(dateKey) ?? EMPTY_SET;
		},
		[txDatesByMonths]
	);

	return daysWithTxsFn;
};

export default useDaysWithTxs;
