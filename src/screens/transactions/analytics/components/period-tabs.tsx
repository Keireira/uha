import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { useTheme } from 'styled-components/native';

import { TabBarRow, TabGlass, TabInner, TabLabel } from '../analytics-sheet.styles';

type Props = {
	tabs: readonly string[];
	activeTab: string;
	onChange: (tab: string) => void;
};

const PeriodTabs = ({ tabs, activeTab, onChange }: Props) => {
	const { t } = useTranslation();
	const theme = useTheme();

	return (
		<TabBarRow>
			{tabs.map((tab) => {
				const isActive = activeTab === tab;
				const handlePress = () => {
					if (isActive) return;

					Haptics.selectionAsync();
					onChange(tab);
				};

				return (
					<TabGlass key={tab} $active={isActive} isInteractive tintColor={isActive ? theme.accents.orange : undefined}>
						<TabInner onPress={handlePress}>
							<TabLabel $active={isActive}>{t(`dates.${tab}`)}</TabLabel>
						</TabInner>
					</TabGlass>
				);
			})}
		</TabBarRow>
	);
};

export default PeriodTabs;
