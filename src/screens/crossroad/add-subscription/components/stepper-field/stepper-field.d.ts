import type { BillingCycleT } from '@screens/crossroad/add-subscription/events';

export type Props = {
	type: BillingCycleT;
	value: number;
	setValue: (type: BillingCycleT, value: number) => void;
};
