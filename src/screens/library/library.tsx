import React, { useState } from 'react';
import { useScrollDirection } from '@hooks';
import { useTranslation } from 'react-i18next';

import { ScrollView } from 'react-native';
import { Wrapper, TextInput } from '@ui';
import HeaderLink from './header-link';
import { CategoryPreviews } from './categories';
import { PaymentPreviews } from './payments';
import { ServicePreviews } from './services';

const LibraryScreen = () => {
	const { t } = useTranslation();
	const [search, setSearch] = useState('');
	const handleScroll = useScrollDirection();

	return (
		<Wrapper as={ScrollView} onScroll={handleScroll}>
			<TextInput leadingIcon="search" placeholder={t('library.search')} value={search} onChangeText={setSearch} />

			<HeaderLink title="Categories" />
			<CategoryPreviews />

			<HeaderLink title="Services" />
			<ServicePreviews />

			<HeaderLink title="Payment" />
			<PaymentPreviews />
		</Wrapper>
	);
};

export default LibraryScreen;
