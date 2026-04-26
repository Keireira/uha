import React from 'react';
import type { EventTypeT } from '@screens/crossroad/add-subscription/events';

export type Props = {
	activeType?: EventTypeT;
	cancellationReason: string;
	setCancellationReason: React.Dispatch<React.SetStateAction<string>>;
};
