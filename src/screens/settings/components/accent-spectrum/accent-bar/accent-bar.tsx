import React, { useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { setSettingsValue } from '@hooks';
import { useTheme } from 'styled-components/native';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { Pressable } from 'react-native';
import Root from './accent-bar.styles';

import type { AccentT } from '@themes';
import type { Props } from './accent-bar.d';

const useAccentAnimation = (isActive: Props['isActive']) => {
	const flex = useSharedValue(isActive ? 4 : 1.4);

	useEffect(() => {
		flex.value = withTiming(isActive ? 4 : 1.4, { duration: 180 });
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [isActive]);

	const animStyle = useAnimatedStyle(() => ({
		flex: flex.value
	}));

	return {
		accent: [animStyle]
	};
};

const AccentBar = ({ accent, isActive }: Props) => {
	const theme = useTheme();
	const animations = useAccentAnimation(isActive);

	const selectAccent = () => {
		setSettingsValue<AccentT>('accent', accent);

		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	};

	return (
		<Root $color={theme.accents[accent]} $active={isActive} style={animations.accent}>
			<Pressable onPress={selectAccent} style={{ flex: 1 }} />
		</Root>
	);
};

export default AccentBar;
