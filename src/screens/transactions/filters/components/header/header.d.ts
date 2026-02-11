import type { FilterTabT } from '../../filters.d';

export type Props = {
	activeTab: FilterTabT;
	setActiveTab: (tab: FilterTabT) => void;
};

export type { FilterTabT };
