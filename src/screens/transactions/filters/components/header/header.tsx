import React, { useMemo } from 'react';
import { useUnit } from 'effector-react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { useAppModel } from '@models';
import { useSearchParams } from '@hooks';

import Tab from './tab';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TextButton, CircleButton, InlineTitleIOS, SmallText } from '@ui';
import Root, { HeaderRow, Title, Counter, TabsBarRow, Masked } from './header.styles';

import type { Props, FilterTabT } from './header.d';

const TABS: FilterTabT[] = ['category', 'service', 'tender', 'currency'];

const useCounters = (): Record<FilterTabT | 'total', number> => {
	const { lenses } = useAppModel();
	const lensesStore = useUnit(lenses.$store);

	const counters = useMemo(() => {
		const sizes = {
			category: 0,
			service: 0,
			tender: 0,
			currency: 0
		};

		for (const filter of lensesStore.filters) {
			sizes[filter.type] += 1;
		}

		return sizes;
	}, [lensesStore.filters]);

	return {
		...counters,
		total: lensesStore.filters.length
	};
};

const Header = ({ activeTab, setActiveTab }: Props) => {
	const theme = useTheme();
	const router = useRouter();
	const { t } = useTranslation();

	const counters = useCounters();
	const { txViewMode } = useSearchParams();
	const { view_mode, lenses } = useAppModel();

	const clear = () => {
		lenses.filters.clear();
	};

	const confirm = () => {
		if (txViewMode === 'list') {
			view_mode.list.scrollToTop();
		}

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

					{counters.total > 0 && (
						<Counter tintColor={theme.accent.orange}>
							<SmallText $bold $color={theme.text.inverse}>
								{counters.total}
							</SmallText>
						</Counter>
					)}
				</Title>

				<CircleButton
					size={42}
					onPress={confirm}
					systemImage="checkmark"
					glassTint={theme.accent.orange}
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
