import React, { useState } from 'react';
import { useScrollDirection } from '@hooks';
import { useTranslation } from 'react-i18next';

import ServicesList from './list';
import { View } from 'react-native';
import Root from './services.styles';
import { Wrapper, TextInput } from '@ui';

const ServicesScreen = () => {
	const { t } = useTranslation();
	const [search, setSearch] = useState('');
	const handleScroll = useScrollDirection();

	return (
		<Wrapper as={Root} onScroll={handleScroll}>
			<View style={{ flex: 1 }}>
				<TextInput
					leadingIcon="search"
					autoCorrect={false}
					placeholder={t('library.search_services')}
					value={search}
					onChangeText={setSearch}
					onClear={() => setSearch('')}
				/>
			</View>

			<ServicesList search={search} />
		</Wrapper>
	);
};

export default ServicesScreen;
