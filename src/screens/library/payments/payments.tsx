import React, { useState } from 'react';
import { useScrollDirection } from '@hooks';
import { useTranslation } from 'react-i18next';

import PaymentsList from './list';
import { View } from 'react-native';
import Root from './payments.styles';
import { Wrapper, TextInput } from '@ui';

const PaymentsScreen = () => {
	const { t } = useTranslation();
	const [search, setSearch] = useState('');
	const handleScroll = useScrollDirection();

	return (
		<Wrapper as={Root} onScroll={handleScroll}>
			<View style={{ flex: 1 }}>
				<TextInput
					leadingIcon="search"
					autoCorrect={false}
					placeholder={t('library.search_payments')}
					value={search}
					onChangeText={setSearch}
					onClear={() => setSearch('')}
				/>
			</View>

			<PaymentsList search={search} />
		</Wrapper>
	);
};

export default PaymentsScreen;
