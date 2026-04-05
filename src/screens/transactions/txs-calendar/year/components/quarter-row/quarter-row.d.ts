import type { QuarterRowDataT } from '../../year.d';

export type Props = {
	quarterMonths: QuarterRowDataT[];
	selectedDate: Date;
	weekStartsOn: 0 | 1;
	onPressMonth: (monthDate: Date) => void;
};
