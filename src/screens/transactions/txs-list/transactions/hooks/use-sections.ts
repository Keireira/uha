import { useMemo } from 'react';
import { groupBy } from 'ramda';
import { useTranslation } from 'react-i18next';
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';

import useTransactions from '@hooks/use-transactions';

import type { HeaderSectionT, TI18nT } from '../transactions.d';
import type { TransactionProps } from '../transaction-card/transaction-card.d';

/* Generate transactions sections */
const makeGroups = groupBy((tx: TransactionProps) => {
	return format(new Date(tx.date), 'yyyy-MM-dd');
});

const getDateLabel = (date: Date, t: TI18nT) => {
	if (isToday(date)) return t('dates.today');
	if (isTomorrow(date)) return t('dates.tomorrow');
	if (isYesterday(date)) return t('dates.yesterday');

	const isCurrentYear = date.getFullYear() === new Date().getFullYear();

	return format(date, isCurrentYear ? 'd MMMM' : 'd MMMM, yyyy');
};

const calcTotalAmount = (txs: TransactionProps[]) => {
	const total = txs.reduce((acc, tx) => acc + tx.price / (tx.denominator || 1), 0);

	const formattedTotal = total.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: total > 1000 ? 0 : 2
	});

	return formattedTotal;
};

const useTransactionsSections = () => {
	const { t } = useTranslation();
	const transactions = useTransactions();

	const sections = useMemo(() => {
		const groupedByDate = makeGroups(transactions);

		const sectioned = Object.entries(groupedByDate).flatMap(([_, txs]) => {
			if (!txs) return [];

			const date = new Date(txs[0].date);
			const rightPart = txs.length > 1 ? calcTotalAmount(txs) : null;
			const dateLabel = getDateLabel(date, t);

			const headerSection: HeaderSectionT = {
				type: 'sectionHeader',
				date: dateLabel,
				total: rightPart
			};

			return [headerSection, ...txs];
		});

		return sectioned;
	}, [t, transactions]);

	return sections satisfies (HeaderSectionT | TransactionProps)[];
};

export default useTransactionsSections;
