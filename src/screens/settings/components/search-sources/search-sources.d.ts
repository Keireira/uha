import type { SourceT } from '@api/soup/soup.d';
import type { AccentT } from '@themes/themes.d';

export type ProviderMeta = {
	key: SourceT;
	color_slug: AccentT;
	labelKey: string;
	storeConfig?: 'country' | 'country+lang';
};
