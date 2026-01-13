import React from 'react';
import { useTranslation } from 'react-i18next';

import { Text } from '@ui';
import Root, { Title } from './header.styles';

import type { Props } from './header.d';

const Header = ({ title, total }: Props) => {
	const { t } = useTranslation();

	return (
		<Root>
			{/* @TODO: Show calendar view (month + year) on tap */}
			<Title $color="#fafafa">{title}</Title>

			<Text $color="#8e8e93">
				{t('calendar.total')}:&nbsp;
				<Text $color="#fafafa" $bold>
					{/* @TODO: Use recalc currency */}${total.toFixed(2)}
				</Text>
			</Text>
		</Root>
	);
};

export default React.memo(Header);
