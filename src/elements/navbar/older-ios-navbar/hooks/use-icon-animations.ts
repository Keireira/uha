import { useEffect } from 'react';
import {
	withSpring,
	interpolate,
	useSharedValue,
	useDerivedValue,
	useAnimatedStyle,
	useReducedMotion
} from 'react-native-reanimated';

const ANIMATION_CONFIG = {
	mass: 0.35,
	damping: 30,
	stiffness: 210
};

const useIconAnimations = (isFocused?: boolean) => {
	const progress = useSharedValue(isFocused ? 1 : 0);
	const reducedMotion = useReducedMotion();

	const scale = useDerivedValue(() => interpolate(progress.value, [0, 1], [1, 1.1]));

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }]
	}));

	useEffect(() => {
		const target = isFocused ? 1 : 0;

		progress.value = reducedMotion ? target : withSpring(target, ANIMATION_CONFIG);
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [isFocused, reducedMotion]);

	return [animatedStyle];
};

export default useIconAnimations;
