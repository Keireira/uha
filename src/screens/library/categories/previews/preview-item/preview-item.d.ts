import type { CategoryT } from '@models';

export type PropsT = Omit<CategoryT, 'title' | 'emoji' | 'color'> & {
	title: string;
	emoji: string;
	color: string;
	onPress?: (slug: string) => void;
};
