import React from 'react';

import { H2 } from '@ui';
import Root from './header-row.styles';

import type { Props } from './header-row.d';

const HeaderRow = ({ title }: Props) => (
	<Root>
		<H2>{title}</H2>
	</Root>
);

export default HeaderRow;
