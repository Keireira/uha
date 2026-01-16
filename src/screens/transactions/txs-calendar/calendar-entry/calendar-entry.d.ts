export type CalendarEntryT = {
	item_key: string;
	raw: Date;
	content: string | undefined;
};

export type Props = {
	monthDate: Date;
};
