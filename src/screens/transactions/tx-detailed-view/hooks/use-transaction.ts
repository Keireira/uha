import { first } from '@lib';
import { useLocalSearchParams } from 'expo-router';

import {
	tendersTable,
	servicesTable,
	currenciesTable,
	categoriesTable,
	transactionsTable,
	subscriptionsTable
} from '@db/schema';
import db from '@db';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import type { PreparedDbTxT } from '@hooks/use-transactions';

const useTransaction = (): PreparedDbTxT | undefined => {
	const { transactionId } = useLocalSearchParams<{ transactionId: string }>();

	const { data: transaction } = useLiveQuery(
		db
			.select({
				id: transactionsTable.id,
				currency: currenciesTable.symbol,
				currency_code: currenciesTable.id,
				denominator: currenciesTable.denominator,
				price: transactionsTable.amount,
				slug: servicesTable.slug,
				title: servicesTable.title,
				customName: subscriptionsTable.custom_name,
				emoji: categoriesTable.emoji,
				color: servicesTable.color,
				date: transactionsTable.date,
				isPhantom: transactionsTable.is_phantom,
				comment: transactionsTable.comment,

				/* category-related fields */
				category_id: categoriesTable.id,
				category_title: categoriesTable.title,
				category_color: categoriesTable.color,

				/* tender-related fields */
				tender_id: tendersTable.id,
				tender_emoji: tendersTable.emoji,
				tender_title: tendersTable.title,
				tender_comment: tendersTable.comment
			})
			.from(transactionsTable)
			.innerJoin(currenciesTable, eq(transactionsTable.currency_id, currenciesTable.id))
			.innerJoin(subscriptionsTable, eq(transactionsTable.subscription_id, subscriptionsTable.id))
			.innerJoin(servicesTable, eq(subscriptionsTable.service_id, servicesTable.id))
			.innerJoin(categoriesTable, eq(servicesTable.category_id, categoriesTable.id))
			.leftJoin(tendersTable, eq(transactionsTable.tender_id, tendersTable.id))
			.where(eq(transactionsTable.id, transactionId))
	);

	return first(transaction);
};

export default useTransaction;
