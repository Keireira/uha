import React from 'react';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Pressable } from 'react-native';
import * as AvatarPrimitive from '@rn-primitives/avatar';
import Root, { Image, FallbackText } from './avatar.styles';

import type { Props } from './avatar.d';

const Avatar = ({ uri, color, alt = '', fallback = '', onPress = () => {} }: Props) => {
	const scale = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }]
		};
	});

	const handlePressIn = () => {
		scale.value = withSpring(0.98, {
			damping: 15,
			stiffness: 300
		});
	};

	const handlePressOut = () => {
		scale.value = withSpring(1, {
			damping: 15,
			stiffness: 300
		});
	};

	return (
		<Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>
			<AvatarPrimitive.Root alt={alt} asChild>
				<Root $color={color} style={animatedStyle}>
					<Image source={{ uri }} />

					<AvatarPrimitive.Fallback asChild>
						<FallbackText>{fallback}</FallbackText>
					</AvatarPrimitive.Fallback>
				</Root>
			</AvatarPrimitive.Root>
		</Pressable>
	);
};

export default Avatar;
