import { useLocalSearchParams } from 'expo-router';

import { eq } from 'drizzle-orm';
import { transactionsTable } from '@db/schema';
import { useTransactionsQuery } from '@hooks/use-transactions';

import type { PreparedDbTxT } from '@hooks/use-transactions';

const useTransaction = (): PreparedDbTxT | undefined => {
	const { transactionId } = useLocalSearchParams<{ transactionId: string }>();

	const [transaction] = useTransactionsQuery({
		forcedTimeMode: 'all',
		withFilters: false,
		customWhere: eq(transactionsTable.id, transactionId)
	});

	return transaction;
};

export default useTransaction;
