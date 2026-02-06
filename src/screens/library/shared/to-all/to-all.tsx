import React from 'react';
import { useRouter } from 'expo-router';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import type { Props } from './to-all.d';

import Root, { AnimateMe, Label } from './to-all.styles';

const ANIM_CONFIG = {
	mass: 0.35,
	damping: 30,
	stiffness: 210
};

const ToAll = ({ to }: Props) => {
	const router = useRouter();
	const scale = useSharedValue(1);
	const animStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }]
	}));

	const navigateTo = () => {
		router.push(to);
	};

	const animateIn = () => {
		scale.value = withSpring(0.92, ANIM_CONFIG, () => {
			scale.value = withSpring(1, ANIM_CONFIG);
		});
	};

	return (
		<AnimateMe style={animStyle}>
			<Root onPress={navigateTo} onPressIn={animateIn}>
				<Label>All</Label>
			</Root>
		</AnimateMe>
	);
};

export default ToAll;
