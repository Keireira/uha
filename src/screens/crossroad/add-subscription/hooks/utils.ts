import { useTranslation } from 'react-i18next';
import { parseISO, set, subDays } from 'date-fns';

import type { PushNotificationT } from '@lib/notifications';

type BuildArgsT = {
	title: string;
	firstPaymentDate: string;
	notifyEnabled: boolean;
	notifyDaysBefore: number;
	notifyTrialEnd: boolean;
	trialEndDate?: string;
};

const NOTIFY_HOUR = 12;

const atNoon = (isoDate: string) => {
	return set(parseISO(isoDate), {
		hours: NOTIFY_HOUR,
		minutes: 0,
		seconds: 0,
		milliseconds: 0
	});
};

export const useSubscriptionNotifications = () => {
	const { t } = useTranslation();

	const handler = (args: BuildArgsT): PushNotificationT[] => {
		const { title, firstPaymentDate, notifyEnabled, notifyDaysBefore, notifyTrialEnd, trialEndDate } = args;

		if (!notifyEnabled) return [];

		const result: PushNotificationT[] = [];
		const seen = new Set<number>();

		const pushNotification = (date: Date, body: string) => {
			const timestamp = date.getTime();

			if (seen.has(timestamp)) return;

			seen.add(timestamp);
			result.push({ title, body, date });
		};

		const paymentDate = atNoon(firstPaymentDate);

		notifyDaysBefore.forEach((daysBefore) => {
			const date = subDays(paymentDate, daysBefore);

			const body =
				daysBefore === 0
					? t('notifications.subscription.today')
					: t('notifications.subscription.in_days', {
							count: daysBefore
						});

			pushNotification(date, body);
		});

		if (notifyTrialEnd && trialEndDate) {
			pushNotification(atNoon(trialEndDate), t('notifications.trial.today'));
		}

		return result;
	};

	return handler;
};
