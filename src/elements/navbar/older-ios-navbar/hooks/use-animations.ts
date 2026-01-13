import { useEffect } from 'react';
import { useUnit } from 'effector-react';
import { useTheme } from 'styled-components/native';
import {
	withSpring,
	interpolate,
	useSharedValue,
	useDerivedValue,
	useAnimatedStyle,
	useReducedMotion
} from 'react-native-reanimated';

import { useAppModel } from '@models';

const ANIMATION_CONFIG = {
	mass: 0.35,
	damping: 30,
	stiffness: 210
};

const useAnimations = () => {
	const theme = useTheme();
	const { scroll } = useAppModel();
	const direction = useUnit(scroll.$direction);

	const progress = useSharedValue(0);
	/* https://docs.swmansion.com/react-native-reanimated/docs/device/useReducedMotion/ */
	const reducedMotion = useReducedMotion();

	const bottom = useDerivedValue(() => interpolate(progress.value, [0, 1], [18, -48]));
	const shadow = useDerivedValue(() => interpolate(progress.value, [0, 1], [120, 48]));

	const animatedStyle = useAnimatedStyle(() => ({
		bottom: bottom.value
	}));

	const shadowAnimatedStyle = useAnimatedStyle(() => ({
		height: shadow.value
	}));

	useEffect(() => {
		const target = direction === 'down' ? 1 : 0;

		progress.value = reducedMotion ? target : withSpring(target, ANIMATION_CONFIG);
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [direction, reducedMotion]);

	return {
		gradientStyles: [shadowAnimatedStyle],
		blurStyles: [
			animatedStyle,
			{
				boxShadow: `0 0 6px 1px ${theme.shadow.default}20`,
				elevation: 2
			}
		]
	};
};

export default useAnimations;
