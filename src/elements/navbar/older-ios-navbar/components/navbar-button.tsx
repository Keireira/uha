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

const NavbarButton = ({ style, ...props }: React.ComponentProps<typeof Root>) => {
	const onPressHd = (event: GestureResponderEvent) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

		if (props.onPress) {
			props.onPress(event);
		}
	};

	return <Root {...props} onPress={onPressHd} />;
};

export default NavbarButton;
