import React from 'react';

import { ArrowRightIcon } from '@ui/icons';
import Root, { Title } from './header-link.styles';

import type { Props } from './header-link.d';

const HeaderLink = ({ title, ...props }: Props) => {
	return (
		<Root hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} {...props}>
			<Title>{title}</Title>

			<ArrowRightIcon width={18} height={18} color="#333" />
		</Root>
	);
};

export default HeaderLink;
