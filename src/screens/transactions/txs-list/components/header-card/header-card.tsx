import React from 'react';

import Root, { DateText, TotalText } from './header-card.styles';

import type { HeaderSectionT } from '../../txs-list.d';

const HeaderCard = ({ date, total }: HeaderSectionT) => (
	<Root>
		<DateText>{date}</DateText>

		{total ? <TotalText>{total}</TotalText> : null}
	</Root>
);

export default React.memo(HeaderCard);
