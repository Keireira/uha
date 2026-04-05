import type { SearchResultT } from '@api/soup/soup.d';

export type Props = {
	isLast: boolean;
	onPress: (result: SearchResultT) => void;
} & SearchResultT;
