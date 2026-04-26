import React from 'react';
import { useDraftStore } from '../../../../hooks';

import Root, { Title, Hint } from './header.styles';

const TimelineHeader = () => {
	const timeline = useDraftStore((state) => state.timeline);

	return (
		<Root>
			<Title>Timeline</Title>

			{timeline.length > 1 && <Hint>Swipe to delete</Hint>}
		</Root>
	);
};

export default TimelineHeader;
