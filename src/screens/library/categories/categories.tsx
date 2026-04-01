import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import CategoriesList from './list';
import { View } from 'react-native';
import Root from './categories.styles';
import { Wrapper, TextInput } from '@ui';

const CategoriesScreen = () => {
	const { t } = useTranslation();
	const [search, setSearch] = useState('');

	return (
		<Wrapper as={Root}>
			<View style={{ flex: 1 }}>
				<TextInput
					leadingIcon="search"
					autoCorrect={false}
					placeholder={t('library.search_categories')}
					value={search}
					onChangeText={setSearch}
					onClear={() => setSearch('')}
				/>
			</View>

			<CategoriesList search={search} />
		</Wrapper>
	);
};

export default CategoriesScreen;
