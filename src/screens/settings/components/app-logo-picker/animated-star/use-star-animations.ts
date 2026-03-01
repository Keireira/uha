import { useEffect } from 'react';
import {
	withDelay,
	withRepeat,
	withTiming,
	withSequence,
	useSharedValue,
	useAnimatedStyle
} from 'react-native-reanimated';

const ANIM_TIMINGS = {
	activate: {
		scale: 200,
		opacity: 100,
		rotate: 200,
		glowFade: 300,
		glowDelay: 80
	},
	deactivate: {
		scale: 150,
		opacity: 80,
		rotate: 150,
		glowFade: 300
	},
	breathe: {
		duration: 1800
	}
};

const useStarAnimations = (isActive: boolean) => {
	const glowScale = useSharedValue(1);
	const glowOpacity = useSharedValue(0.45);
	const pulseScale = useSharedValue(0);
	const pulseOpacity = useSharedValue(0);
	const pulseRotateY = useSharedValue(90);

	useEffect(() => {
		glowScale.value = withRepeat(
			withSequence(
				withTiming(1.15, { duration: ANIM_TIMINGS.breathe.duration }),
				withTiming(0.9, { duration: ANIM_TIMINGS.breathe.duration })
			),
			-1,
			true
		);
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, []);

	useEffect(() => {
		if (isActive) {
			pulseRotateY.value = withTiming(0, { duration: ANIM_TIMINGS.activate.rotate });
			pulseScale.value = withTiming(1, { duration: ANIM_TIMINGS.activate.scale });
			pulseOpacity.value = withTiming(1, { duration: ANIM_TIMINGS.activate.opacity });
			glowOpacity.value = withDelay(
				ANIM_TIMINGS.activate.glowDelay,
				withTiming(1, { duration: ANIM_TIMINGS.activate.glowFade })
			);
		} else {
			pulseRotateY.value = withTiming(90, { duration: ANIM_TIMINGS.deactivate.rotate });
			pulseScale.value = withTiming(0, { duration: ANIM_TIMINGS.deactivate.scale });
			pulseOpacity.value = withTiming(0, { duration: ANIM_TIMINGS.deactivate.opacity });
			glowOpacity.value = withTiming(0.45, { duration: ANIM_TIMINGS.deactivate.glowFade });
		}
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [isActive]);

	const glow = useAnimatedStyle(() => ({
		opacity: glowOpacity.value,
		transform: [{ scale: glowScale.value }]
	}));

	const pulse = useAnimatedStyle(() => ({
		transform: [{ perspective: 600 }, { rotateY: `${pulseRotateY.value}deg` }, { scale: pulseScale.value }],
		opacity: pulseOpacity.value
	}));

	return {
		glow,
		pulse
	};
};

export default useStarAnimations;
