import type { ServiceT } from '@models';

export type PropsT = ServiceT & {
	onPress?: () => void;
};
