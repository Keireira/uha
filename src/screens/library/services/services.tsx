import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import ServicesList from './list';
import { Wrapper, TextInput } from '@ui';
import Root from './services.styles';

const ServicesScreen = () => {
	const { t } = useTranslation();
	const [search, setSearch] = useState('');

	return (
		<Wrapper>
			<Root>
				<TextInput
					leadingIcon="search"
					autoCorrect={false}
					placeholder={t('library.search.services')}
					value={search}
					onChangeText={setSearch}
					onClear={() => setSearch('')}
				/>
			</Root>

			<ServicesList search={search} />
		</Wrapper>
	);
};

export default ServicesScreen;
