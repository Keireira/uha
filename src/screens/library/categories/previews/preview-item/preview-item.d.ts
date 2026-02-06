import type { CategoryT } from '@models';

export type PropsT = CategoryT & {
	onPress?: () => void;
};
