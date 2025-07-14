import { useRef, useEffect } from 'react';
import { useUnit } from 'effector-react';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useAppModel } from '@models';

export type ScrollDirection = 'up' | 'down' | 'idle';

type HandleScrollT = (event: NativeSyntheticEvent<NativeScrollEvent>) => void;

const useScrollDirection = (threshold = 25): HandleScrollT => {
	const { scroll } = useAppModel();
	const direction = useUnit(scroll.$direction);
	const lastScrollY = useRef(0);
	const lastDirection = useRef<ScrollDirection>('idle');

	useEffect(() => {
		lastDirection.current = direction;
	}, [direction]);

	const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const scrollY = event.nativeEvent.contentOffset.y;
		const contentSize = event.nativeEvent.contentSize.height;
		const screenHeight = event.nativeEvent.layoutMeasurement.height;
		const maxScrollY = contentSize - screenHeight;

		if (scrollY < 0 || scrollY > maxScrollY) {
			return;
		}

		const diff = scrollY - lastScrollY.current;

		if (Math.abs(diff) < threshold) {
			return;
		}

		const nextDirection: ScrollDirection = diff > 0 ? 'down' : 'up';

		if (nextDirection !== lastDirection.current) {
			scroll.setDirection(nextDirection);
		}

		lastScrollY.current = scrollY;
	};

	return handleScroll;
};

export default useScrollDirection;
