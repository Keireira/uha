import React from 'react';
import { useTranslation } from 'react-i18next';

import { Text } from '@ui';
import Root, { Subtitle } from './header.styles';

import type { Props } from './header.d';

const Header = ({ total }: Props) => {
	const { t } = useTranslation();

	return (
		<Root>
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
