type BaseT = {
	title: string;
	body?: string;
	date: Date;
};

export type DateNotificationT = BaseT & {
	kind: 'date';
};

export type TrialEndNotificationT = BaseT & {
	kind: 'trial_end';
};

export type PushNotificationT = DateNotificationT | TrialEndNotificationT;
