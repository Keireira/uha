import { asc } from 'drizzle-orm';
import { createEffect, createEvent, createStore, sample } from 'effector';

import { paymentMethodsTable } from '@db/schema';
import type { PaymentT, DBT } from '@models/app-model.d';

const createPaymentsModel = ({ db }: { db: DBT }) => {
	const $payments = createStore<PaymentT[]>([]);
	const getPaymentsFx = createEffect(async () => {
		const payments = await db.select().from(paymentMethodsTable).orderBy(asc(paymentMethodsTable.title));

		return payments;
	});
	const setPayments = createEvent<PaymentT[]>();

	sample({
		clock: getPaymentsFx.doneData,
		target: $payments
	});

	sample({
		clock: setPayments,
		fn: (payments) => {
			db.insert(paymentMethodsTable).values(payments);

			return payments;
		},
		target: $payments
	});

	getPaymentsFx();

	return {
		$payments,
		setPayments
	};
};

export default createPaymentsModel;
