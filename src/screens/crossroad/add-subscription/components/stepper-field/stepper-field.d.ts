import type { BillingCycleT } from '@screens/crossroad/add-subscription/hooks/use-draft-store';

export type Props = {
	type: BillingCycleT;
	value: number;
	setValue: (type: BillingCycleT, value: number) => void;
};
