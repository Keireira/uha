import React from 'react';
import { useTranslation } from 'react-i18next';

import { Text } from '@ui';
import Root, { Title, Subtitle } from './header.styles';

import type { Props } from './header.d';

const Header = ({ title, total }: Props) => {
	const { t } = useTranslation();

	return (
		<Root>
			{/* @TODO: Show calendar view (month + year) on tap */}
			<Title>{title}</Title>

			<Subtitle>
				{t('calendar.total')}:&nbsp;
				<Text $bold>
					{/* @TODO: Use recalc currency */}${total.toFixed(2)}
				</Text>
			</Subtitle>
		</Root>
	);
};

export default React.memo(Header);
