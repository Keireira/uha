import React from 'react';

import Root, { Title } from './no-items.styles';

import type { Props } from './no-items.d';

const NoItems = ({ title }: Props) => (
	<Root>
		<Title>{title}</Title>
	</Root>
);

export default NoItems;
