import { useEffect } from 'react';
import { useAppModel } from '@models';
import { useUnit } from 'effector-react';
import {
	withSpring,
	interpolate,
	useSharedValue,
	useDerivedValue,
	useAnimatedStyle,
	useReducedMotion
} from 'react-native-reanimated';

const ANIMATION_CONFIG = {
	mass: 0.25,
	damping: 15,
	stiffness: 500
};

const useSummaryAnimation = () => {
	const { scroll } = useAppModel();
	const direction = useUnit(scroll.$direction);

	const progress = useSharedValue(0);
	/* https://docs.swmansion.com/react-native-reanimated/docs/device/useReducedMotion/ */
	const reducedMotion = useReducedMotion();

	const opacity = useDerivedValue(() => interpolate(progress.value, [0, 1], [1, 0]));
	const maxHeight = useDerivedValue(() => interpolate(progress.value, [0, 1], [16, 0]));
	const paddingBottom = useDerivedValue(() => interpolate(progress.value, [0, 1], [28, 0]));

	const animatedOpacity = useAnimatedStyle(() => ({
		opacity: opacity.value
	}));
	const animatedMaxHeight = useAnimatedStyle(() => ({
		maxHeight: maxHeight.value
	}));
	const animatedPaddingBottom = useAnimatedStyle(() => ({
		paddingBottom: paddingBottom.value
	}));

	useEffect(() => {
		const target = direction === 'down' ? 1 : 0;

		progress.value = reducedMotion ? target : withSpring(target, ANIMATION_CONFIG);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [direction, reducedMotion]);

	return {
		summary: [animatedPaddingBottom],
		categoryChips: [animatedMaxHeight, animatedOpacity]
	};
};

export default useSummaryAnimation;
