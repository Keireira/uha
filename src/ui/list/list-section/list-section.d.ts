import type { Props as ListItemProps } from '../list-item';

export type Props = {
	id: string;
	title: string;
	bottomText?: string;
	innerArray: ListItemProps[];
};
