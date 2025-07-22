import React, { useState } from 'react';
import { useScrollDirection } from '@hooks';
import { useTranslation } from 'react-i18next';

import { View } from 'react-native';
import { Wrapper, TextInput } from '@ui';
import { PaymentPreviews } from './payments';
import { ServicePreviews } from './services';
import { CategoryPreviews } from './categories';
import Root, { NoItems } from './library.styles';

// @TODO: use "@legendapp/list"
const LibraryScreen = () => {
	const { t } = useTranslation();
	const [search, setSearch] = useState('');
	const handleScroll = useScrollDirection();
	const [paymentsFound, setPaymentsFound] = useState(0);
	const [servicesFound, setServicesFound] = useState(0);
	const [categoriesFound, setCategoriesFound] = useState(0);

	return (
		<Wrapper as={Root} onScroll={handleScroll}>
			<View style={{ flex: 1 }}>
				<TextInput
					leadingIcon="search"
					autoCorrect={false}
					placeholder={t('library.search')}
					value={search}
					onChangeText={setSearch}
					onClear={() => setSearch('')}
				/>
			</View>

			{!categoriesFound && !servicesFound && !paymentsFound && search.length > 0 && (
				<View>
					<NoItems>No items found</NoItems>
				</View>
			)}

			<CategoryPreviews search={search} setFound={setCategoriesFound} />
			<ServicePreviews search={search} setFound={setServicesFound} />
			<PaymentPreviews search={search} setFound={setPaymentsFound} />
		</Wrapper>
	);
};

export default LibraryScreen;
