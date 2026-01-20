import React from 'react';
import { useTranslation } from 'react-i18next';

import { randomInt } from '@lib';

import Root, { EmptyText } from './empty-entry.styles';

const EmptyEntry = () => {
	const { t } = useTranslation();
	const nextMessageIndex = randomInt(1, 6);

	return (
		<Root>
			<EmptyText>{t(`calendar.empty_${nextMessageIndex}`)}</EmptyText>
		</Root>
	);
};

export default React.memo(EmptyEntry);
