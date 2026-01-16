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

const COLLAPSED = 1;
const EXPANDED = 0;

const useSummaryAnimations = () => {
	const { scroll, view_mode } = useAppModel();
	const direction = useUnit(scroll.$direction);
	const viewMode = useUnit(view_mode.$mode);

	const progress = useSharedValue(viewMode === 'calendar' ? COLLAPSED : EXPANDED);
	/* https://docs.swmansion.com/react-native-reanimated/docs/device/useReducedMotion/ */
	const reducedMotion = useReducedMotion();

	const opacity = useDerivedValue(() => interpolate(progress.value, [0, COLLAPSED], [1, EXPANDED]));
	const maxHeight = useDerivedValue(() => interpolate(progress.value, [0, COLLAPSED], [16, EXPANDED]));
	const paddingBottom = useDerivedValue(() => interpolate(progress.value, [0, COLLAPSED], [28, EXPANDED]));

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
		/* In the calendar mode, always stay collapsed (1)
		 * In the list mode, collapse (1) on scroll down, expand (0) on scroll up
		 *
		 * yeah, yeah I know nested ternaries are ugly af
		 */
		/* prettier-ignore */
		const target = viewMode === 'calendar'
			? COLLAPSED
			: direction === 'down'
				? COLLAPSED
				: EXPANDED;

		progress.value = reducedMotion ? target : withSpring(target, ANIMATION_CONFIG);
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [direction, reducedMotion, viewMode]);

	return {
		summary: [animatedPaddingBottom],
		categoryChips: [animatedMaxHeight, animatedOpacity]
	};
};

export default useSummaryAnimations;
