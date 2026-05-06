import { useCallback, useRef, useState } from 'react';
import { usePreventRemove } from '@react-navigation/native';
import { useNavigation, useRouter } from 'expo-router';

import type { NavigationAction } from '@react-navigation/routers';

type Params = {
	enabled?: boolean;
	onDiscard?: () => void;
};

const useDiscardChangesConfirmation = ({ enabled = true, onDiscard }: Params = {}) => {
	const router = useRouter();
	const navigation = useNavigation();
	const [isPresented, setIsPresented] = useState(false);
	const [isRemoveAllowed, setIsRemoveAllowed] = useState(false);
	const pendingActionRef = useRef<NavigationAction | null>(null);

	usePreventRemove(enabled && !isRemoveAllowed, ({ data }) => {
		pendingActionRef.current = data.action;
		setIsPresented(true);
	});

	const allowNextClose = useCallback(() => {
		setIsRemoveAllowed(true);
	}, []);

	const closeWithoutConfirmation = useCallback(() => {
		allowNextClose();
		setTimeout(() => router.back(), 0);
	}, [allowNextClose, router]);

	const requestClose = useCallback(() => {
		if (!enabled) {
			closeWithoutConfirmation();
			return;
		}

		pendingActionRef.current = null;
		setIsPresented(true);
	}, [closeWithoutConfirmation, enabled]);

	const discard = useCallback(() => {
		allowNextClose();
		setIsPresented(false);
		onDiscard?.();

		const pendingAction = pendingActionRef.current;
		pendingActionRef.current = null;

		setTimeout(() => {
			if (pendingAction) {
				navigation.dispatch(pendingAction);
				return;
			}

			router.back();
		}, 0);
	}, [allowNextClose, navigation, onDiscard, router]);

	return {
		allowNextClose,
		closeWithoutConfirmation,
		discard,
		isPresented,
		requestClose,
		setIsPresented
	};
};

export default useDiscardChangesConfirmation;
