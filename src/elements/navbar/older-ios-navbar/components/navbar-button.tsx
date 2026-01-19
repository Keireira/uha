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
	} & React.ComponentProps<typeof Root>
>;

const NavbarButton = ({ style, children, isFocused, onPress, onLongPress, ...props }: Props) => {
	const onPressHd = (event: GestureResponderEvent) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

		if (onPress) {
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
