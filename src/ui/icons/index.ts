import { default as AddIcon } from './add.svg.tsx';
import { default as AnalyzeIcon } from './analyze.svg.tsx';
import { default as ArrowDownIcon } from './arrow-down.svg.tsx';
import { default as ArrowLeftIcon } from './arrow-left.svg.tsx';
import { default as ArrowRightIcon } from './arrow-right.svg.tsx';
import { default as CalendarIcon } from './calendar.svg.tsx';
import { default as CloseIcon } from './close.svg.tsx';
import { default as EditIcon } from './edit.svg.tsx';
import { default as HomeIcon } from './home.svg.tsx';
import { default as InfinityIcon } from './infinity.svg.tsx';
import { default as LibraryIcon } from './library.svg.tsx';
import { default as ListIcon } from './list.svg.tsx';
import { default as ProfileIcon } from './profile.svg.tsx';
import { default as RotateLeftIcon } from './rotate-left.svg.tsx';
import { default as RotateRightIcon } from './rotate-right.svg.tsx';
import { default as SearchIcon } from './search.svg.tsx';
import { default as SettingsIcon } from './settings.svg.tsx';
import { default as StopIcon } from './stop.svg.tsx';

export {
	AddIcon,
	AnalyzeIcon,
	ArrowDownIcon,
	ArrowLeftIcon,
	ArrowRightIcon,
	CalendarIcon,
	CloseIcon,
	EditIcon,
	HomeIcon,
	InfinityIcon,
	LibraryIcon,
	ListIcon,
	ProfileIcon,
	RotateLeftIcon,
	RotateRightIcon,
	SearchIcon,
	SettingsIcon,
	StopIcon
};

const allIcons = {
	add: AddIcon,
	analyze: AnalyzeIcon,
	'arrow-down': ArrowDownIcon,
	'arrow-left': ArrowLeftIcon,
	'arrow-right': ArrowRightIcon,
	calendar: CalendarIcon,
	close: CloseIcon,
	edit: EditIcon,
	home: HomeIcon,
	infinity: InfinityIcon,
	library: LibraryIcon,
	list: ListIcon,
	profile: ProfileIcon,
	'rotate-left': RotateLeftIcon,
	'rotate-right': RotateRightIcon,
	search: SearchIcon,
	settings: SettingsIcon,
	stop: StopIcon
};

export type IconNameT = keyof typeof allIcons;

export default new Map(Object.entries(allIcons));
