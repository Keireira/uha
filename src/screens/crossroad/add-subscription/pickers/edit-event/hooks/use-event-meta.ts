import { useTheme } from 'styled-components/native';
import { EVENT_META } from '@screens/crossroad/add-subscription/events';

import type { EventTypeT } from '@screens/crossroad/add-subscription/events';

const useEventMeta = (activeType?: EventTypeT) => {
	const theme = useTheme();

	if (!activeType) return;

	const meta = EVENT_META[activeType];
	const tintColor = theme.accents[meta.accent];

	return {
		...meta,
		tintColor
	};
};

export default useEventMeta;
