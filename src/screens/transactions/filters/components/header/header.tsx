import React, { useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import { useUnit } from 'effector-react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { useAppModel } from '@models';

import { CircleButton, InlineTitleIOS } from '@ui';
import Root, {
	HeaderRow,
	Title,
	CountGlass,
	CountText,
	TabsBarRow,
	TabGlass,
	TabInner,
	TabLabel,
	ButtonStub
} from './header.styles';

import type { Props, FilterTabT } from './header.d';

const TABS: FilterTabT[] = ['category', 'service', 'tender', 'currency'];

const Header = ({ activeTab, setActiveTab }: Props) => {
	const theme = useTheme();
	const router = useRouter();
	const { t } = useTranslation();

	const { lenses } = useAppModel();
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
		router.back();
	};

	const confirmSheet = () => {
		router.back();
	};

	const handleTabPress = (tab: FilterTabT) => {
		setActiveTab(tab);
		Haptics.selectionAsync();
	};

	return (
		<Root intensity={25} tint={theme.tint}>
			<HeaderRow>
				{/**
					* WHY:
					* - There is a bug where the Button jumps when it appears

					* THE REASON:
					* 	CircleButton's matchContents doesn't produce exactly a 42x42 RN layout box.
					* 	Even though the SwiftUI frame modifier is set to 42x42, the controlSize="large" button has a larger intrinsic content size and matchContents sizes the Host view to that intrinsic size rather than the constrained frame.
					* 	So the right-side CircleButton ends up wider than the 42x42 ButtonStub it replaces.

					* THE SIMPLEST FIX:
					* - Wrap the conditional right slot in a fixed-size container so the layout is stable regardless of what's inside
					**/}
				<ButtonStub>
					{totalActiveCount > 0 && (
						<CircleButton size={42} onPress={clearSheet} systemImage="xmark" role="destructive" />
					)}
				</ButtonStub>

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
