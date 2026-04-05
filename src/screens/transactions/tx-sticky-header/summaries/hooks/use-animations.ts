import { useEffect } from 'react';
import { useDirectionStore } from '@models';
import { useSearchParams } from '@hooks';
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
	const direction = useDirectionStore((s) => s.direction);
	const { txViewMode } = useSearchParams();

	const progress = useSharedValue(txViewMode === 'calendar' ? COLLAPSED : EXPANDED);
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
		/* prettier-ignore */
		const target = txViewMode === 'calendar'
			? COLLAPSED
			: direction === 'down'
				? COLLAPSED
				: EXPANDED;

		progress.value = reducedMotion ? target : withSpring(target, ANIMATION_CONFIG);
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [direction, reducedMotion, txViewMode]);

	return {
		summary: [animatedPaddingBottom],
		categoryChips: [animatedMaxHeight, animatedOpacity]
	};
};

export default useSummaryAnimations;
