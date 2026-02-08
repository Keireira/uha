import React from 'react';

import Root, { AccentBlock } from './accent-rail.styles';

import type { Props } from './accent-rail.d';

const AccentRail = ({ segments }: Props) => (
	<Root>
		{segments.map((segment) => (
			<AccentBlock key={segment.color} $color={segment.color} $flex={segment.flex} />
		))}
	</Root>
);

export default AccentRail;
