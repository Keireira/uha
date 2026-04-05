import type { SearchResultT } from '@api/soup/soup.d';

export type Props = {
	onPress: (r: SearchResultT) => void;
} & SearchResultT;
