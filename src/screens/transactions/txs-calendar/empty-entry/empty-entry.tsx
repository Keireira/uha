import React from 'react';
import { useTranslation } from 'react-i18next';

import Root, { EmptyText } from './empty-entry.styles';

const EmptyEntry = () => {
	const { t } = useTranslation();

	return (
		<Root>
			<EmptyText>{t('calendar.empty')}</EmptyText>
		</Root>
	);
};

export default React.memo(EmptyEntry);
