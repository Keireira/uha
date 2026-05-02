import { addDays, addMonths, addWeeks, addYears, format, parseISO } from 'date-fns';
import { and, eq, isNull } from 'drizzle-orm';

import { silentDb } from '@db';
import { servicesTable, subscriptionsTable, timelineEventsTable } from '@db/schema';

import { buildSubscriptionNotifications } from './build';
import { removeNotificationsFor } from './remove';
import { setupNotificationsFor } from './setup';

import type { SubscriptionT } from '@models';

const advanceCycleDate = (base: Date, type: 'days' | 'weeks' | 'months' | 'years', value: number): Date => {
	switch (type) {
		case 'days':
			return addDays(base, value);
		case 'weeks':
			return addWeeks(base, value);
		case 'months':
			return addMonths(base, value);
		case 'years':
			return addYears(base, value);
	}
};

const computeTrialEndDate = (subscriptionId: SubscriptionT['id']): string | undefined => {
	const trial = silentDb
		.select()
		.from(timelineEventsTable)
		.where(and(eq(timelineEventsTable.subscription_id, subscriptionId), eq(timelineEventsTable.type, 'trial')))
		.get();

	if (!(trial && trial.duration_type && typeof trial.duration_value === 'number')) return undefined;

	return format(advanceCycleDate(parseISO(trial.date), trial.duration_type, trial.duration_value), 'yyyy-MM-dd');
};

const resolveTitle = (subscription: SubscriptionT): string => {
	if (subscription.custom_name) return subscription.custom_name;

	const service = silentDb
		.select({ title: servicesTable.title })
		.from(servicesTable)
		.where(eq(servicesTable.id, subscription.service_id))
		.get();

	return service?.title ?? '';
};

export const reconcileSubscription = async (subscriptionId: SubscriptionT['id']): Promise<void> => {
	const subscription = silentDb
		.select()
		.from(subscriptionsTable)
		.where(eq(subscriptionsTable.id, subscriptionId))
		.get();

	if (!subscription) return;

	await removeNotificationsFor(subscriptionId)();

	if (subscription.cancellation_date) return;
	if (!subscription.notify_enabled && !subscription.notify_trial_end) return;

	const trialEndDate = subscription.notify_trial_end ? computeTrialEndDate(subscriptionId) : undefined;
	const desired = buildSubscriptionNotifications({
		title: resolveTitle(subscription),
		firstPaymentDate: subscription.first_payment_date,
		billingCycleType: subscription.billing_cycle_type,
		billingCycleValue: subscription.billing_cycle_value,
		notifyEnabled: subscription.notify_enabled,
		notifyDaysBefore: subscription.notify_days_before,
		notifyTrialEnd: subscription.notify_trial_end,
		trialEndDate
	});

	if (!desired.length) return;

	await setupNotificationsFor(subscriptionId)(desired);
};

export const reconcileAllSubscriptions = async (): Promise<void> => {
	const subscriptions = silentDb
		.select({ id: subscriptionsTable.id })
		.from(subscriptionsTable)
		.where(isNull(subscriptionsTable.cancellation_date))
		.all();

	for (const { id } of subscriptions) {
		await reconcileSubscription(id);
	}
};
