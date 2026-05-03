import i18next from 'i18next';
import { until } from 'ramda';
import { parseISO, set, subDays } from 'date-fns';
import { isAfterToday, addByCycle } from '@lib/date';

import type { PushNotificationT } from '../notifications';
import type { BillingCycleT } from '@screens/crossroad/add-subscription/events';

type BuildNotificationsArgsT = {
	title: string;
	firstPaymentDate: string;
	billingCycleType: BillingCycleT;
	billingCycleValue: number;
	notifyEnabled: boolean;
	notifyDaysBefore: number;
	notifyTrialEnd: boolean;
	trialEndDate?: string;
};

const NOTIFY_HOUR = 12;

const setDateAtNoon = (date: Date | string) => {
	const parsed = typeof date === 'string' ? parseISO(date) : date;

	return set(parsed, {
		hours: NOTIFY_HOUR,
		milliseconds: 0,
		seconds: 0,
		minutes: 0
	});
};

type AdvanceT = { next: Date; guard: number };
const advanceUntilFuture = (from: Date, billingCycleType: BillingCycleT, billingCycleValue: number) => {
	const advance = ({ next, guard }: AdvanceT) => ({
		next: addByCycle(next, billingCycleType, billingCycleValue),
		guard: guard + 1
	});

	const isFutureOrGuardReached = ({ next, guard }: AdvanceT) => {
		return isAfterToday(next) || guard >= 1000;
	};

	return until(isFutureOrGuardReached, advance)({ next: from, guard: 0 }).next;
};

const buildSubscriptionNotifications = (args: BuildNotificationsArgsT) => {
	const {
		title,
		firstPaymentDate,
		billingCycleType,
		billingCycleValue,
		notifyEnabled,
		notifyDaysBefore,
		notifyTrialEnd,
		trialEndDate
	} = args;
	const result: PushNotificationT[] = [];

	if (notifyEnabled) {
		const firstPaymentTime = setDateAtNoon(firstPaymentDate);
		const nextPayment = advanceUntilFuture(firstPaymentTime, billingCycleType, billingCycleValue);
		const fireAt = subDays(nextPayment, notifyDaysBefore);

		const body =
			notifyDaysBefore === 0
				? i18next.t('notifications.subscription.today')
				: i18next.t('notifications.subscription.in_days', { count: notifyDaysBefore });

		if (isAfterToday(fireAt)) {
			result.push({
				kind: 'date',
				date: fireAt,
				title,
				body
			});
		}
	}

	console.log('notifyTrialEnd:', notifyTrialEnd, 'trialEndDate:', trialEndDate);

	if (notifyTrialEnd && trialEndDate) {
		const date = setDateAtNoon(trialEndDate);

		if (isAfterToday(date)) {
			result.push({
				kind: 'trial_end',
				body: i18next.t('notifications.trial.today'),
				title,
				date
			});
		}
	}

	return result;
};

export default buildSubscriptionNotifications;
