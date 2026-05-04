import type { SearchResultT } from '@api/soup/soup.d';

export type Props = {
	label: string;
	footer?: string;
	results: SearchResultT[];
	onPress: (r: SearchResultT) => void;
};
