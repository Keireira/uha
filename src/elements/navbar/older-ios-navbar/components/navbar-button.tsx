import React from 'react';
import * as Haptics from 'expo-haptics';
import styled from 'styled-components/native';

import type { GestureResponderEvent } from 'react-native';

const Root = styled.Pressable`
	flex: 1;
	width: 48px;
	height: 48px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

type Props = React.PropsWithChildren<
	{
		isFocused?: boolean;
		onActivePress?: (event: GestureResponderEvent) => void;
	} & React.ComponentProps<typeof Root>
>;

const NavbarButton = ({ style, children, isFocused, onPress, onLongPress, onActivePress, ...props }: Props) => {
	const onPressHd = (event: GestureResponderEvent) => {
		if (onActivePress && isFocused) {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);

			onActivePress(event);
		}

		if (!isFocused && onPress) {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

			onPress(event);
		}
	};

	const onLongPressHd = (event: GestureResponderEvent) => {
		if (!onLongPress) return;

		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
		onLongPress(event);
	};

	return (
		<Root {...props} onPress={onPressHd} onLongPress={onLongPressHd}>
			{React.Children.map(children, (child) =>
				React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<Props>, { isFocused }) : child
			)}
		</Root>
	);
};

export default NavbarButton;
