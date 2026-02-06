import React, { useState } from 'react';
import { useScrollDirection } from '@hooks';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { Wrapper, TextInput } from '@ui';
import { PaymentPreviews } from './payments';
import { ServicePreviews } from './services';
import { CategoryPreviews } from './categories';
import Root, { ScreenTitle, TabBar, TabGlass, TabInner, TabLabel } from './library.styles';

type TabT = 'categories' | 'services' | 'payments';

const TABS: { key: TabT; label: string }[] = [
	{ key: 'categories', label: 'Categories' },
	{ key: 'services', label: 'Services' },
	{ key: 'payments', label: 'Payments' }
];

const LibraryScreen = () => {
	const { t } = useTranslation();
	const theme = useTheme();
	const [search, setSearch] = useState('');
	const [activeTab, setActiveTab] = useState<TabT>('categories');
	const handleScroll = useScrollDirection();

	return (
		<Wrapper as={Root} onScroll={handleScroll}>
			<ScreenTitle>Library</ScreenTitle>

			<TextInput
				leadingIcon="search"
				autoCorrect={false}
				placeholder={t('library.search')}
				value={search}
				onChangeText={setSearch}
				onClear={() => setSearch('')}
			/>

			<TabBar>
				{TABS.map((tab) => {
					const isActive = activeTab === tab.key;

					return (
						<TabGlass
							key={tab.key}
							$active={isActive}
							isInteractive
							tintColor={isActive ? theme.accent.primary : undefined}
						>
							<TabInner onPress={() => setActiveTab(tab.key)}>
								<TabLabel $active={isActive}>{tab.label}</TabLabel>
							</TabInner>
						</TabGlass>
					);
				})}
			</TabBar>

			{activeTab === 'categories' && <CategoryPreviews search={search} />}
			{activeTab === 'services' && <ServicePreviews search={search} />}
			{activeTab === 'payments' && <PaymentPreviews search={search} />}
		</Wrapper>
	);
};

export default LibraryScreen;
