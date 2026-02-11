import React, { useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import { useUnit } from 'effector-react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { useAppModel } from '@models';
import { useSearchParams } from '@hooks';

import Root, {
	HeaderRow,
	Title,
	CountGlass,
	CountText,
	TabsBarRow,
	TabGlass,
	TabInner,
	TabLabel
} from './header.styles';
import { View } from 'react-native';
import { TextButton, CircleButton, InlineTitleIOS } from '@ui';

import type { Props, FilterTabT } from './header.d';

const TABS: FilterTabT[] = ['category', 'service', 'tender', 'currency'];

const Header = ({ activeTab, setActiveTab }: Props) => {
	const theme = useTheme();
	const router = useRouter();
	const { t } = useTranslation();

	const { txViewMode } = useSearchParams();
	const { view_mode, lenses } = useAppModel();
	const lensesStore = useUnit(lenses.$store);
	const totalActiveCount = lensesStore.filters.length;

	const tabLabels: Record<FilterTabT, string> = useMemo(
		() => ({
			category: t('transactions.filters.tabs.category'),
			service: t('transactions.filters.tabs.service'),
			tender: t('transactions.filters.tabs.tender'),
			currency: t('transactions.filters.tabs.currency')
		}),
		[t]
	);

	const clearSheet = () => {
		lenses.filters.clear();
	};

	const confirmSheet = () => {
		router.back();

		if (txViewMode === 'list') {
			view_mode.list.scrollToTop();
		}
	};

	const handleTabPress = (tab: FilterTabT) => {
		setActiveTab(tab);
		Haptics.selectionAsync();
	};

	return (
		<Root intensity={25} tint={theme.tint}>
			<HeaderRow>
				<View>
					{totalActiveCount > 0 && (
						<TextButton onPress={clearSheet} role="destructive" title={t('transactions.filters.clear')} />
					)}
				</View>

				<Title>
					<InlineTitleIOS>{t('transactions.filters.title')}</InlineTitleIOS>

					{totalActiveCount > 0 && (
						<CountGlass tintColor={theme.accent.orange}>
							<CountText>{totalActiveCount}</CountText>
						</CountGlass>
					)}
				</Title>

				<CircleButton
					size={42}
					onPress={confirmSheet}
					systemImage="checkmark"
					glassTint={theme.accent.orange}
					symbolColor={theme.static.white}
				/>
			</HeaderRow>

			<TabsBarRow>
				{TABS.map((tab) => {
					const isActive = activeTab === tab;

					return (
						<TabGlass key={tab} $active={isActive} isInteractive tintColor={isActive ? theme.accent.orange : undefined}>
							<TabInner onPress={() => handleTabPress(tab)}>
								<TabLabel $active={isActive}>{tabLabels[tab]}</TabLabel>
							</TabInner>
						</TabGlass>
					);
				})}
			</TabsBarRow>
		</Root>
	);
};

export default Header;
