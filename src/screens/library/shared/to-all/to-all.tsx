import React from 'react';
import { useRouter } from 'expo-router';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { ArrowRightIcon } from '@ui/icons';

import type { Props } from './to-all.d';

import Root, { AnimateMe } from './to-all.styles';

const ANIM_CONFIG = {
	mass: 0.35,
	damping: 30,
	stiffness: 210
};

const ToAll = ({ to }: Props) => {
	const router = useRouter();
	const iconScale = useSharedValue(1);
	const iconScaledStyle = useAnimatedStyle(() => ({
		transform: [{ scale: iconScale.value }]
	}));

	const navigateTo = () => {
		router.push(to);
	};

	const animateIn = () => {
		iconScale.value = withSpring(0.9, ANIM_CONFIG, () => {
			iconScale.value = withSpring(1, ANIM_CONFIG);
		});
	};

	return (
		<AnimateMe style={iconScaledStyle}>
			<Root onPress={navigateTo} onPressIn={animateIn}>
				<ArrowRightIcon width={28} height={28} />
			</Root>
		</AnimateMe>
	);
};

export default ToAll;
