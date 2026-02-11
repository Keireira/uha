import React from 'react';
import * as Haptics from 'expo-haptics';
import { useTheme } from 'styled-components/native';

import { Host, Button } from '@expo/ui/swift-ui';
import { glassEffect } from '@expo/ui/swift-ui/modifiers';
import { TabLabel } from './tab.styles';

import type { Props } from './tab.d';

const Tab = ({ tab, label, isActive, counter, setActiveTab }: Props) => {
	const theme = useTheme();

	const modifiers = isActive
		? [
				glassEffect({
					shape: 'capsule',
					glass: {
						interactive: true,
						variant: 'regular',
						tint: theme.accent.orange
					}
				})
			]
		: [];

	const selectTab = () => {
		setActiveTab(tab);
		Haptics.selectionAsync();
	};

	return (
		<Host key={tab}>
			<Button onPress={selectTab} modifiers={modifiers}>
				<TabLabel
					$bold
					numberOfLines={1}
					adjustsFontSizeToFit
					minimumFontScale={0.5}
					$color={isActive ? theme.static.white : theme.accent.orange}
				>
					{label}
					{counter > 0 ? ` (${counter})` : ''}
				</TabLabel>
			</Button>
		</Host>
	);
};

export default React.memo(Tab);
