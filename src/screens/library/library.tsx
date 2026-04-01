import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { useRouter } from 'expo-router';

import { SymbolView } from 'expo-symbols';
import { Wrapper, TextInput } from '@ui';
import { PaymentPreviews } from './payments';
import { ServicePreviews } from './services';
import { CategoryPreviews } from './categories';
import {
	HeaderRow,
	ScreenTitle,
	AddButton,
	TabBar,
	TabGlass,
	TabInner,
	TabLabel,
	FixedHeader,
	Content
} from './library.styles';

type TabT = 'categories' | 'services' | 'payments';

const TABS: { key: TabT; label: string }[] = [
	{ key: 'categories', label: 'Categories' },
	{ key: 'services', label: 'Services' },
	{ key: 'payments', label: 'Payments' }
];

const TAB_ROUTES = {
	categories: '/add-category',
	services: '/add-service',
	payments: '/add-payment'
} as const;

const LibraryScreen = () => {
	const { t } = useTranslation();
	const theme = useTheme();
	const router = useRouter();
	const [search, setSearch] = useState('');
	const [activeTab, setActiveTab] = useState<TabT>('categories');

	return (
		<Wrapper withBottom={false}>
			<FixedHeader>
				<HeaderRow>
					<ScreenTitle>Library</ScreenTitle>
					<AddButton onPress={() => router.push(TAB_ROUTES[activeTab])}>
						<SymbolView name="plus" size={16} tintColor={theme.text.primary} />
					</AddButton>
				</HeaderRow>

				<TextInput
					leadingIcon="search"
					autoCorrect={false}
					placeholder={t('library.search.all')}
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
								tintColor={isActive ? theme.accents.orange : undefined}
							>
								<TabInner onPress={() => setActiveTab(tab.key)}>
									<TabLabel $active={isActive}>{tab.label}</TabLabel>
								</TabInner>
							</TabGlass>
						);
					})}
				</TabBar>
			</FixedHeader>

			<Content>
				{activeTab === 'categories' && <CategoryPreviews search={search} />}
				{activeTab === 'services' && <ServicePreviews search={search} />}
				{activeTab === 'payments' && <PaymentPreviews search={search} />}
			</Content>
		</Wrapper>
	);
};

export default LibraryScreen;
