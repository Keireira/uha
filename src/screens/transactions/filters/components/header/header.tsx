import React, { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { useLensesStore } from '@screens/transactions/models';

import Tab from './tab';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TextButton, CircleButton, InlineTitleIOS } from '@ui';
import Root, { HeaderRow, Title, TabsBarRow, Masked } from './header.styles';

import type { Props, FilterTabT } from './header.d';

export const TABS: FilterTabT[] = ['category', 'service', 'tender', 'currency'];

const useCounters = (): Record<FilterTabT | 'total', number> => {
	const filters = useLensesStore((s) => s.filters);

	const counters = useMemo(() => {
		const sizes = {
			category: 0,
			service: 0,
			tender: 0,
			currency: 0
		};

		for (const filter of filters) {
			sizes[filter.type] += 1;
		}

		return sizes;
	}, [filters]);

	return {
		...counters,
		total: filters.length
	};
};

const Header = ({ activeTab, setActiveTab }: Props) => {
	const theme = useTheme();
	const router = useRouter();
	const { t } = useTranslation();

	const counters = useCounters();
	const clearFilters = useLensesStore((s) => s.clearFilters);

	const clear = () => {
		clearFilters();
	};

	const confirm = () => {
		router.back();
	};

	return (
		<Root intensity={25} tint={theme.tint}>
			<HeaderRow>
				<View>
					{counters.total > 0 && (
						<TextButton onPress={clear} role="destructive" title={t('transactions.filters.clear')} />
					)}
				</View>

				<Title>
					<InlineTitleIOS>{t('transactions.filters.title')}</InlineTitleIOS>
				</Title>

				<CircleButton
					size={42}
					onPress={confirm}
					systemImage="checkmark"
					glassTint={theme.accents.orange}
					symbolColor={theme.static.white}
				/>
			</HeaderRow>

			<Masked
				maskElement={
					<LinearGradient
						colors={['transparent', 'black', 'black', 'transparent']}
						locations={[0, 0.03, 0.97, 1]}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
						style={{ flex: 1 }}
					/>
				}
			>
				<TabsBarRow>
					{TABS.map((tab) => (
						<Tab
							key={tab}
							tab={tab}
							counter={counters[tab]}
							setActiveTab={setActiveTab}
							isActive={activeTab === tab}
							label={t(`transactions.filters.tabs.${tab}`)}
						/>
					))}
				</TabsBarRow>
			</Masked>
		</Root>
	);
};

export default Header;
