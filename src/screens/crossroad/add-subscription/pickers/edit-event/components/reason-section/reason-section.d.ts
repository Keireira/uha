import React from 'react';
import type { EventTypeT } from '@screens/crossroad/add-subscription/events';

export type Props = {
	activeType?: EventTypeT;
	reason: string;
	setReason: React.Dispatch<React.SetStateAction<string>>;
};
