import type { ActiveEntryT } from '../../tx-header.d';
import type { FilterTypeT } from '@screens/transactions/models/types.d';

export type Props = {
	entries: ActiveEntryT[];
	triggerLabel: string;
	filterType: FilterTypeT;
};
