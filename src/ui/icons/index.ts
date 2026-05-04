import { default as ArrowLeftIcon } from './arrow-left.svg.tsx';
import { default as CalendarIcon } from './calendar.svg.tsx';
import { default as FilterIcon } from './filter.svg.tsx';
import { default as ListIcon } from './list.svg.tsx';

export { ArrowLeftIcon, CalendarIcon, FilterIcon, ListIcon };

const allIcons = {
	'arrow-left': ArrowLeftIcon,
	calendar: CalendarIcon,
	filter: FilterIcon,
	list: ListIcon
};

export type IconNameT = keyof typeof allIcons;

export default new Map(Object.entries(allIcons));
