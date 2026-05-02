import { parseISO, set, subDays } from 'date-fns';
import i18next from 'i18next';

import { addByCycle } from '@screens/crossroad/add-subscription/events';

import type { BillingCycleT } from '@screens/crossroad/add-subscription/events';
import type { PushNotificationT } from './notifications.d';

export type BuildSubscriptionNotificationsArgsT = {
	title: string;
	firstPaymentDate: string;
	billingCycleType: BillingCycleT;
	billingCycleValue: number;
	notifyEnabled: boolean;
	notifyDaysBefore: number;
	notifyTrialEnd: boolean;
	trialEndDate?: string;
	now?: Date;
};

const NOTIFY_HOUR = 12;

const atNoon = (date: Date) =>
	set(date, {
		hours: NOTIFY_HOUR,
		minutes: 0,
		seconds: 0,
		milliseconds: 0
	});

const advanceUntilFuture = (
	from: Date,
	billingCycleType: BillingCycleT,
	billingCycleValue: number,
	now: Date
): Date => {
	let next = from;
	let guard = 0;
	while (next.getTime() <= now.getTime() && guard < 1000) {
		next = addByCycle(next, billingCycleType, billingCycleValue);
		guard += 1;
	}

	return next;
};

export const buildSubscriptionNotifications = (args: BuildSubscriptionNotificationsArgsT): PushNotificationT[] => {
	const {
		title,
		firstPaymentDate,
		billingCycleType,
		billingCycleValue,
		notifyEnabled,
		notifyDaysBefore,
		notifyTrialEnd,
		trialEndDate,
		now = new Date()
	} = args;

	const result: PushNotificationT[] = [];

	if (notifyEnabled) {
		const firstPaymentNoon = atNoon(parseISO(firstPaymentDate));
		const nextPayment = advanceUntilFuture(firstPaymentNoon, billingCycleType, billingCycleValue, now);
		const fireAt = subDays(nextPayment, notifyDaysBefore);

		const body =
			notifyDaysBefore === 0
				? i18next.t('notifications.subscription.today')
				: i18next.t('notifications.subscription.in_days', { count: notifyDaysBefore });

		if (fireAt.getTime() > now.getTime()) {
			result.push({ kind: 'date', title, body, date: fireAt });
		}
	}

	if (notifyTrialEnd && trialEndDate) {
		const date = atNoon(parseISO(trialEndDate));
		if (date.getTime() > (now ?? new Date()).getTime()) {
			result.push({ kind: 'trial_end', title, body: i18next.t('notifications.trial.today'), date });
		}
	}

	return result;
};
